"use client";

import Link from "next/link";
import {
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  MapPin,
  BookOpen,
} from "lucide-react";
import { sampleTasks, skills } from "@/lib/data";

const stats = [
  {
    label: "Tasks Today",
    value: "3",
    change: "+1 from yesterday",
    icon: Clock,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Completed",
    value: "12",
    change: "This week",
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "AI Assists",
    value: "47",
    change: "+12% efficiency",
    icon: Eye,
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    label: "Skills Learned",
    value: "3",
    change: "2 in progress",
    icon: TrendingUp,
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

const priorityStyles = {
  urgent: "bg-danger/10 text-danger border-danger/20",
  high: "bg-accent/10 text-accent border-accent/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-muted/10 text-muted border-muted/20",
};

const statusStyles = {
  in_progress: "bg-primary/10 text-primary",
  pending: "bg-muted/10 text-muted",
  completed: "bg-success/10 text-success",
};

export default function DashboardPage() {
  const activeSkills = skills.filter(
    (s) => s.completedModules && s.completedModules > 0 && s.completedModules < s.modules
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted">
          Your daily overview — tasks, guidance sessions, and skill progress.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-background p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted">
                {stat.label}
              </span>
              <div
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold">{stat.value}</div>
            <div className="mt-1 text-xs text-muted">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Active tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Today&apos;s Tasks</h2>
            <Link
              href="/tasks"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {sampleTasks.map((task) => {
              const completedSteps = task.steps.filter((s) => s.completed).length;
              const progress = Math.round(
                (completedSteps / task.steps.length) * 100
              );
              return (
                <Link
                  key={task.id}
                  href={`/tasks#${task.id}`}
                  className="block rounded-xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                            priorityStyles[task.priority]
                          }`}
                        >
                          {task.priority === "urgent" && (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {task.priority}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                            statusStyles[task.status]
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="font-semibold truncate">{task.title}</h3>
                      <p className="mt-1 text-sm text-muted line-clamp-1">
                        {task.description}
                      </p>
                      {task.location && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted">
                          <MapPin className="h-3 w-3" />
                          {task.location}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium">
                        {completedSteps}/{task.steps.length}
                      </div>
                      <div className="text-xs text-muted">steps</div>
                      <div className="mt-2 h-1.5 w-20 rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick action */}
          <Link
            href="/guidance"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
          >
            <Eye className="h-4 w-4" />
            Start Live AI Guidance Session
          </Link>
        </div>

        {/* Skill progress sidebar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Skill Progress</h2>
            <Link
              href="/skills"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              All skills <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activeSkills.map((skill) => {
              const progress = Math.round(
                ((skill.completedModules || 0) / skill.modules) * 100
              );
              return (
                <div
                  key={skill.id}
                  className="rounded-xl border border-border bg-background p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-muted">{skill.category}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted">
                        {skill.completedModules}/{skill.modules} modules
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
                </div>
              );
            })}
          </div>

          {/* Completed skills */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-muted mb-3">
              Completed Skills
            </h3>
            {skills
              .filter((s) => s.completedModules === s.modules)
              .map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 rounded-lg p-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>{skill.name}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
