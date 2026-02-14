"use client";

import { useState } from "react";
import {
  Box,
  CheckCircle2,
  Circle,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Package,
} from "lucide-react";
import { sampleProject } from "@/lib/data";

export default function AssemblyPage() {
  const steps = sampleProject.assemblySteps;
  const parts = sampleProject.parts;
  const [activeStep, setActiveStep] = useState<string | null>(() => {
    const first = steps.find((s) => !s.completed);
    return first?.id || null;
  });

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  const getPartName = (id: string) => parts.find((p) => p.id === id)?.name || id;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <Box className="h-4 w-4" />
          3D Assembly Guide
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Assembly</h1>
        <p className="mt-1 text-muted">
          Step-by-step assembly instructions. Follow each step in order for a
          clean build.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6 rounded-xl border border-border bg-background p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {completedCount} of {steps.length} steps completed
          </span>
          <span className="text-sm font-bold">{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-border">
          <div
            className="h-full rounded-full bg-success transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Step list */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="border-b border-border px-4 py-3">
              <h2 className="font-semibold text-sm">Steps</h2>
            </div>
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {steps.map((step) => {
                const isCurrent = step.id === activeStep;
                const currentStepIndex = steps.findIndex((s) => !s.completed);
                const isNext = steps.indexOf(step) === currentStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      isCurrent ? "bg-primary/5" : "hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {step.completed ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                      ) : isNext ? (
                        <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted/30" />
                      )}
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-medium truncate ${
                            step.completed ? "text-muted line-through" : ""
                          }`}
                        >
                          {step.order}. {step.title}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active step detail */}
        <div className="lg:col-span-2">
          {activeStep ? (
            (() => {
              const step = steps.find((s) => s.id === activeStep)!;
              return (
                <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
                  {/* 3D visualization placeholder */}
                  <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <Box className="h-16 w-16 mx-auto mb-3 opacity-40" />
                      <p className="text-lg font-medium">3D Assembly View</p>
                      <p className="text-sm mt-1">
                        Step {step.order}: {step.title}
                      </p>
                      <p className="text-xs mt-2 text-white/40">
                        Interactive 3D model would render here showing part
                        placement and orientation
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
                      Step {step.order}/{steps.length}
                    </div>
                    {step.completed && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-success/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Step details */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-1">
                      Step {step.order}: {step.title}
                    </h2>
                    <p className="text-muted leading-relaxed">
                      {step.description}
                    </p>

                    {/* Parts used */}
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-muted mb-2">
                        PARTS NEEDED
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {step.partsUsed.map((pId) => (
                          <span
                            key={pId}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium"
                          >
                            <Package className="h-3 w-3 text-primary" />
                            {getPartName(pId)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Warning */}
                    {step.warnings && (
                      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-accent/30 bg-accent/5 p-4">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-accent">
                            Safety Warning
                          </h4>
                          <p className="text-sm text-accent/80 mt-0.5">
                            {step.warnings}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tips */}
                    {step.tips && (
                      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <Lightbulb className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-primary">
                            AI Tip
                          </h4>
                          <p className="text-sm text-primary/80 mt-0.5">
                            {step.tips}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-background text-muted">
              Select a step to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
