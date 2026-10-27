import { Check, Folder, TriangleAlert, TrendingUp } from "lucide-react"

import AttentionCenter from "@/components/dashboard/AttentionCenter"
import CreateProjectModal from "@/components/dashboard/CreateProjectModal"
import PageHeader from "@/components/dashboard/PageHeader"
import ProjectCard from "@/components/dashboard/ProjectCard"
import StatCard from "@/components/dashboard/StatCard"

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
    description: "8 completed this week",
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
    label: "Needs attention",
    value: "2",
    description: "1 critical blocker",
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
    dueDate: "Dec 12, 2025",
    completedTasks: 10,
    totalTasks: 41,
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-full px-3 py-6 sm:px-4 sm:py-8 lg:px-10 lg:py-10">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#5B50D6]">
            MONDAY, OCTOBER 6
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">
            Good morning, Alex
          </h1>
          <p className="mt-3 text-sm text-[#607493] md:text-base">
            Here’s what’s happening across your projects today.
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
              <a
                href="#"
                className="hidden items-center gap-2 text-sm font-medium text-[#607493] hover:text-[#10233F] sm:flex"
              >
                View project
                <span aria-hidden="true">→</span>
              </a>
            }
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                compact
                className={index === projects.length - 1 ? "md:col-span-2" : ""}
                {...project}
              />
            ))}
          </div>
        </div>
        <AttentionCenter />
      </section>
    </div>
  )
}
