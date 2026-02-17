"use client";

import { useState } from "react";
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useProject, type TestProcedure } from "@/lib/project-context";
import Link from "next/link";

function TestCard({ test }: { test: TestProcedure }) {
  const { updateTestStep } = useProject();
  const [expanded, setExpanded] = useState(test.status === "pending");
  const completedSteps = test.steps.filter(
    (s) => s.passed !== undefined
  ).length;

  return (
    <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 text-left hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                test.status === "pass"
                  ? "bg-success/10"
                  : test.status === "fail"
                  ? "bg-danger/10"
                  : "bg-muted/10"
              }`}
            >
              {test.status === "pass" ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : test.status === "fail" ? (
                <XCircle className="h-5 w-5 text-danger" />
              ) : (
                <FlaskConical className="h-5 w-5 text-muted" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{test.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted capitalize">
                  {test.category}
                </span>
                <span className="text-xs text-muted">
                  {completedSteps}/{test.steps.length} steps
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                test.status === "pass"
                  ? "bg-success/10 text-success"
                  : test.status === "fail"
                  ? "bg-danger/10 text-danger"
                  : "bg-muted/10 text-muted"
              }`}
            >
              {test.status === "pass"
                ? "Pass"
                : test.status === "fail"
                ? "Fail"
                : "Pending"}
            </span>
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-muted" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-xs text-muted">
                  <th className="px-5 py-2 text-left font-medium w-8"></th>
                  <th className="px-4 py-2 text-left font-medium">
                    Instruction
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Expected</th>
                  <th className="px-4 py-2 text-left font-medium">Actual</th>
                  <th className="px-4 py-2 text-center font-medium w-28">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {test.steps.map((step) => (
                  <tr key={step.id} className="hover:bg-surface/50">
                    <td className="px-5 py-3">
                      {step.passed === true ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : step.passed === false ? (
                        <XCircle className="h-4 w-4 text-danger" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted/40" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{step.instruction}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {step.expected}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={step.actual || ""}
                        onChange={(e) =>
                          updateTestStep(
                            test.id,
                            step.id,
                            e.target.value,
                            step.passed ?? true
                          )
                        }
                        placeholder="Enter result..."
                        className="w-full rounded-md border border-border bg-surface px-2 py-1 text-xs outline-none focus:border-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() =>
                            updateTestStep(
                              test.id,
                              step.id,
                              step.actual || "",
                              true
                            )
                          }
                          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                            step.passed === true
                              ? "bg-success text-white"
                              : "bg-surface text-muted hover:text-success hover:bg-success/10 border border-border"
                          }`}
                        >
                          Pass
                        </button>
                        <button
                          onClick={() =>
                            updateTestStep(
                              test.id,
                              step.id,
                              step.actual || "",
                              false
                            )
                          }
                          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                            step.passed === false
                              ? "bg-danger text-white"
                              : "bg-surface text-muted hover:text-danger hover:bg-danger/10 border border-border"
                          }`}
                        >
                          Fail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TestingPage() {
  const { testPlan } = useProject();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered =
    statusFilter === "all"
      ? testPlan
      : testPlan.filter((t) => t.status === statusFilter);

  const passCount = testPlan.filter((t) => t.status === "pass").length;
  const failCount = testPlan.filter((t) => t.status === "fail").length;
  const pendingCount = testPlan.filter((t) => t.status === "pending").length;
  const totalSteps = testPlan.reduce((sum, t) => sum + t.steps.length, 0);
  const passedSteps = testPlan.reduce(
    (sum, t) => sum + t.steps.filter((s) => s.passed === true).length,
    0
  );
  const progressPct = totalSteps > 0 ? Math.round((passedSteps / totalSteps) * 100) : 0;

  if (testPlan.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <FlaskConical className="mx-auto h-16 w-16 text-muted/30" />
        <h1 className="mt-6 text-2xl font-bold">No Test Plan Yet</h1>
        <p className="mt-2 text-muted max-w-md mx-auto">
          Test procedures are generated by the AI once your project has
          firmware. Ask the AI to generate a test plan in the Project chat.
        </p>
        <Link
          href="/project"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go to Project
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <FlaskConical className="h-4 w-4" />
          Hardware Testing
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Testing</h1>
        <p className="mt-1 text-muted">
          AI-generated test procedures. Record results and mark each step as
          pass or fail.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="text-2xl font-bold text-success">{passCount}</div>
          <div className="text-xs text-muted">Tests Passed</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="text-2xl font-bold text-danger">{failCount}</div>
          <div className="text-xs text-muted">Tests Failed</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="text-2xl font-bold text-muted">{pendingCount}</div>
          <div className="text-xs text-muted">Pending</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <div className="text-2xl font-bold">
            {passedSteps}/{totalSteps}
          </div>
          <div className="text-xs text-muted">Steps Completed</div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-6 rounded-xl border border-border bg-background p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">Overall Test Progress</span>
          <span className="font-bold">{progressPct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-border overflow-hidden flex">
          <div
            className="h-full bg-success transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2">
        {["all", "pass", "fail", "pending"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Test list */}
      <div className="space-y-4">
        {filtered.map((test) => (
          <TestCard key={test.id} test={test} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <FlaskConical className="mx-auto h-12 w-12 text-muted/40" />
          <p className="mt-4 text-lg font-medium text-muted">
            No tests match this filter
          </p>
        </div>
      )}
    </div>
  );
}
