"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  MapPin,
  Clock,
  ChevronDown,
  ChevronRight,
  Eye,
  Shield,
  MessageSquare,
} from "lucide-react";
import { sampleTasks } from "@/lib/data";
import type { Task } from "@/lib/data";

const priorityStyles = {
  urgent: "bg-danger/10 text-danger border-danger/20",
  high: "bg-accent/10 text-accent border-accent/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted/10 text-muted border-muted/20",
};

const statusStyles = {
  in_progress: "bg-primary/10 text-primary",
  pending: "bg-muted/10 text-muted",
  completed: "bg-success/10 text-success",
};

function TaskCard({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(task.status === "in_progress");
  const completedSteps = task.steps.filter((s) => s.completed).length;
  const progress = Math.round((completedSteps / task.steps.length) * 100);
  const currentStepIndex = task.steps.findIndex((s) => !s.completed);

  return (
    <div
      id={task.id}
      className="rounded-xl border border-border bg-background shadow-sm overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 text-left hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                  priorityStyles[task.priority]
                }`}
              >
                {task.priority === "urgent" && (
                  <AlertTriangle className="mr-1 h-3 w-3" />
                )}
                {task.priority}
              </span>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                  statusStyles[task.status]
                }`}
              >
                {task.status.replace("_", " ")}
              </span>
              <span className="text-xs text-muted">{task.skill}</span>
            </div>
            <h3 className="font-semibold text-base">{task.title}</h3>
            <p className="mt-1 text-sm text-muted">{task.description}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted flex-wrap">
              {task.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {task.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{task.estimatedMinutes} min
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-sm font-medium">
                {completedSteps}/{task.steps.length}
              </div>
              <div className="text-xs text-muted">steps</div>
              <div className="mt-1.5 h-1.5 w-24 rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-muted" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded steps */}
      {expanded && (
        <div className="border-t border-border">
          <div className="p-5 space-y-3">
            {task.steps.map((step, i) => {
              const isCurrent = i === currentStepIndex;
              return (
                <div
                  key={step.id}
                  className={`rounded-lg border p-4 ${
                    isCurrent
                      ? "border-primary/30 bg-primary/5"
                      : step.completed
                      ? "border-success/20 bg-success/5"
                      : "border-border bg-surface"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : isCurrent ? (
                        <div className="relative h-5 w-5">
                          <div className="absolute inset-0 rounded-full border-2 border-primary" />
                          <div className="absolute inset-1 rounded-full bg-primary" />
                        </div>
                      ) : (
                        <Circle className="h-5 w-5 text-muted/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted">
                          Step {i + 1}
                        </span>
                        {isCurrent && (
                          <span className="text-xs font-semibold text-primary">
                            CURRENT
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-0.5 font-medium ${
                          step.completed ? "line-through text-muted" : ""
                        }`}
                      >
                        {step.instruction}
                      </p>
                      {step.detail && (
                        <p className="mt-1 text-sm text-muted leading-relaxed">
                          {step.detail}
                        </p>
                      )}

                      {/* Safety warning */}
                      {step.safetyWarning && (
                        <div className="mt-2 flex items-start gap-2 rounded-md bg-accent/10 border border-accent/20 p-2.5 text-sm">
                          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span className="text-accent">
                            {step.safetyWarning}
                          </span>
                        </div>
                      )}

                      {/* AI hint */}
                      {step.aiHint && (
                        <div className="mt-2 flex items-start gap-2 rounded-md bg-secondary/10 border border-secondary/20 p-2.5 text-sm">
                          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                          <span className="text-secondary">
                            AI: {step.aiHint}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Start guidance button */}
          <div className="border-t border-border px-5 py-3">
            <Link
              href="/guidance"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Eye className="h-4 w-4" />
              Start AI Guidance for this Task
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered =
    statusFilter === "all"
      ? sampleTasks
      : sampleTasks.filter((t) => t.status === statusFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Tasks</h1>
        <p className="mt-1 text-muted">
          Your assigned work orders with step-by-step AI-guided procedures.
        </p>
      </div>

      {/* Status filter */}
      <div className="mb-6 flex items-center gap-2">
        {["all", "in_progress", "pending", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {status === "all"
              ? "All"
              : status.replace("_", " ").replace(/\b\w/g, (c) =>
                  c.toUpperCase()
                )}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-4">
        {filtered.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-muted/40" />
          <p className="mt-4 text-lg font-medium text-muted">
            No tasks found
          </p>
          <p className="mt-1 text-sm text-muted">
            Try adjusting your filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
