"use client"

import { Check, Folder, TriangleAlert, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useLocale } from "@/lib/i18n"

import AttentionCenter from "@/components/dashboard/AttentionCenter"
import CreateProjectModal from "@/components/dashboard/CreateProjectModal"
import PageHeader from "@/components/dashboard/PageHeader"
import ProjectCard from "@/components/dashboard/ProjectCard"
import StatCard from "@/components/dashboard/StatCard"
import { getDashboard, type DashboardSummary } from "@/lib/api/dashboard"
import { getTasks } from "@/lib/api/tasks"
import { toProjectCard } from "@/lib/api/projects"

export default function ProjectsPage() {
  const { t } = useLocale()
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null)
  const [totalTasks, setTotalTasks] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isCurrent = true

    getDashboard()
      .then((data) => {
        if (isCurrent) setDashboard(data)
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load dashboard.")
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    getTasks()
      .then((tasks) => {
        if (isCurrent) setTotalTasks(tasks.length)
      })
      .catch(() => {
        if (isCurrent) setTotalTasks(null)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-full animate-pulse px-3 py-6 sm:px-4 sm:py-8 lg:px-10 lg:py-10">
        <div className="flex justify-between gap-4">
          <div className="space-y-3">
            <div className="h-3 w-28 rounded bg-[#E1E5EC]" />
            <div className="h-9 w-56 rounded bg-[#E1E5EC]" />
            <div className="h-4 w-72 max-w-full rounded bg-[#E1E5EC]" />
          </div>
          <div className="h-10 w-36 rounded-lg bg-[#E1E5EC]" />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 rounded-xl bg-white" />)}
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
          <div className="h-72 rounded-xl bg-white" />
          <div className="h-72 rounded-xl bg-white" />
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return <div role="alert" className="p-10 text-center text-red-600">{t(error || "Unable to load dashboard.")}</div>
  }

  const stats = [
    {
      label: "Active projects",
      value: String(dashboard.activeProjects),
      description: t("Current projects in your workspace"),
      icon: Folder,
      iconClassName: "text-[#2563EB]",
      iconBackgroundClassName: "bg-[#EAF2FF]",
    },
    {
      label: "Tasks completed",
      value: String(dashboard.completedTasks),
      description: totalTasks === null ? t("Completed across all projects") : t("{count} total tasks", { count: totalTasks }),
      icon: Check,
      iconClassName: "text-[#159B7B]",
      iconBackgroundClassName: "bg-[#E8F8F3]",
    },
    {
      label: "Overall progress",
      value: `${dashboard.overallProgress}%`,
      description: t("Based on completed tasks"),
      icon: TrendingUp,
      iconClassName: "text-[#5B50D6]",
      iconBackgroundClassName: "bg-[#F0EDFF]",
    },
    {
      label: "Needs attention",
      value: String(dashboard.needsAttention),
      description: t("Projects past their deadline"),
      icon: TriangleAlert,
      iconClassName: "text-[#C66A00]",
      iconBackgroundClassName: "bg-[#FFF4E5]",
    },
  ]
  const projects = dashboard.projects.map(toProjectCard)

  return (
    <div className="min-h-full px-3 py-6 sm:px-4 sm:py-8 lg:px-10 lg:py-10">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#5B50D6]">
            {t("MONDAY, OCTOBER 6")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">
            {t("Good morning, Alex")}
          </h1>
          <p className="mt-3 text-sm text-[#607493] md:text-base">
            {t("Here’s what’s happening across your projects today.")}
          </p>
        </div>

        <CreateProjectModal />
      </header>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div>
          <PageHeader
            title="Recent projects"
            subtitle="Your most active workspaces"
            action={
              <Link
                href="/projects"
                className="hidden items-center gap-2 text-sm font-medium text-[#607493] hover:text-[#10233F] sm:flex"
              >
                {t("View project")}
                <span aria-hidden="true">→</span>
              </Link>
            }
          />
          {projects.length ? (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {projects.slice(0, 3).map((project, index) => (
                <ProjectCard
                  key={project.projectId}
                  compact
                  className={index === 2 ? "md:col-span-2" : ""}
                  {...project}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-[#D5DCE6] bg-white p-8 text-center text-sm text-[#607493]">
              {t("No projects yet.")}
            </div>
          )}
        </div>
        <AttentionCenter />
      </section>
    </div>
  )
}
