"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Package,
  Camera,
  Box,
  Cable,
  Code,
  FlaskConical,
  Loader2,
  AlertTriangle,
  WifiOff,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useProject } from "@/lib/project-context";
import { phaseOrder, phaseLabels } from "@/lib/data";

const phaseIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  ideation: Lightbulb,
  parts: Camera,
  assembly: Box,
  wiring: Cable,
  firmware: Code,
  testing: FlaskConical,
  complete: CheckCircle2,
};

export default function ProjectPage() {
  const {
    description,
    phase,
    messages,
    bom,
    assemblySteps,
    connections,
    codeSnippets,
    testPlan,
    warnings,
    aiEnabled,
    loading,
    hasProjectData,
    sendMessage,
    setPhase,
    resetProject,
  } = useProject();

  const [input, setInput] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleReset = () => {
    resetProject();
    setShowResetConfirm(false);
  };

  const currentPhaseIndex = phaseOrder.indexOf(phase);
  const completedAssembly = assemblySteps.filter((s) => s.completed).length;
  const passedTests = testPlan.filter((t) => t.status === "pass").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted mb-1">
            <Lightbulb className="h-4 w-4" />
            Project Workspace
          </div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {description
              ? description.length > 60
                ? description.substring(0, 60) + "..."
                : description
              : "New Project"}
          </h1>
        </div>
        {hasProjectData ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 rounded-lg bg-danger/10 border border-danger/20 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/20 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            New Project
          </button>
        ) : description ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear Chat
          </button>
        ) : null}
      </div>

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div className="mb-6 rounded-xl border-2 border-danger/30 bg-danger/5 p-5">
          <div className="flex items-start gap-3">
            <Trash2 className="h-5 w-5 shrink-0 mt-0.5 text-danger" />
            <div className="flex-1">
              <h3 className="font-semibold text-danger">
                Start a new project?
              </h3>
              <p className="text-sm text-danger/70 mt-1">
                This will clear your current project including the parts list,
                assembly steps, wiring diagram, firmware, and test plan. This
                cannot be undone.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleReset}
                  className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90 transition-colors"
                >
                  Yes, start fresh
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI disabled banner */}
      {!aiEnabled && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4">
          <WifiOff className="h-5 w-5 shrink-0 mt-0.5 text-accent" />
          <div>
            <h3 className="text-sm font-semibold text-accent">
              AI Features Disabled
            </h3>
            <p className="text-sm text-accent/80 mt-1">
              Add <code className="bg-accent/10 px-1 rounded">MINIMAX_API_KEY</code> and{" "}
              <code className="bg-accent/10 px-1 rounded">MINIMAX_GROUP_ID</code> to your{" "}
              <code className="bg-accent/10 px-1 rounded">.env.local</code> file to enable
              AI coaching, BOM generation, and wiring verification.
            </p>
          </div>
        </div>
      )}

      {/* Phase progress */}
      {bom.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {phaseOrder
              .filter((p) => p !== "complete")
              .map((p, i) => {
                const Icon = phaseIcons[p];
                const isComplete = i < currentPhaseIndex;
                const isCurrent = p === phase;
                return (
                  <div key={p} className="flex items-center shrink-0">
                    {i > 0 && (
                      <div
                        className={`h-0.5 w-6 mx-1 ${isComplete ? "bg-success" : "bg-border"}`}
                      />
                    )}
                    <button
                      onClick={() => setPhase(p)}
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
                      {phaseLabels[p]}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Chat */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="border-b border-border px-5 py-3">
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted">
              {hasProjectData
                ? "Ask follow-up questions, request changes, or describe a completely new project."
                : "Describe your project. I'll ask questions and generate everything you need."}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[600px] min-h-[400px]">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={isUser ? "ml-8" : "mr-4"}>
                  <div
                    className={`rounded-xl border p-4 ${
                      isUser
                        ? "border-border bg-surface"
                        : "border-primary/20 bg-primary/5"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="mr-4">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Switch project hint when project already has data */}
          {hasProjectData && (
            <div className="border-t border-border bg-surface/50 px-5 py-2.5 flex items-center justify-between">
              <p className="text-xs text-muted">
                Want to build something else? Type your new idea below — the AI
                will generate fresh materials. Or{" "}
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-primary font-medium hover:underline"
                >
                  start completely fresh
                </button>
                .
              </p>
            </div>
          )}

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={
                  hasProjectData
                    ? "Ask a question, request changes, or describe a new project..."
                    : "Describe what you want to build..."
                }
                disabled={loading}
                className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="rounded-lg bg-primary p-2.5 text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
              <h3 className="text-sm font-semibold text-accent flex items-center gap-1.5 mb-2">
                <AlertTriangle className="h-4 w-4" />
                Warnings
              </h3>
              <ul className="space-y-1.5">
                {warnings.map((w, i) => (
                  <li key={i} className="text-xs text-accent/80">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Project summary — only show when we have data */}
          {bom.length > 0 && (
            <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <h3 className="font-semibold mb-4">Project Summary</h3>
              <div className="space-y-3">
                <Link
                  href="/parts"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-muted" />
                    <span>Parts</span>
                  </div>
                  <span className="text-sm font-medium">
                    {bom.length} items
                  </span>
                </Link>
                {assemblySteps.length > 0 && (
                  <Link
                    href="/assembly"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Box className="h-4 w-4 text-muted" />
                      <span>Assembly</span>
                    </div>
                    <span className="text-sm font-medium">
                      {completedAssembly}/{assemblySteps.length} steps
                    </span>
                  </Link>
                )}
                {connections.length > 0 && (
                  <Link
                    href="/schematics"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Cable className="h-4 w-4 text-muted" />
                      <span>Wiring</span>
                    </div>
                    <span className="text-sm font-medium">
                      {connections.length} connections
                    </span>
                  </Link>
                )}
                {codeSnippets.length > 0 && (
                  <Link
                    href="/firmware"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Code className="h-4 w-4 text-muted" />
                      <span>Firmware</span>
                    </div>
                    <span className="text-sm font-medium">
                      {codeSnippets.length} modules
                    </span>
                  </Link>
                )}
                {testPlan.length > 0 && (
                  <Link
                    href="/testing"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <FlaskConical className="h-4 w-4 text-muted" />
                      <span>Tests</span>
                    </div>
                    <span className="text-sm font-medium">
                      {passedTests}/{testPlan.length} passed
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* BOM preview */}
          {bom.length > 0 && (
            <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
              <h3 className="font-semibold mb-3">Bill of Materials</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {bom.map((part) => (
                  <div
                    key={part.id}
                    className="flex items-center gap-2 text-sm p-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                    <span className="truncate flex-1">{part.name}</span>
                    <span className="text-xs text-muted">x{part.quantity}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/parts"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                View full BOM <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Empty state */}
          {bom.length === 0 && (
            <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 text-center">
              <Lightbulb className="h-8 w-8 mx-auto text-primary/40 mb-3" />
              <h3 className="text-sm font-semibold text-primary mb-1">
                Start with your idea
              </h3>
              <p className="text-xs text-primary/60">
                Describe what you want to build in the chat. The AI will ask
                questions and generate your parts list, assembly steps, wiring,
                firmware, and test plan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
