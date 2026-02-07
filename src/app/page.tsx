import Link from "next/link";
import {
  Eye,
  Cpu,
  Users,
  ArrowRight,
  Smartphone,
  Glasses,
  Headphones,
  Building2,
  Wrench,
  UserPlus,
  CheckCircle2,
  HardHat,
  Zap,
  Shield,
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
              AI-Powered Physical Work Guidance
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up-delay-1">
              See what you see.{" "}
              <span className="text-primary">Know what to do.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted sm:text-xl animate-fade-in-up-delay-2">
              AI that watches through your camera and coaches you through any
              skilled trade job in real time. Turn any worker into an expert,
              instantly.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in-up-delay-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/guidance"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-base font-semibold transition-colors hover:bg-surface"
              >
                <Eye className="h-4 w-4" />
                Try Live Guidance
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
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted">
              Wear a small camera. AI sees what you see and talks you through
              the job.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "AI Sees",
                description:
                  'Multimodal AI processes your live camera feed — identifying parts, reading labels, spotting wear patterns, and understanding the work environment.',
              },
              {
                icon: Cpu,
                title: "AI Reasons",
                description:
                  "The model cross-references what it sees with technical manuals, safety codes, and best practices to determine the right next step.",
              },
              {
                icon: Users,
                title: "AI Guides",
                description:
                  '"Turn off that valve." "Use the 3/8 inch wrench." "That part looks worn — replace it." Real-time voice coaching, step by step.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="relative rounded-2xl border border-border bg-background p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why now */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why now
            </h2>
            <p className="mt-4 text-lg text-muted">
              Three forces have converged to make this possible today.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Multimodal AI matured",
                description:
                  "Models can now see and reason about real-world situations reliably — reading gauges, identifying parts, and understanding spatial context.",
              },
              {
                icon: Smartphone,
                title: "Hardware is everywhere",
                description:
                  "Phones, AirPods, smart glasses — the cameras, mics, and speakers needed are already in workers' pockets.",
                extras: [Glasses, Headphones],
              },
              {
                icon: Shield,
                title: "Skilled labor shortage",
                description:
                  "Millions of trade jobs go unfilled. This makes upskilling economically urgent — and creates high-wage opportunity for workers.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-surface p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  {item.extras && (
                    <div className="flex gap-2">
                      {item.extras.map((ExtraIcon, j) => (
                        <ExtraIcon
                          key={j}
                          className="h-5 w-5 text-muted"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three approaches */}
      <section className="border-t border-border bg-surface py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Three paths to market
            </h2>
            <p className="mt-4 text-lg text-muted">
              Different approaches for different opportunities.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Enterprise SaaS",
                subtitle: "Sell to existing workforces",
                description:
                  "Deploy AI guidance across a company's field service or manufacturing teams. Reduce training time from months to days. Integrate with existing workflow and ticketing systems.",
                features: [
                  "Onboard new technicians in days, not months",
                  "Reduce error rates and rework",
                  "Capture institutional knowledge from experts",
                  "Compliance and safety documentation",
                ],
              },
              {
                icon: Wrench,
                title: "Vertical Platform",
                subtitle: "Own a trade end-to-end",
                description:
                  "Pick a vertical like HVAC repair or home healthcare. Build a full-stack, AI-superpowered workforce that delivers the service directly to customers.",
                features: [
                  "Full-stack service delivery",
                  "AI-powered quality assurance",
                  "Branded customer experience",
                  "Fastest path to revenue per worker",
                ],
              },
              {
                icon: UserPlus,
                title: "Open Platform",
                subtitle: "Anyone can become skilled",
                description:
                  "Build a marketplace where anyone can sign up, learn a trade through AI guidance, and start their own business or find work immediately.",
                features: [
                  "Democratize access to skilled trades",
                  "Workers earn while they learn",
                  "AI matches skills to local demand",
                  "Built-in business tools and invoicing",
                ],
              },
            ].map((approach, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl border border-border bg-background p-8 shadow-sm"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <approach.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  {approach.subtitle}
                </div>
                <h3 className="text-xl font-bold">{approach.title}</h3>
                <p className="mt-3 text-muted leading-relaxed">
                  {approach.description}
                </p>
                <ul className="mt-6 space-y-3 flex-1">
                  {approach.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to build the future of work?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Explore the platform, try the live guidance demo, or browse the
              skills library.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/skills"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-base font-semibold transition-colors hover:bg-surface"
              >
                Browse Skills
              </Link>
            </div>
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
            AI Guidance for Physical Work — See, Reason, Guide.
          </p>
        </div>
      </footer>
    </div>
  );
}
