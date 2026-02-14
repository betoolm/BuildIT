"use client";

import { useState } from "react";
import {
  Code,
  FileCode,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  Package,
} from "lucide-react";
import { sampleProject } from "@/lib/data";
import type { FirmwareModule } from "@/lib/data";

const statusStyles = {
  draft: { bg: "bg-muted/10", text: "text-muted", label: "Draft" },
  review: { bg: "bg-accent/10", text: "text-accent", label: "Review" },
  tested: { bg: "bg-primary/10", text: "text-primary", label: "Tested" },
  complete: { bg: "bg-success/10", text: "text-success", label: "Complete" },
};

function FirmwareCard({ module }: { module: FirmwareModule }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const status = statusStyles[module.status];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(module.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 text-left hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{module.name}</h3>
              <p className="text-xs text-muted mt-0.5">{module.filename}</p>
            </div>
          </div>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">{module.description}</p>
      </button>

      {expanded && (
        <div className="border-t border-border">
          {/* Dependencies */}
          <div className="px-5 py-3 border-b border-border bg-surface/50">
            <h4 className="text-xs font-semibold text-muted mb-2">
              DEPENDENCIES
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {module.dependencies.map((dep) => (
                <span
                  key={dep}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-xs font-mono"
                >
                  <Package className="h-3 w-3 text-muted" />
                  {dep}
                </span>
              ))}
            </div>
          </div>

          {/* Code */}
          <div className="relative">
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md bg-background/80 border border-border px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-surface"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-success" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <pre className="overflow-x-auto bg-slate-950 p-5 text-xs leading-relaxed text-slate-300 max-h-[500px]">
              <code>{module.code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FirmwarePage() {
  const modules = sampleProject.firmware;
  const allDeps = Array.from(
    new Set(modules.flatMap((m) => m.dependencies))
  ).sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <Code className="h-4 w-4" />
          Firmware Development
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Firmware</h1>
        <p className="mt-1 text-muted">
          AI-generated firmware modules based on your schematic. Review, edit,
          and flash to your microcontroller.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Firmware modules */}
        <div className="lg:col-span-2 space-y-4">
          {modules.map((mod) => (
            <FirmwareCard key={mod.id} module={mod} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status overview */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Module Status</h3>
            <div className="space-y-2">
              {modules.map((mod) => {
                const s = statusStyles[mod.status];
                return (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between text-sm p-1.5"
                  >
                    <div className="flex items-center gap-2">
                      {mod.status === "complete" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : mod.status === "tested" ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted" />
                      )}
                      <span className="truncate">{mod.name}</span>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All dependencies */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h3 className="font-semibold mb-3">All Libraries</h3>
            <div className="space-y-1.5">
              {allDeps.map((dep) => (
                <div
                  key={dep}
                  className="flex items-center gap-2 text-sm text-muted"
                >
                  <Package className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-mono text-xs">{dep}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pin mapping */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h3 className="font-semibold mb-3">Pin Mapping</h3>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted">SDA</span>
                <span>GPIO21</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">SCL</span>
                <span>GPIO22</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">SOIL_1</span>
                <span>GPIO34 (ADC)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">SOIL_2</span>
                <span>GPIO35 (ADC)</span>
              </div>
            </div>
          </div>

          {/* Flash instructions */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <h4 className="text-sm font-semibold text-primary mb-2">
              How to Flash
            </h4>
            <ol className="space-y-1.5 text-xs text-primary/80">
              <li>1. Install PlatformIO or Arduino IDE</li>
              <li>2. Add the libraries listed above</li>
              <li>3. Set board to &quot;ESP32-S3 Dev Module&quot;</li>
              <li>4. Connect via USB-C</li>
              <li>5. Update WiFi credentials in main.cpp</li>
              <li>6. Compile and upload</li>
            </ol>
          </div>

          {/* Warning */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
              <div className="text-xs text-accent/80">
                <span className="font-semibold text-accent">Before flashing:</span>{" "}
                Verify all wiring is correct. Incorrect wiring with active
                firmware can damage components.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
