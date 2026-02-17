"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
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
  ShoppingCart,
  Loader2,
  AlertTriangle,
  Shield,
  Image as ImageIcon,
  Lightbulb,
} from "lucide-react";
import { useProject } from "@/lib/project-context";
import { partCategoryLabels } from "@/lib/data";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
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
  const { bom, visionResult, visionLoading, takeWiringPhoto, clearVisionResult } =
    useProject();
  const [cameraOn, setCameraOn] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const categories = [
    "all",
    ...Array.from(new Set(bom.map((p) => p.category))),
  ];

  const filtered = bom.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

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
        // denied
      }
    }
  };

  const captureAndCheck = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.85);
    takeWiringPhoto(base64);
  }, [takeWiringPhoto]);

  // Empty state
  if (bom.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Parts & BOM</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Box className="h-16 w-16 text-muted/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No parts yet</h2>
          <p className="text-muted max-w-md mb-6">
            Start by describing your project in the Project workspace. The AI
            will generate a Bill of Materials with all the components you need.
          </p>
          <Link
            href="/project"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <Lightbulb className="h-4 w-4" />
            Go to Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <Camera className="h-4 w-4" />
          Parts Recognition & BOM
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Parts</h1>
        <p className="mt-1 text-muted">
          Your Bill of Materials. Use the camera to scan and verify components.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera scanner */}
        <div className="lg:col-span-1 space-y-4">
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
                    <span className="text-xs font-medium text-white">Live</span>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-white/50">
                  <CameraOff className="h-12 w-12" />
                  <p className="text-sm">Camera off</p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="p-4 space-y-2">
              <button
                onClick={toggleCamera}
                className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  cameraOn
                    ? "bg-danger/10 text-danger hover:bg-danger/20"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {cameraOn ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                {cameraOn ? "Stop Camera" : "Start Camera"}
              </button>
              {cameraOn && (
                <button
                  onClick={captureAndCheck}
                  disabled={visionLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                >
                  {visionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  Take Wiring Photo
                </button>
              )}
            </div>
          </div>

          {/* Privacy notice */}
          <div className="rounded-lg border border-border bg-surface p-3 text-xs text-muted">
            <div className="flex items-start gap-2">
              <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                Photos are only sent when you tap &quot;Take Wiring Photo&quot;. The camera
                feed is never auto-captured or streamed.
              </span>
            </div>
          </div>

          {/* Vision result */}
          {visionResult && (
            <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Analysis Result</h3>
                <button
                  onClick={clearVisionResult}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-sm text-muted mb-3">{visionResult.summary}</p>

              {visionResult.identifiedParts.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-muted mb-1">
                    IDENTIFIED PARTS
                  </h4>
                  {visionResult.identifiedParts.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs py-0.5">
                      <CheckCircle2
                        className={`h-3 w-3 ${
                          p.confidence === "high"
                            ? "text-success"
                            : p.confidence === "medium"
                            ? "text-accent"
                            : "text-muted"
                        }`}
                      />
                      <span>{p.name}</span>
                      <span className="text-muted">({p.confidence})</span>
                    </div>
                  ))}
                </div>
              )}

              {visionResult.issues.length > 0 && (
                <div className="mb-3 space-y-1.5">
                  <h4 className="text-xs font-semibold text-muted">ISSUES</h4>
                  {visionResult.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 rounded-md p-2 text-xs ${
                        issue.severity === "critical"
                          ? "bg-danger/10 text-danger"
                          : issue.severity === "warning"
                          ? "bg-accent/10 text-accent"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                      {issue.description}
                    </div>
                  ))}
                </div>
              )}

              {visionResult.checklist.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted mb-1">
                    CHECKLIST
                  </h4>
                  {visionResult.checklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs py-0.5">
                      {item.status === "pass" ? (
                        <CheckCircle2 className="h-3 w-3 text-success" />
                      ) : item.status === "fail" ? (
                        <AlertTriangle className="h-3 w-3 text-danger" />
                      ) : (
                        <Circle className="h-3 w-3 text-muted" />
                      )}
                      <span>{item.item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOM list */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
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
                  {cat === "all"
                    ? "All"
                    : partCategoryLabels[cat] || cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((part) => {
              const Icon = categoryIcons[part.category] || HelpCircle;
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
                          {part.estimatedPrice && (
                            <span className="text-xs text-success font-medium">
                              {part.estimatedPrice}
                            </span>
                          )}
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
                      {Object.keys(part.specs).length > 0 && (
                        <>
                          <h4 className="text-xs font-semibold text-muted mb-2">
                            SPECIFICATIONS
                          </h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                            {Object.entries(part.specs).map(([key, val]) => (
                              <div
                                key={key}
                                className="flex justify-between text-xs py-0.5"
                              >
                                <span className="text-muted">{key}</span>
                                <span className="font-medium">{val}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {part.searchTerm && (
                        <div className="flex items-center gap-2 mt-2">
                          <ShoppingCart className="h-3.5 w-3.5 text-muted" />
                          <span className="text-xs text-muted">
                            Search:{" "}
                            <span className="font-medium text-foreground">
                              {part.searchTerm}
                            </span>
                          </span>
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
