"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  Lightbulb,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  Info,
  Package,
  Camera,
  Box,
  Cable,
  Code,
  FlaskConical,
} from "lucide-react";
import { sampleProject, ideationConversation, phaseOrder, phaseLabels } from "@/lib/data";
import type { AIMessage } from "@/lib/data";

const phaseIcons = {
  ideation: Lightbulb,
  parts: Camera,
  assembly: Box,
  wiring: Cable,
  firmware: Code,
  testing: FlaskConical,
  complete: CheckCircle2,
};

const phaseHrefs: Record<string, string> = {
  ideation: "/project",
  parts: "/parts",
  assembly: "/assembly",
  wiring: "/schematics",
  firmware: "/firmware",
  testing: "/testing",
  complete: "/project",
};

const messageStyles: Record<string, string> = {
  question: "border-primary/20 bg-primary/5",
  suggestion: "border-success/20 bg-success/5",
  resource: "border-accent/20 bg-accent/5",
  warning: "border-danger/20 bg-danger/5",
  code: "border-secondary/20 bg-secondary/5",
};

const messageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  question: MessageSquare,
  suggestion: Lightbulb,
  resource: BookOpen,
  warning: AlertTriangle,
  code: Code,
};

export default function ProjectPage() {
  const [messages, setMessages] = useState<AIMessage[]>(ideationConversation);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const project = sampleProject;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const ts = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

    const userMsg: AIMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: ts,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg: AIMessage = {
        id: `m-${Date.now() + 1}`,
        role: "assistant",
        content:
          "Good question! Let me think about that in the context of your Smart Plant Monitor. Based on the ESP32-S3's ADC capabilities and your two-plant requirement, I'd recommend keeping both sensors on separate ADC channels (GPIO34 and GPIO35) rather than multiplexing. This gives you simultaneous readings and simpler firmware. Want me to update the schematic?",
        timestamp: ts,
        type: "suggestion",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  const currentPhaseIndex = phaseOrder.indexOf(project.phase);
  const completedParts = project.parts.filter((p) => p.identified).length;
  const completedAssembly = project.assemblySteps.filter((s) => s.completed).length;
  const passedTests = project.tests.filter((t) => t.status === "pass").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <Lightbulb className="h-4 w-4" />
          Project Workspace
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{project.name}</h1>
        <p className="mt-1 text-muted">{project.description}</p>
      </div>

      {/* Phase progress */}
      <div className="mb-8 rounded-xl border border-border bg-background p-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {phaseOrder.filter((p) => p !== "complete").map((phase, i) => {
            const Icon = phaseIcons[phase];
            const isComplete = i < currentPhaseIndex;
            const isCurrent = phase === project.phase;
            return (
              <div key={phase} className="flex items-center shrink-0">
                {i > 0 && (
                  <div
                    className={`h-0.5 w-6 mx-1 ${
                      isComplete ? "bg-success" : "bg-border"
                    }`}
                  />
                )}
                <Link
                  href={phaseHrefs[phase]}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isCurrent
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : isComplete
                      ? "bg-success/10 text-success"
                      : "text-muted hover:bg-surface"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" />
                  )}
                  {phaseLabels[phase]}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Chat */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted">
              Ask questions, refine your design, get resources
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[600px] min-h-[400px]">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const MsgIcon = msg.type ? messageIcons[msg.type] : Info;
              const style = msg.type
                ? messageStyles[msg.type]
                : "border-border bg-surface";

              return (
                <div
                  key={msg.id}
                  className={`${isUser ? "ml-8" : "mr-4"}`}
                >
                  <div
                    className={`rounded-xl border p-4 ${
                      isUser ? "border-border bg-surface" : style
                    }`}
                  >
                    {!isUser && msg.type && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <MsgIcon className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-medium text-primary capitalize">
                          {msg.type}
                        </span>
                      </div>
                    )}
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                    <div className="mt-2 text-xs text-muted">{msg.timestamp}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your project, request changes, or get resources..."
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                className="rounded-lg bg-primary p-2.5 text-white transition-colors hover:bg-primary-dark"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Project summary sidebar */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h3 className="font-semibold mb-4">Project Summary</h3>
            <div className="space-y-3">
              <Link href="/parts" className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted" />
                  <span>Parts</span>
                </div>
                <span className="text-sm font-medium">
                  {completedParts}/{project.parts.length} identified
                </span>
              </Link>
              <Link href="/assembly" className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <Box className="h-4 w-4 text-muted" />
                  <span>Assembly</span>
                </div>
                <span className="text-sm font-medium">
                  {completedAssembly}/{project.assemblySteps.length} steps
                </span>
              </Link>
              <Link href="/schematics" className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <Cable className="h-4 w-4 text-muted" />
                  <span>Connections</span>
                </div>
                <span className="text-sm font-medium">
                  {project.schematic.connections.length} wires
                </span>
              </Link>
              <Link href="/firmware" className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <Code className="h-4 w-4 text-muted" />
                  <span>Firmware</span>
                </div>
                <span className="text-sm font-medium">
                  {project.firmware.length} modules
                </span>
              </Link>
              <Link href="/testing" className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors">
                <div className="flex items-center gap-2 text-sm">
                  <FlaskConical className="h-4 w-4 text-muted" />
                  <span>Tests</span>
                </div>
                <span className="text-sm font-medium">
                  {passedTests}/{project.tests.length} passed
                </span>
              </Link>
            </div>
          </div>

          {/* Next step */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm">
            <h3 className="font-semibold text-primary mb-2">Next Step</h3>
            <p className="text-sm text-muted mb-4">
              Continue to the wiring phase to create your schematic and wire all
              connections.
            </p>
            <Link
              href="/schematics"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Open Schematics
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* BOM preview */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Bill of Materials</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {project.parts.map((part) => (
                <div
                  key={part.id}
                  className="flex items-center gap-2 text-sm p-1.5"
                >
                  {part.identified ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                  ) : (
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-muted" />
                  )}
                  <span className="truncate flex-1">{part.name}</span>
                  <span className="text-xs text-muted">x{part.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
