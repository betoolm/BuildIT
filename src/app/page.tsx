import Link from "next/link";
import {
  Lightbulb,
  Camera,
  Box,
  Cable,
  Code,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  HardHat,
  Cpu,
  Zap,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-fade-in-up">
              <HardHat className="h-4 w-4" />
              Your AI Hardware Building Assistant
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up-delay-1">
              From idea to{" "}
              <span className="text-primary">working product.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted sm:text-xl animate-fade-in-up-delay-2">
              BuildIT is your AI assistant for hardware projects. It asks the
              right questions, recognizes your parts, generates wiring
              schematics, writes firmware, and guides you through testing.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in-up-delay-3">
              <Link
                href="/project"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
              >
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/parts"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-base font-semibold transition-colors hover:bg-surface"
              >
                <Camera className="h-4 w-4" />
                Scan Parts
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section className="border-t border-border bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Idea to product in 6 steps
            </h2>
            <p className="mt-4 text-lg text-muted">
              AI guides you through every phase of building hardware.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Lightbulb,
                title: "1. Ideation",
                description:
                  "Describe your idea. AI asks the right questions to nail down scope, constraints, and requirements. It suggests components and generates a Bill of Materials.",
                href: "/project",
              },
              {
                icon: Camera,
                title: "2. Parts Recognition",
                description:
                  "Point your camera at components. AI identifies parts, reads markings, looks up datasheets, and maps everything to your BOM.",
                href: "/parts",
              },
              {
                icon: Box,
                title: "3. 3D Assembly",
                description:
                  "Step-by-step assembly instructions with part placement, orientation guides, and safety warnings. AI watches and confirms each step.",
                href: "/assembly",
              },
              {
                icon: Cable,
                title: "4. Wiring Schematics",
                description:
                  "Interactive wiring diagrams with pin-to-pin connections, wire colors, signal labels, and power rail maps. No missed connections.",
                href: "/schematics",
              },
              {
                icon: Code,
                title: "5. Firmware",
                description:
                  "AI generates starter firmware, library configs, and pin definitions based on your schematic. Edit, review, and flash.",
                href: "/firmware",
              },
              {
                icon: FlaskConical,
                title: "6. Testing",
                description:
                  "Structured test procedures for power, connectivity, sensors, and integration. Record results and validate your build.",
                href: "/testing",
              },
            ].map((step) => (
              <Link
                key={step.title}
                href={step.href}
                className="group relative rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {step.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What makes it different */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              AI that understands hardware
            </h2>
            <p className="mt-4 text-lg text-muted">
              Not just a chatbot — a purpose-built assistant for physical
              products.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MessageSquare,
                title: "Asks before it assumes",
                description:
                  "Starts with your idea and asks targeted questions about scope, environment, power, connectivity, and constraints before recommending anything.",
              },
              {
                icon: Camera,
                title: "Sees your parts",
                description:
                  "Camera-based recognition identifies ICs, sensors, connectors, and passives. Reads part markings and cross-references datasheets.",
              },
              {
                icon: Cpu,
                title: "Generates real schematics",
                description:
                  "Pin-accurate wiring diagrams with correct signal routing, pull-ups, decoupling, and power distribution. Not just block diagrams.",
              },
              {
                icon: Zap,
                title: "Writes working firmware",
                description:
                  "Generates compilable code with correct pin assignments, library initialization, and sensor reading logic matched to your specific hardware.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example project */}
      <section className="border-t border-border bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              See it in action
            </h2>
            <p className="mt-4 text-lg text-muted">
              Explore a sample project: an IoT Smart Plant Monitor built from
              scratch with BuildIT.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "12 parts", detail: "auto-identified from camera" },
              { label: "10 assembly steps", detail: "with safety warnings" },
              { label: "26 wire connections", detail: "pin-accurate schematic" },
              { label: "2 firmware modules", detail: "ready to compile" },
              { label: "6 test procedures", detail: "22 validation steps" },
              { label: "ESP32 + sensors", detail: "WiFi + battery powered" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                <div>
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-muted">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/project"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
            >
              Explore the Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <HardHat className="h-4 w-4" />
            <span className="font-semibold">BuildIT</span>
          </div>
          <p className="mt-2">
            AI Hardware Building Assistant — Idea to Product.
          </p>
        </div>
      </footer>
    </div>
  );
}
