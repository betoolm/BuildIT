"use client";

import { useState } from "react";
import {
  Cable,
  Search,
  Filter,
  AlertTriangle,
  Info,
  Zap,
  ArrowRight,
} from "lucide-react";
import { sampleProject } from "@/lib/data";

const wireColorStyles: Record<string, string> = {
  red: "bg-red-500",
  black: "bg-gray-900 dark:bg-gray-200",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  white: "bg-white border border-gray-300",
  orange: "bg-orange-500",
};

type SignalFilter = "all" | "power" | "i2c" | "analog" | "battery";

export default function SchematicsPage() {
  const { connections, powerRails, notes } = sampleProject.schematic;
  const [search, setSearch] = useState("");
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("all");

  const filtered = connections.filter((c) => {
    const matchSearch =
      c.from.part.toLowerCase().includes(search.toLowerCase()) ||
      c.to.part.toLowerCase().includes(search.toLowerCase()) ||
      c.signal.toLowerCase().includes(search.toLowerCase());

    if (signalFilter === "all") return matchSearch;
    if (signalFilter === "power")
      return matchSearch && (c.signal.includes("Power") || c.signal.includes("Ground"));
    if (signalFilter === "i2c")
      return matchSearch && c.signal.includes("I2C");
    if (signalFilter === "analog")
      return matchSearch && c.signal.includes("Analog");
    if (signalFilter === "battery")
      return matchSearch && c.signal.includes("Battery");
    return matchSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <Cable className="h-4 w-4" />
          Wiring Schematics
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Wiring & Schematics</h1>
        <p className="mt-1 text-muted">
          Pin-to-pin wiring diagram with signal labels, wire colors, and power
          distribution.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Schematic visual */}
        <div className="lg:col-span-2 space-y-4">
          {/* Schematic placeholder */}
          <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-900 to-slate-800">
              {/* Simplified schematic render */}
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* ESP32 block */}
                <rect x="320" y="80" width="160" height="200" rx="8" fill="#1e40af" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="2" />
                <text x="400" y="110" textAnchor="middle" fill="#93c5fd" fontSize="14" fontWeight="bold">ESP32-S3</text>
                <text x="335" y="140" fill="#93c5fd" fontSize="10">3V3</text>
                <text x="335" y="160" fill="#93c5fd" fontSize="10">GND</text>
                <text x="335" y="180" fill="#93c5fd" fontSize="10">GPIO21 (SDA)</text>
                <text x="335" y="200" fill="#93c5fd" fontSize="10">GPIO22 (SCL)</text>
                <text x="335" y="220" fill="#93c5fd" fontSize="10">GPIO34</text>
                <text x="335" y="240" fill="#93c5fd" fontSize="10">GPIO35</text>

                {/* I2C devices */}
                <rect x="580" y="100" width="120" height="40" rx="6" fill="#059669" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
                <text x="640" y="125" textAnchor="middle" fill="#6ee7b7" fontSize="11">BME280</text>

                <rect x="580" y="160" width="120" height="40" rx="6" fill="#059669" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
                <text x="640" y="185" textAnchor="middle" fill="#6ee7b7" fontSize="11">BH1750</text>

                <rect x="580" y="220" width="120" height="40" rx="6" fill="#059669" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
                <text x="640" y="245" textAnchor="middle" fill="#6ee7b7" fontSize="11">SSD1306 OLED</text>

                {/* Soil sensors */}
                <rect x="580" y="300" width="120" height="40" rx="6" fill="#d97706" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="640" y="325" textAnchor="middle" fill="#fbbf24" fontSize="11">Soil Sensor 1</text>

                <rect x="580" y="360" width="120" height="40" rx="6" fill="#d97706" fillOpacity="0.3" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="640" y="385" textAnchor="middle" fill="#fbbf24" fontSize="11">Soil Sensor 2</text>

                {/* Power */}
                <rect x="100" y="150" width="120" height="40" rx="6" fill="#dc2626" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1.5" />
                <text x="160" y="175" textAnchor="middle" fill="#fca5a5" fontSize="11">TP4056</text>

                <rect x="100" y="220" width="120" height="40" rx="6" fill="#dc2626" fillOpacity="0.3" stroke="#ef4444" strokeWidth="1.5" />
                <text x="160" y="245" textAnchor="middle" fill="#fca5a5" fontSize="11">LiPo Battery</text>

                {/* I2C bus lines */}
                <line x1="480" y1="180" x2="580" y2="120" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4" />
                <line x1="480" y1="180" x2="580" y2="180" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4" />
                <line x1="480" y1="180" x2="580" y2="240" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4" />
                <text x="530" y="165" fill="#60a5fa" fontSize="9">I2C Bus</text>

                {/* Analog lines */}
                <line x1="480" y1="220" x2="580" y2="320" stroke="#22c55e" strokeWidth="1.5" />
                <line x1="480" y1="240" x2="580" y2="380" stroke="#22c55e" strokeWidth="1.5" />
                <text x="530" y="300" fill="#86efac" fontSize="9">ADC</text>

                {/* Power lines */}
                <line x1="220" y1="170" x2="320" y2="140" stroke="#ef4444" strokeWidth="2" />
                <line x1="220" y1="170" x2="320" y2="160" stroke="#1f2937" strokeWidth="2" />
                <line x1="160" y1="220" x2="160" y2="190" stroke="#ef4444" strokeWidth="1.5" />

                {/* Pull-up resistors symbol */}
                <rect x="510" y="90" width="30" height="12" rx="2" fill="none" stroke="#a78bfa" strokeWidth="1" />
                <text x="525" y="85" textAnchor="middle" fill="#c4b5fd" fontSize="8">10K</text>
                <rect x="510" y="108" width="30" height="12" rx="2" fill="none" stroke="#a78bfa" strokeWidth="1" />
                <text x="525" y="130" textAnchor="middle" fill="#c4b5fd" fontSize="8">10K</text>

                {/* Labels */}
                <text x="525" y="75" textAnchor="middle" fill="#64748b" fontSize="9">Pull-ups</text>
                <text x="160" y="140" textAnchor="middle" fill="#64748b" fontSize="9">Power Supply</text>
              </svg>
            </div>
          </div>

          {/* Connection table */}
          <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
            <div className="border-b border-border px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold">Connections ({filtered.length})</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-md border border-border bg-surface pl-8 pr-3 py-1.5 text-xs outline-none focus:border-primary w-40"
                  />
                </div>
              </div>
            </div>

            {/* Signal filters */}
            <div className="border-b border-border px-4 py-2 flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted" />
              {(["all", "power", "i2c", "analog", "battery"] as SignalFilter[]).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setSignalFilter(f)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      signalFilter === f
                        ? "bg-primary text-white"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                )
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface text-xs text-muted">
                    <th className="px-4 py-2 text-left font-medium">Wire</th>
                    <th className="px-4 py-2 text-left font-medium">From</th>
                    <th className="px-4 py-2 text-center font-medium"></th>
                    <th className="px-4 py-2 text-left font-medium">To</th>
                    <th className="px-4 py-2 text-left font-medium">Signal</th>
                    <th className="px-4 py-2 text-left font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((conn) => (
                    <tr key={conn.id} className="hover:bg-surface/50">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              conn.wireColor
                                ? wireColorStyles[conn.wireColor] || "bg-gray-400"
                                : "bg-gray-400"
                            }`}
                          />
                          <span className="text-xs text-muted capitalize">
                            {conn.wireColor || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-xs">
                          {conn.from.part}
                        </div>
                        <div className="text-xs text-muted">
                          {conn.from.pin}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <ArrowRight className="h-3.5 w-3.5 text-muted mx-auto" />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-xs">
                          {conn.to.part}
                        </div>
                        <div className="text-xs text-muted">{conn.to.pin}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {conn.signal}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted max-w-[150px] truncate">
                        {conn.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Power rails */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              Power Rails
            </h3>
            <div className="space-y-4">
              {powerRails.map((rail) => (
                <div key={rail.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{rail.voltage}</span>
                    <span className="text-xs text-muted">{rail.source}</span>
                  </div>
                  <div className="space-y-1">
                    {rail.consumers.map((consumer, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-xs text-muted"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-success" />
                        {consumer}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Design notes */}
          <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-secondary" />
              Design Notes
            </h3>
            <div className="space-y-2">
              {notes.map((note, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-muted"
                >
                  <Info className="h-3 w-3 shrink-0 mt-0.5 text-secondary" />
                  {note}
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
              <div>
                <h4 className="text-sm font-semibold text-accent">
                  Before powering on
                </h4>
                <p className="text-xs text-accent/80 mt-1">
                  Double-check all connections against this schematic.
                  Verify power rail polarity and confirm no shorts between
                  3V3 and GND before connecting power.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
