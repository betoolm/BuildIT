"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ──

export type ProjectPhase =
  | "ideation"
  | "parts"
  | "assembly"
  | "wiring"
  | "firmware"
  | "testing"
  | "complete";

export interface BOMItem {
  id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  specs: Record<string, string>;
  searchTerm?: string;
  estimatedPrice?: string;
  identified?: boolean;
}

export interface AssemblyStep {
  id: string;
  order: number;
  title: string;
  description: string;
  partsUsed: string[];
  warnings?: string;
  tips?: string;
  completed: boolean;
}

export interface WireConnection {
  id: string;
  from: { part: string; pin: string };
  to: { part: string; pin: string };
  wireColor?: string;
  signal: string;
  notes?: string;
}

export interface PowerRail {
  voltage: string;
  source: string;
  consumers: string[];
}

export interface CodeSnippet {
  id: string;
  name: string;
  filename: string;
  language: string;
  description: string;
  code: string;
  dependencies: string[];
  installInstructions?: string;
}

export interface TestProcedure {
  id: string;
  name: string;
  category: string;
  steps: TestStep[];
  status: "pending" | "pass" | "fail" | "skipped";
}

export interface TestStep {
  id: string;
  instruction: string;
  expected: string;
  actual?: string;
  passed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface VisionResult {
  summary: string;
  identifiedParts: { name: string; confidence: string; notes: string }[];
  wiringCheck: {
    connection: string;
    status: string;
    detail: string;
  }[];
  issues: { severity: string; description: string }[];
  checklist: { item: string; status: string; note: string }[];
  suggestions: string[];
}

export interface ProjectState {
  description: string;
  phase: ProjectPhase;
  messages: ChatMessage[];
  bom: BOMItem[];
  assemblySteps: AssemblyStep[];
  connections: WireConnection[];
  powerRails: PowerRail[];
  designNotes: string[];
  codeSnippets: CodeSnippet[];
  testPlan: TestProcedure[];
  warnings: string[];
  troubleshooting: string[];
  aiEnabled: boolean;
  loading: boolean;
  visionResult: VisionResult | null;
  visionLoading: boolean;
}

interface ProjectContextType extends ProjectState {
  sendMessage: (content: string) => Promise<void>;
  setPhase: (phase: ProjectPhase) => void;
  toggleStepComplete: (stepId: string) => void;
  updateTestStep: (
    testId: string,
    stepId: string,
    actual: string,
    passed: boolean
  ) => void;
  takeWiringPhoto: (imageBase64: string) => Promise<void>;
  clearVisionResult: () => void;
  resetProject: () => void;
  hasProjectData: boolean;
}

const initialState: ProjectState = {
  description: "",
  phase: "ideation",
  messages: [],
  bom: [],
  assemblySteps: [],
  connections: [],
  powerRails: [],
  designNotes: [],
  codeSnippets: [],
  testPlan: [],
  warnings: [],
  troubleshooting: [],
  aiEnabled: true,
  loading: false,
  visionResult: null,
  visionLoading: false,
};

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProjectState>({
    ...initialState,
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Welcome to BuildIT! I'll help you go from an idea to a working hardware product.\n\nTell me what you want to build — even a rough idea is fine. For example:\n- \"I want to build a robotic gripper controlled by hand gestures\"\n- \"I need a weather station that posts data to the cloud\"\n- \"I want an LED matrix display that shows notifications\"\n\nDescribe your idea and I'll ask the right questions to figure out exactly what you need.",
        timestamp: new Date().toISOString(),
      },
    ],
  });

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMsg],
        loading: true,
      }));

      try {
        // Build messages for the API (skip the welcome message internal ID details)
        const allMessages = [
          ...state.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user" as const, content },
        ];

        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: allMessages,
            currentPhase: state.phase,
            projectContext: {
              description: state.description || content,
              partsCount: state.bom.length,
              connectionsCount: state.connections.length,
            },
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to get response");
        }

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content:
            data.message ||
            "I received your message but couldn't generate a detailed response. Please try again.",
          timestamp: new Date().toISOString(),
        };

        setState((prev) => {
          const next = { ...prev };
          next.messages = [...prev.messages, userMsg, aiMsg];
          next.loading = false;
          next.aiEnabled = data.aiEnabled !== false;

          // Update description: set it from first user message, or update
          // it when the AI generates a fresh BOM (means new project scope)
          if (!prev.description && content.length > 10) {
            next.description = content;
          } else if (data.bom?.length && data.bom.length > 0) {
            // AI sent a new BOM — update description to the latest user message
            // so the project title reflects what the user most recently asked for
            next.description = content;
          }

          // Merge in any structured data from the AI response
          if (data.bom?.length) {
            next.bom = data.bom.map(
              (
                b: BOMItem & { searchTerm?: string; estimatedPrice?: string },
                i: number
              ) => ({
                ...b,
                id: b.id || `p${i + 1}`,
                identified: false,
              })
            );
            if (prev.phase === "ideation") next.phase = "parts";
          }
          if (data.assemblySteps?.length) {
            next.assemblySteps = data.assemblySteps.map(
              (s: AssemblyStep, i: number) => ({
                ...s,
                id: s.id || `a${i + 1}`,
                order: s.order || i + 1,
                completed: false,
              })
            );
          }
          if (data.connections?.length) {
            next.connections = data.connections;
          }
          if (data.powerRails?.length) {
            next.powerRails = data.powerRails;
          }
          if (data.designNotes?.length) {
            next.designNotes = data.designNotes;
          }
          if (data.codeSnippets?.length) {
            next.codeSnippets = data.codeSnippets.map(
              (c: CodeSnippet, i: number) => ({
                ...c,
                id: c.id || `fw${i + 1}`,
              })
            );
          }
          if (data.testPlan?.length) {
            next.testPlan = data.testPlan.map(
              (t: TestProcedure, i: number) => ({
                ...t,
                id: t.id || `t${i + 1}`,
                status: "pending" as const,
                steps: t.steps.map((s: TestStep, j: number) => ({
                  ...s,
                  id: s.id || `ts${i + 1}-${j + 1}`,
                })),
              })
            );
          }
          if (data.warnings?.length) {
            next.warnings = data.warnings;
          }
          if (data.troubleshooting?.length) {
            next.troubleshooting = data.troubleshooting;
          }

          return next;
        });
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : "Unknown error";
        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          content: `Sorry, I encountered an error: ${errMsg}. Please try again.`,
          timestamp: new Date().toISOString(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMsg, aiMsg],
          loading: false,
        }));
      }
    },
    [state.messages, state.phase, state.description, state.bom.length, state.connections.length]
  );

  const setPhase = useCallback((phase: ProjectPhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const toggleStepComplete = useCallback((stepId: string) => {
    setState((prev) => ({
      ...prev,
      assemblySteps: prev.assemblySteps.map((s) =>
        s.id === stepId ? { ...s, completed: !s.completed } : s
      ),
    }));
  }, []);

  const updateTestStep = useCallback(
    (testId: string, stepId: string, actual: string, passed: boolean) => {
      setState((prev) => ({
        ...prev,
        testPlan: prev.testPlan.map((t) => {
          if (t.id !== testId) return t;
          const steps = t.steps.map((s) =>
            s.id === stepId ? { ...s, actual, passed } : s
          );
          const allDone = steps.every((s) => s.passed !== undefined);
          const allPass = steps.every((s) => s.passed === true);
          return {
            ...t,
            steps,
            status: allDone
              ? allPass
                ? ("pass" as const)
                : ("fail" as const)
              : ("pending" as const),
          };
        }),
      }));
    },
    []
  );

  const takeWiringPhoto = useCallback(
    async (imageBase64: string) => {
      setState((prev) => ({ ...prev, visionLoading: true, visionResult: null }));

      try {
        const res = await fetch("/api/vision-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: imageBase64,
            projectContext: {
              connections: state.connections,
              parts: state.bom.map((b) => ({
                name: b.name,
                category: b.category,
              })),
              currentStep:
                state.assemblySteps.find((s) => !s.completed)?.title || "",
            },
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Vision check failed");
        }

        setState((prev) => ({
          ...prev,
          visionResult: data,
          visionLoading: false,
        }));
      } catch (error) {
        const errMsg =
          error instanceof Error ? error.message : "Unknown error";
        setState((prev) => ({
          ...prev,
          visionResult: {
            summary: `Error: ${errMsg}`,
            identifiedParts: [],
            wiringCheck: [],
            issues: [
              {
                severity: "warning",
                description: `Could not analyze photo: ${errMsg}`,
              },
            ],
            checklist: [],
            suggestions: [],
          },
          visionLoading: false,
        }));
      }
    },
    [state.connections, state.bom, state.assemblySteps]
  );

  const clearVisionResult = useCallback(() => {
    setState((prev) => ({ ...prev, visionResult: null }));
  }, []);

  const resetProject = useCallback(() => {
    setState({
      ...initialState,
      messages: [
        {
          id: "welcome-reset",
          role: "assistant",
          content:
            "Project reset! Tell me what you'd like to build next.",
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }, []);

  const hasProjectData =
    state.bom.length > 0 ||
    state.assemblySteps.length > 0 ||
    state.connections.length > 0 ||
    state.codeSnippets.length > 0;

  return (
    <ProjectContext.Provider
      value={{
        ...state,
        sendMessage,
        setPhase,
        toggleStepComplete,
        updateTestStep,
        takeWiringPhoto,
        clearVisionResult,
        resetProject,
        hasProjectData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used inside <ProjectProvider>");
  }
  return ctx;
}
