"use client"

import { Check, Folder, Search, SlidersHorizontal, TriangleAlert, TrendingUp } from "lucide-react"
import { useState } from "react"

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

const projects = [
  {
    projectId: "e-commerce-platform",
    initials: "EC",
    title: "E-commerce Platform",
    description: "A modern storefront with payments, inventory and customer accounts.",
    status: "On track",
    statusClassName: "bg-[#E8F8F3] text-[#087F65]",
    initialsClassName: "bg-[#F0EDFF] text-[#5B50D6]",
    progress: 68,
    progressClassName: "bg-[#2AA889]",
    dueDate: "Oct 24, 2025",
    completedTasks: 22,
    totalTasks: 32,
  },
  {
    projectId: "ai-learning-coach",
    initials: "AI",
    title: "AI Learning Coach",
    description: "Personalized AI study plans and adaptive learning recommendations.",
    status: "Medium risk",
    statusClassName: "bg-[#FFF4E5] text-[#A65300]",
    initialsClassName: "bg-[#EAF2FF] text-[#2563EB]",
    progress: 42,
    progressClassName: "bg-[#5B50D6]",
    dueDate: "Nov 18, 2025",
    completedTasks: 12,
    totalTasks: 28,
  },
  {
    projectId: "personal-finance-app",
    initials: "PF",
    title: "Personal Finance App",
    description: "Smart budgeting, spending insights and financial goal tracking.",
    status: "At risk",
    statusClassName: "bg-[#FFF0F1] text-[#C92A3D]",
    initialsClassName: "bg-[#E8F8F3] text-[#087F65]",
    progress: 24,
    progressClassName: "bg-[#E39A3A]",
    dueDate: "Dec 12, 2025",
    completedTasks: 10,
    totalTasks: 41,
  },
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")

  const visibleProjects = projects.filter((project) => {
    const matchesSearch = `${project.title} ${project.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || project.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-full px-3 py-6 sm:px-5 sm:py-8 lg:px-10 lg:py-10">
      <header className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#5B50D6]">WORKSPACE</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">Projects</h1>
          <p className="mt-3 text-sm text-[#607493] md:text-base">
            Plan, prioritize, and ship your best work.
          </p>
        </div>
        <CreateProjectModal />
      </header>

      <section className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-12">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#10233F]">All projects</h2>
            <p className="mt-1.5 text-sm text-[#607493]">{projects.length} active projects</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <label className="relative block min-w-0 flex-1 sm:w-72 lg:flex-none">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8798B3]" />
              <span className="sr-only">Search projects</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search projects..."
                className="h-12 w-full rounded-xl border border-[#E1E5EC] bg-white pl-11 pr-4 text-sm text-[#344054] outline-none transition-colors placeholder:text-[#8798B3] focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
              />
            </label>
            <label className="relative flex h-12 items-center rounded-xl border border-[#E1E5EC] bg-white text-sm text-[#344054] sm:w-32">
              <SlidersHorizontal className="ml-4 size-4 shrink-0 text-[#607493]" />
              <span className="sr-only">Filter projects</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="h-full w-full appearance-none bg-transparent px-3 outline-none"
              >
                <option value="All">Filter</option>
                <option value="On track">On track</option>
                <option value="Medium risk">Medium risk</option>
                <option value="At risk">At risk</option>
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
            No projects match your search.
          </div>
        )}
      </section>
    </div>
  )
}
