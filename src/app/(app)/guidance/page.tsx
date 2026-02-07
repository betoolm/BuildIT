"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Info,
  MessageSquare,
  ChevronRight,
  Settings,
  Maximize2,
  Send,
} from "lucide-react";
import { sampleGuidanceMessages, sampleTasks } from "@/lib/data";
import type { GuidanceMessage } from "@/lib/data";

const messageIconMap = {
  instruction: MessageSquare,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const messageColorMap = {
  instruction: "border-primary/30 bg-primary/5",
  warning: "border-accent/30 bg-accent/5",
  info: "border-secondary/30 bg-secondary/5",
  success: "border-success/30 bg-success/5",
};

const messageIconColorMap = {
  instruction: "text-primary",
  warning: "text-accent",
  info: "text-secondary",
  success: "text-success",
};

export default function GuidancePage() {
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [messages, setMessages] = useState<GuidanceMessage[]>(
    sampleGuidanceMessages
  );
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const activeTask = sampleTasks[0];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleCamera = async () => {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
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
        addMessage(
          "warning",
          "Camera access denied. Please allow camera permissions to use live guidance."
        );
      }
    }
  };

  const addMessage = (type: GuidanceMessage["type"], text: string) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, type, text, timestamp },
    ]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage("info", `You: ${inputText}`);
    setInputText("");
    // Simulate AI response
    setTimeout(() => {
      addMessage(
        "instruction",
        "I can see what you're pointing at. That's the capacitor — it looks swollen on top. That's a sign of failure and it needs to be replaced. The part number should be printed on the side. Can you show me?"
      );
    }, 1500);
  };

  const currentStepIndex = activeTask.steps.findIndex((s) => !s.completed);
  const currentStep =
    currentStepIndex >= 0 ? activeTask.steps[currentStepIndex] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Live AI Guidance</h1>
        <p className="mt-1 text-muted">
          Real-time AI coaching through your camera feed.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-black">
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-white/60">
                <CameraOff className="h-16 w-16" />
                <div className="text-center">
                  <p className="text-lg font-medium">Camera is off</p>
                  <p className="text-sm">
                    Enable your camera to start live AI guidance
                  </p>
                </div>
              </div>
            )}

            {/* Camera overlay - current step */}
            {cameraOn && currentStep && (
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-black/70 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm text-white/70 mb-1">
                  <span>
                    Step {currentStepIndex + 1} of {activeTask.steps.length}
                  </span>
                </div>
                <p className="font-medium text-white">
                  {currentStep.instruction}
                </p>
                {currentStep.safetyWarning && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {currentStep.safetyWarning}
                  </div>
                )}
              </div>
            )}

            {/* Recording indicator */}
            {cameraOn && (
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
                <div className="relative h-2.5 w-2.5">
                  <div className="absolute inset-0 rounded-full bg-danger animate-pulse-ring" />
                  <div className="absolute inset-0 rounded-full bg-danger" />
                </div>
                <span className="text-xs font-medium text-white">
                  AI Active
                </span>
              </div>
            )}

            {/* Fullscreen button */}
            <button className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white/70 backdrop-blur-sm transition-colors hover:text-white">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleCamera}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
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
              {cameraOn ? "Stop Camera" : "Start Camera"}
            </button>
            <button
              onClick={() => setMicOn(!micOn)}
              className={`rounded-xl p-2.5 transition-colors ${
                micOn
                  ? "bg-surface text-foreground hover:bg-border"
                  : "bg-danger/10 text-danger"
              }`}
              title={micOn ? "Mute microphone" : "Unmute microphone"}
            >
              {micOn ? (
                <Mic className="h-4 w-4" />
              ) : (
                <MicOff className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => setAudioOn(!audioOn)}
              className={`rounded-xl p-2.5 transition-colors ${
                audioOn
                  ? "bg-surface text-foreground hover:bg-border"
                  : "bg-danger/10 text-danger"
              }`}
              title={audioOn ? "Mute AI voice" : "Unmute AI voice"}
            >
              {audioOn ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
            <button
              className="rounded-xl p-2.5 bg-surface text-foreground hover:bg-border transition-colors"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI Chat / Messages */}
        <div className="flex flex-col rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h2 className="font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted">
              {activeTask.title}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[500px] min-h-[300px]">
            {messages.map((msg) => {
              const Icon = messageIconMap[msg.type];
              return (
                <div
                  key={msg.id}
                  className={`rounded-lg border p-3 ${messageColorMap[msg.type]}`}
                >
                  <div className="flex items-start gap-2">
                    <Icon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${messageIconColorMap[msg.type]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="mt-1 text-xs text-muted">{msg.timestamp}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Text input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a question..."
                className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                className="rounded-lg bg-primary p-2 text-white transition-colors hover:bg-primary-dark"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Task steps sidebar */}
          <div className="border-t border-border">
            <div className="px-4 py-3">
              <h3 className="text-sm font-semibold">Procedure Steps</h3>
            </div>
            <div className="px-4 pb-4 space-y-1.5 max-h-[200px] overflow-y-auto">
              {activeTask.steps.map((step, i) => (
                <div
                  key={step.id}
                  className={`flex items-start gap-2 rounded-lg p-2 text-sm ${
                    i === currentStepIndex
                      ? "bg-primary/10 text-primary font-medium"
                      : step.completed
                      ? "text-muted line-through"
                      : "text-muted"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : i === currentStepIndex ? (
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    <div className="mt-1 h-3 w-3 shrink-0 rounded-full border border-current ml-0.5" />
                  )}
                  <span className="leading-tight">{step.instruction}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
