"use client";

import { useState } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Thermometer,
  Wrench,
  Zap,
  Droplets,
  Sun,
  Flame,
  HeartPulse,
  Cog,
} from "lucide-react";
import { skills } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  thermometer: Thermometer,
  wrench: Wrench,
  zap: Zap,
  droplets: Droplets,
  sun: Sun,
  flame: Flame,
  "heart-pulse": HeartPulse,
  cog: Cog,
};

const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];

const levelColors = {
  beginner: "bg-success/10 text-success border-success/20",
  intermediate: "bg-accent/10 text-accent border-accent/20",
  advanced: "bg-danger/10 text-danger border-danger/20",
};

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = skills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Skills Library</h1>
        <p className="mt-1 text-muted">
          Browse and learn trade skills with AI-guided modules. Each skill
          unlocks new capabilities for field work.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="h-4 w-4 text-muted shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((skill) => {
          const Icon = iconMap[skill.icon] || BookOpen;
          const progress = skill.completedModules
            ? Math.round((skill.completedModules / skill.modules) * 100)
            : 0;
          const isCompleted = skill.completedModules === skill.modules;
          const isStarted = (skill.completedModules || 0) > 0;

          return (
            <div
              key={skill.id}
              className="flex flex-col rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
                    levelColors[skill.level]
                  }`}
                >
                  {skill.level}
                </span>
              </div>

              <h3 className="font-semibold">{skill.name}</h3>
              <p className="mt-1 text-xs text-muted">{skill.category}</p>
              <p className="mt-2 flex-1 text-sm text-muted leading-relaxed line-clamp-3">
                {skill.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {skill.modules} modules
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {skill.estimatedHours}h
                </span>
              </div>

              {/* Progress */}
              <div className="mt-3">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </div>
                ) : isStarted ? (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted">
                        {skill.completedModules}/{skill.modules}
                      </span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button className="w-full rounded-lg bg-primary/10 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                    Start Learning
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted/40" />
          <p className="mt-4 text-lg font-medium text-muted">
            No skills found
          </p>
          <p className="mt-1 text-sm text-muted">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
