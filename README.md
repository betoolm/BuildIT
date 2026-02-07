# BuildIT — AI Guidance for Physical Work

AI-powered real-time coaching for skilled trades. Workers wear a camera while AI sees what they see and talks them through the job: identifying parts, reading gauges, spotting issues, and providing step-by-step voice guidance.

## The Problem

Much of the AI conversation focuses on desk jobs, but physical work — field services, manufacturing, healthcare — still requires humans to act in the world. AI can't turn a wrench, but it *can* see, reason, and guide the person who does.

Skilled labor shortages mean millions of trade jobs go unfilled. Traditional training takes months or years. BuildIT bridges that gap by making any worker effective immediately with AI coaching.

## How It Works

1. **AI Sees** — Multimodal AI processes your live camera feed, identifying parts, reading labels, and understanding the work environment
2. **AI Reasons** — Cross-references what it sees with technical manuals, safety codes, and best practices
3. **AI Guides** — Real-time voice coaching: "turn off that valve", "use the 3/8 inch wrench", "that part looks worn, replace it"

## Three Paths to Market

- **Enterprise SaaS** — Sell to companies with existing workforces. Reduce onboarding from months to days.
- **Vertical Platform** — Pick a trade (HVAC, nursing, etc.) and build a full-stack AI-superpowered workforce.
- **Open Platform** — Let anyone sign up, learn a trade with AI guidance, and start working immediately.

## Features

- **Landing page** with value proposition, how-it-works, and market approaches
- **Worker Dashboard** with daily stats, active tasks, and skill progress tracking
- **Live AI Guidance** view with camera feed, real-time AI chat, step overlays, and safety warnings
- **Skills Library** with filterable, categorized trade skills across HVAC, electrical, plumbing, healthcare, manufacturing, and more
- **Task Management** with expandable work orders, step-by-step procedures, AI hints, and safety callouts

## Tech Stack

- **Next.js 16** with App Router and TypeScript
- **Tailwind CSS 4** for styling
- **Lucide React** for icons
- Responsive design with dark mode support

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles and theme
│   └── (app)/
│       ├── layout.tsx        # App layout with navbar
│       ├── dashboard/page.tsx # Worker dashboard
│       ├── guidance/page.tsx  # Live AI guidance view
│       ├── skills/page.tsx    # Skills library
│       └── tasks/page.tsx     # Task management
├── components/
│   └── Navbar.tsx            # Navigation bar
└── lib/
    └── data.ts               # Types and sample data
```
