"use client";

import { useState, useRef } from "react";
import {
  Camera,
  CameraOff,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Cpu,
  Gauge,
  Cog,
  Plug,
  Battery,
  Box,
  Monitor,
  Radio,
  HelpCircle,
  Zap,
} from "lucide-react";
import { sampleProject, partCategoryLabels } from "@/lib/data";
import type { Part, PartCategory } from "@/lib/data";

const categoryIcons: Record<PartCategory, React.ComponentType<{ className?: string }>> = {
  microcontroller: Cpu,
  sensor: Gauge,
  actuator: Cog,
  passive: Circle,
  connector: Plug,
  power: Battery,
  mechanical: Box,
  display: Monitor,
  communication: Radio,
  other: HelpCircle,
};

export default function PartsPage() {
  const [cameraOn, setCameraOn] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const parts = sampleProject.parts;
  const categories = ["all", ...Array.from(new Set(parts.map((p) => p.category)))];

  const filtered = parts.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const identifiedCount = parts.filter((p) => p.identified).length;

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraOn(true);
      } catch {
        // camera denied
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <Camera className="h-4 w-4" />
          Parts Recognition & BOM
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Parts</h1>
        <p className="mt-1 text-muted">
          Scan components with your camera for AI identification, or browse your
          Bill of Materials.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera scanner */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="relative aspect-square bg-black">
              {cameraOn ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 border-[3px] border-primary/40 rounded-2xl m-4 pointer-events-none" />
                  <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 backdrop-blur-sm">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-medium text-white">
                      Scanning...
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-white/50">
                  <CameraOff className="h-12 w-12" />
                  <p className="text-sm">Camera off</p>
                  <p className="text-xs px-8 text-center">
                    Enable camera to scan and identify hardware components
                  </p>
                </div>
              )}
            </div>
            <div className="p-4">
              <button
                onClick={toggleCamera}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  cameraOn
                    ? "bg-danger/10 text-danger hover:bg-danger/20"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {cameraOn ? (
                  <CameraOff className="h-4 w-4" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {cameraOn ? "Stop Scanning" : "Start Scanning"}
              </button>
            </div>
          </div>

          {/* Scan tips */}
          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold mb-2">Scanning Tips</h3>
            <ul className="space-y-1.5 text-xs text-muted">
              <li className="flex items-start gap-2">
                <Zap className="h-3 w-3 mt-0.5 shrink-0 text-accent" />
                Hold parts 6-12 inches from camera
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-3 w-3 mt-0.5 shrink-0 text-accent" />
                Show the part markings / labels clearly
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-3 w-3 mt-0.5 shrink-0 text-accent" />
                Good lighting helps — avoid glare on shiny ICs
              </li>
              <li className="flex items-start gap-2">
                <Zap className="h-3 w-3 mt-0.5 shrink-0 text-accent" />
                Place small components on white paper for contrast
              </li>
            </ul>
          </div>
        </div>

        {/* BOM list */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search parts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <span className="text-sm text-muted whitespace-nowrap">
                {identifiedCount}/{parts.length} identified
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 text-muted shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    categoryFilter === cat
                      ? "bg-primary text-white"
                      : "bg-surface text-muted hover:text-foreground"
                  }`}
                >
                  {cat === "all" ? "All" : partCategoryLabels[cat as PartCategory]}
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted">Identification progress</span>
              <span className="font-medium">
                {Math.round((identifiedCount / parts.length) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-border">
              <div
                className="h-full rounded-full bg-success transition-all"
                style={{
                  width: `${(identifiedCount / parts.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Parts list */}
          <div className="space-y-2">
            {filtered.map((part) => {
              const Icon = categoryIcons[part.category];
              const isExpanded = expandedPart === part.id;

              return (
                <div
                  key={part.id}
                  className="rounded-xl border border-border bg-background shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedPart(isExpanded ? null : part.id)
                    }
                    className="w-full p-4 text-left hover:bg-surface/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {part.identified ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 shrink-0 text-muted/40" />
                      )}
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {part.name}
                          </span>
                          <span className="text-xs text-muted">
                            x{part.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-muted truncate">
                          {part.description}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted shrink-0" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border px-4 py-3 bg-surface/50">
                      {/* Specs table */}
                      <h4 className="text-xs font-semibold text-muted mb-2">
                        SPECIFICATIONS
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                        {Object.entries(part.specs).map(([key, val]) => (
                          <div key={key} className="flex justify-between text-xs py-0.5">
                            <span className="text-muted">{key}</span>
                            <span className="font-medium">{val}</span>
                          </div>
                        ))}
                      </div>

                      {part.footprint && (
                        <div className="text-xs text-muted mb-2">
                          <span className="font-medium">Footprint:</span>{" "}
                          {part.footprint}
                        </div>
                      )}

                      {part.imageHint && (
                        <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-2.5 text-xs">
                          <span className="font-medium text-secondary">
                            AI identification hint:
                          </span>{" "}
                          {part.imageHint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
