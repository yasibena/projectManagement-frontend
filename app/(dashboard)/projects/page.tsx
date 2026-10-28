"use client"

import {
  Check,
  Folder,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  TrendingUp,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { getProjects, type ProjectCardData } from "@/lib/api/projects"
import { useLocale } from "@/lib/i18n"

import CreateProjectModal from "@/components/dashboard/CreateProjectModal"
import ProjectCard from "@/components/dashboard/ProjectCard"
import StatCard from "@/components/dashboard/StatCard"

type StatusFilter = "All" | "On track" | "Medium risk" | "At risk"

const stats = [
  {
    label: "Active projects",
    value: "3",
    description: "+1 this month",
    icon: Folder,
    iconClassName: "text-[#2563EB]",
    iconBackgroundClassName: "bg-[#EAF2FF]",
  },
  {
    label: "Tasks completed",
    value: "44",
    description: "72% completion rate",
    icon: Check,
    iconClassName: "text-[#159B7B]",
    iconBackgroundClassName: "bg-[#E8F8F3]",
  },
  {
    label: "Overall progress",
    value: "48%",
    description: "+8% this week",
    icon: TrendingUp,
    iconClassName: "text-[#5B50D6]",
    iconBackgroundClassName: "bg-[#F0EDFF]",
  },
  {
    label: "Projects at risk",
    value: "1",
    description: "Needs your attention",
    icon: TriangleAlert,
    iconClassName: "text-[#C66A00]",
    iconBackgroundClassName: "bg-[#FFF4E5]",
  },
]

export default function ProjectsPage() {
  const { t } = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")

  const [projects, setProjects] = useState<ProjectCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadProjects = useCallback(async () => {
    try {
      const data = await getProjects()
      setProjects(data)
      setError("")
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load projects.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isCurrent = true

    getProjects()
      .then((data) => {
        if (!isCurrent) return
        setProjects(data)
        setError("")
      })
      .catch((loadError: unknown) => {
        if (!isCurrent) return
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load projects.",
        )
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#F8FAFC] px-3 py-6 sm:px-5 sm:py-8 lg:px-10 lg:py-10">
        <div role="status" aria-label={t("Loading projects...")} className="animate-pulse">
          <span className="sr-only">{t("Loading projects...")}</span>

          <header className="flex flex-col justify-between gap-5 md:flex-row">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded bg-[#E1E5EC]" />
              <div className="h-9 w-48 rounded bg-[#E1E5EC]" />
              <div className="h-4 w-72 max-w-full rounded bg-[#E1E5EC]" />
            </div>
            <div className="h-10 w-full rounded-lg bg-[#E1E5EC] md:w-36" />
          </header>

          <section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-28 rounded-xl border border-[#E1E5EC] bg-white p-5"
              >
                <div className="h-3 w-28 rounded bg-[#E1E5EC]" />
                <div className="mt-4 h-6 w-16 rounded bg-[#E1E5EC]" />
                <div className="mt-3 h-3 w-32 rounded bg-[#E1E5EC]" />
              </div>
            ))}
          </section>

          <section className="mt-12">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div className="space-y-2">
                <div className="h-6 w-36 rounded bg-[#E1E5EC]" />
                <div className="h-4 w-24 rounded bg-[#E1E5EC]" />
              </div>
              <div className="flex w-full gap-2 lg:w-auto">
                <div className="h-12 flex-1 rounded-xl bg-[#E1E5EC] sm:w-72" />
                <div className="h-12 w-32 rounded-xl bg-[#E1E5EC]" />
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="h-64 rounded-xl border border-[#E1E5EC] bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="size-9 rounded-lg bg-[#E1E5EC]" />
                    <div className="h-6 w-20 rounded-md bg-[#E1E5EC]" />
                  </div>
                  <div className="mt-6 h-5 w-2/3 rounded bg-[#E1E5EC]" />
                  <div className="mt-3 h-3 w-full rounded bg-[#E1E5EC]" />
                  <div className="mt-2 h-3 w-4/5 rounded bg-[#E1E5EC]" />
                  <div className="mt-8 h-3 w-full rounded bg-[#E1E5EC]" />
                  <div className="mt-3 h-1.5 w-full rounded bg-[#E1E5EC]" />
                  <div className="mt-7 border-t border-[#EEF0F3] pt-3">
                    <div className="h-3 w-3/4 rounded bg-[#E1E5EC]" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{t(error)}</div>
  }

  const visibleProjects = projects.filter((project) => {
    const matchesSearch = `${project.title} ${project.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-full px-3 py-6 sm:px-5 sm:py-8 lg:px-10 lg:py-10">
      <header className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#5B50D6]">
            {t("WORKSPACE")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">
            {t("Projects")}
          </h1>
          <p className="mt-3 text-sm text-[#607493] md:text-base">
            {t("Plan, prioritize, and ship your best work.")}
          </p>
        </div>
        <CreateProjectModal onProjectCreated={loadProjects} />
      </header>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-12">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#10233F]">
              {t("All projects")}
            </h2>
            <p className="mt-1.5 text-sm text-[#607493]">
              {t("{count} active projects", { count: projects.length })}
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <label className="relative block min-w-0 flex-1 sm:w-72 lg:flex-none">
              <Search className="pointer-events-none absolute top-1/2 start-4 size-4 -translate-y-1/2 text-[#8798B3]" />
              <span className="sr-only">{t("Search projects")}</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("Search projects...")}
                className="h-12 w-full rounded-xl border border-[#E1E5EC] bg-white pe-4 ps-11 text-sm text-[#344054] transition-colors outline-none placeholder:text-[#8798B3] focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
              />
            </label>
            <label className="relative flex h-12 items-center rounded-xl border border-[#E1E5EC] bg-white text-sm text-[#344054] sm:w-32">
              <SlidersHorizontal className="ms-4 size-4 shrink-0 text-[#607493]" />
              <span className="sr-only">{t("Filter projects")}</span>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                className="h-full w-full appearance-none bg-transparent px-3 outline-none"
              >
                <option value="All">{t("Filter")}</option>
                <option value="On track">{t("On track")}</option>
                <option value="Medium risk">{t("Medium risk")}</option>
                <option value="At risk">{t("At risk")}</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.projectId} {...project} />
          ))}
        </div>

        {visibleProjects.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-[#D5DCE6] bg-white p-10 text-center text-sm text-[#607493]">
            {t("No projects match your search.")}
          </div>
        )}
      </section>
    </div>
  )
}
