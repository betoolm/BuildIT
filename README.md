# BuildIT — AI Hardware Building Assistant

Your AI assistant that takes you from idea to working hardware product. It asks the right questions, recognizes your parts via camera, generates 3D assembly instructions, creates wiring schematics, writes firmware, and guides you through testing.

## How It Works

BuildIT walks you through 6 phases of hardware development:

1. **Ideation** — Describe your idea. AI asks targeted questions about scope, power, connectivity, and constraints, then generates a Bill of Materials.
2. **Parts Recognition** — Point your camera at components. AI identifies ICs, sensors, connectors, reads markings, and maps everything to your BOM.
3. **3D Assembly** — Step-by-step assembly instructions with part placement, orientation, safety warnings, and AI tips.
4. **Wiring Schematics** — Pin-to-pin wiring diagrams with wire colors, signal labels, power rail maps, and design notes.
5. **Firmware** — AI generates starter code with correct pin assignments, library initialization, and sensor logic matched to your hardware.
6. **Testing** — Structured test procedures for power, connectivity, sensors, and integration with pass/fail tracking.

## Sample Project

The app ships with a complete sample project: **Smart Plant Monitor** — an IoT device built with ESP32-S3 that monitors soil moisture, light, temperature, and humidity.

- 12 components across 9 categories
- 10 assembly steps with safety warnings
- 26 pin-to-pin wire connections with SVG schematic
- 2 firmware modules (main app + WiFi manager) with real C++ code
- 6 test procedures with 22 validation steps

## Features

- **AI Conversation** — Chat interface that asks the right questions and provides resources, suggestions, and code
- **Camera-based Parts Scanner** — Live camera feed for component identification with scanning tips
- **Interactive BOM** — Filterable Bill of Materials with specs, footprints, and identification hints
- **Assembly Guide** — Step-by-step with 3D view placeholder, parts list per step, warnings, and tips
- **Wiring Schematic** — SVG circuit diagram + filterable connection table with wire colors and signal types
- **Firmware Editor** — Syntax-highlighted code viewer with copy-to-clipboard, dependency list, and flash instructions
- **Test Dashboard** — Stats, progress tracking, and detailed test tables with expected vs actual results

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
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles and theme
│   └── (app)/
│       ├── layout.tsx            # App layout with navbar
│       ├── project/page.tsx      # Project workspace + AI chat
│       ├── parts/page.tsx        # Parts recognition + BOM
│       ├── assembly/page.tsx     # 3D assembly guide
│       ├── schematics/page.tsx   # Wiring schematics
│       ├── firmware/page.tsx     # Firmware editor
│       └── testing/page.tsx      # Test procedures
├── components/
│   └── Navbar.tsx                # Navigation bar
└── lib/
    └── data.ts                   # Types, interfaces, and sample data
```
