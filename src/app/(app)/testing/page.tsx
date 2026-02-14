"use client";

import { useState } from "react";
import {
  FlaskConical,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Zap,
  Wifi,
  Gauge,
  Cog,
  Layers,
  Battery,
  SkipForward,
} from "lucide-react";
import { sampleProject } from "@/lib/data";
import type { TestProcedure } from "@/lib/data";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  power: Zap,
  connectivity: Wifi,
  sensor: Gauge,
  actuator: Cog,
  integration: Layers,
  stress: Battery,
};

const statusStyles = {
  pending: { icon: Clock, color: "text-muted", bg: "bg-muted/10", label: "Pending" },
  pass: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Pass" },
  fail: { icon: XCircle, color: "text-danger", bg: "bg-danger/10", label: "Fail" },
  skipped: { icon: SkipForward, color: "text-muted", bg: "bg-muted/10", label: "Skipped" },
};

function TestCard({ test }: { test: TestProcedure }) {
  const [expanded, setExpanded] = useState(test.status === "pending");
  const status = statusStyles[test.status];
  const StatusIcon = status.icon;
  const CatIcon = categoryIcons[test.category] || FlaskConical;
  const completedSteps = test.steps.filter((s) => s.passed !== undefined).length;

  return (
    <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 text-left hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${status.bg}`}>
              <CatIcon className={`h-5 w-5 ${status.color}`} />
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
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${status.bg} ${status.color}`}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
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
                  <th className="px-4 py-2 text-left font-medium">
                    Expected
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Actual</th>
                  <th className="px-4 py-2 text-center font-medium w-20">
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
                    <td className="px-4 py-3 text-sm">
                      {step.instruction}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {step.expected}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">
                      {step.actual || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {step.passed === true ? (
                        <span className="text-xs font-medium text-success">
                          PASS
                        </span>
                      ) : step.passed === false ? (
                        <span className="text-xs font-medium text-danger">
                          FAIL
                        </span>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
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
  const tests = sampleProject.tests;
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered =
    statusFilter === "all"
      ? tests
      : tests.filter((t) => t.status === statusFilter);

  const passCount = tests.filter((t) => t.status === "pass").length;
  const failCount = tests.filter((t) => t.status === "fail").length;
  const pendingCount = tests.filter((t) => t.status === "pending").length;
  const totalSteps = tests.reduce((sum, t) => sum + t.steps.length, 0);
  const passedSteps = tests.reduce(
    (sum, t) => sum + t.steps.filter((s) => s.passed === true).length,
    0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <FlaskConical className="h-4 w-4" />
          Hardware Testing
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Testing</h1>
        <p className="mt-1 text-muted">
          Structured test procedures to validate your build. Record results and
          track pass/fail status.
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
          <span className="font-bold">
            {Math.round((passedSteps / totalSteps) * 100)}%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-border overflow-hidden flex">
          <div
            className="h-full bg-success transition-all"
            style={{ width: `${(passedSteps / totalSteps) * 100}%` }}
          />
          {failCount > 0 && (
            <div
              className="h-full bg-danger transition-all"
              style={{ width: `${(failCount / tests.length) * 100 * 0.5}%` }}
            />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-2">
        {["all", "pass", "fail", "pending", "skipped"].map((s) => (
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
