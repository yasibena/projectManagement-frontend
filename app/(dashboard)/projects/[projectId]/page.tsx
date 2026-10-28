"use client"

import { use, useCallback, useEffect, useState } from "react"
import { ArrowLeft, CalendarDays, Clock3, List, Sparkles } from "lucide-react"
import Link from "next/link"

import { useLocale } from "@/lib/i18n"
import { getProject, type ApiProject } from "@/lib/api/projects"
import { getTaskStatsByProject, type TaskStats } from "@/lib/api/tasks"

import { Button } from "@/components/ui/button"
import TaskBoard from "@/components/dashboard/TaskBoard"

function getInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")
}

function getStatus(risk?: string | null) {
  if (risk === "at_risk") return "At risk"
  if (risk === "medium_risk") return "Medium risk"
  return "On track"
}

function formatDeadline(deadline: string | null | undefined, locale: string) {
  if (!deadline) return "—"

  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function getDaysRemaining(deadline?: string | null) {
  if (!deadline) return null

  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return null

  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86_400_000))
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { t, locale } = useLocale()
  const { projectId } = use(params)
  const [project, setProject] = useState<ApiProject | null>(null)
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let isCurrent = true

    Promise.all([getProject(projectId), getTaskStatsByProject(projectId)])
      .then(([projectData, taskStats]) => {
        if (!isCurrent) return
        setProject(projectData)
        setStats(taskStats)
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load project.")
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [projectId])

  const refreshStats = useCallback(() => {
    getTaskStatsByProject(projectId).then(setStats).catch(() => {})
  }, [projectId])

  if (isLoading) {
    return (
      <div role="status" aria-label={t("Loading project...")} className="min-h-full animate-pulse px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
        <span className="sr-only">{t("Loading project...")}</span>
        <div className="h-4 w-28 rounded bg-[#E1E5EC]" />
        <div className="mt-8 h-12 max-w-xl rounded bg-[#E1E5EC]" />
        <div className="mt-6 h-28 rounded-xl bg-[#E1E5EC]" />
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-72 rounded-xl bg-[#E1E5EC]" />)}
        </div>
      </div>
    )
  }

  if (error || !project) {
    return <div role="alert" className="p-10 text-center text-red-600">{t(error || "Project not found.")}</div>
  }

  const status = getStatus(project.risk)
  const daysRemaining = getDaysRemaining(project.deadline)
  const progress = stats?.progress ?? project.progress ?? 0
  const completedTasks = stats?.completed ?? project.taskStats?.completed ?? 0
  const totalTasks = stats?.total ?? project.taskStats?.total ?? 0

  return (
    <div className="min-h-full px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#607493] hover:text-[#10233F]"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("All projects")}
      </Link>

      <header className="mt-8 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#F0EDFF] text-sm font-semibold text-[#5B50D6]">
            {getInitials(project.title)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">
                {t(project.title)}
              </h1>
              <span className="rounded-md bg-[#E8F8F3] px-2 py-1 text-[11px] font-medium text-[#087F65]">
                <span className="me-1">●</span>
                {t(status)}
              </span>
            </div>
            <p className="mt-3 text-sm text-[#607493] md:text-base">{t(project.description || "No description yet.")}</p>
          </div>
        </div>
        <Button className="h-10 w-full rounded-lg bg-[#5B50D6] px-4 text-sm text-white hover:bg-[#4E44C4] md:w-auto">
          <Sparkles className="size-4" />
          {t("Analyze Project with AI")}
        </Button>
      </header>

      <section className="mt-6 grid gap-4 rounded-xl border border-[#E1E5EC] bg-white p-4 shadow-[0_1px_2px_rgba(16,35,63,0.03)] md:grid-cols-[1.3fr_1fr_1fr_1fr] md:items-center">
        <div className="border-b border-[#EEF0F3] pb-4 md:border-b-0 md:border-e md:pb-0 md:pe-6">
          <div className="flex items-center justify-between text-xs text-[#607493]">
            <span>{t("Overall progress")}</span>
            <span className="text-lg font-semibold text-[#10233F]">{progress}%</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-[#EEF0F3]">
            <div className="h-full rounded-full bg-[#2AA889]" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="size-5 text-[#607493]" />
          <div>
            <p className="text-xs text-[#607493]">{t("Deadline")}</p>
            <p className="mt-1 text-sm font-semibold text-[#10233F]">{formatDeadline(project.deadline, locale)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <List className="size-5 text-[#607493]" />
          <div>
            <p className="text-xs text-[#607493]">{t("Tasks")}</p>
            <p className="mt-1 text-sm font-semibold text-[#10233F]">
              {t("{completed} of {total} done", { completed: completedTasks, total: totalTasks })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock3 className="size-5 text-[#607493]" />
          <div>
            <p className="text-xs text-[#607493]">{t("Time remaining")}</p>
            <p className="mt-1 text-sm font-semibold text-[#10233F]">
              {daysRemaining === null ? "—" : t("{days} days", { days: daysRemaining })}
            </p>
          </div>
        </div>
      </section>

      <TaskBoard projectId={projectId} onTasksChanged={refreshStats} />
    </div>
  )
}
