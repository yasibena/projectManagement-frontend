import { ArrowLeft, CalendarDays, Clock3, List, Sparkles } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import TaskBoard, { type BoardTasks } from "@/components/dashboard/TaskBoard"

type Project = {
  initials: string
  title: string
  status: string
  description: string
  progress: number
  deadline: string
  completedTasks: number
  totalTasks: number
  timeRemaining: string
  tasks: BoardTasks
}

const projectData: Record<string, Project> = {
  "e-commerce-platform": {
    initials: "EC",
    title: "E-commerce Platform",
    status: "On track",
    description: "A modern storefront with payments, inventory and customer accounts.",
    progress: 68,
    deadline: "Oct 24, 2025",
    completedTasks: 22,
    totalTasks: 32,
    timeRemaining: "18 days",
    tasks: {
      todo: [
        {
          title: "Build checkout flow",
          category: "Payments",
          priority: "High",
          dueDate: "Oct 18",
        },
        {
          title: "Add inventory alerts",
          category: "Core platform",
          priority: "Medium",
          dueDate: "Oct 20",
        },
      ],
      inProgress: [
        {
          title: "Implement authentication",
          category: "Foundation",
          priority: "Urgent",
          dueDate: "Oct 14",
        },
        {
          title: "Design product catalog",
          category: "Storefront",
          priority: "Medium",
          dueDate: "Oct 16",
        },
      ],
      done: [
        {
          title: "Set up project repository",
          category: "Foundation",
          priority: "Medium",
          dueDate: "Oct 4",
          completed: true,
        },
        {
          title: "Define database schema",
          category: "Foundation",
          priority: "High",
          dueDate: "Oct 6",
          completed: true,
        },
      ],
    },
  },
  "ai-learning-coach": {
    initials: "AI",
    title: "AI Learning Coach",
    status: "Medium risk",
    description: "Personalized AI study plans and adaptive learning recommendations.",
    progress: 42,
    deadline: "Nov 18, 2025",
    completedTasks: 12,
    totalTasks: 28,
    timeRemaining: "25 days",
    tasks: {
      todo: [
        {
          title: "Design learning path",
          category: "Learning engine",
          priority: "High",
          dueDate: "Oct 22",
        },
        {
          title: "Add progress tracking",
          category: "Product",
          priority: "Medium",
          dueDate: "Oct 28",
        },
      ],
      inProgress: [
        {
          title: "Review learning model",
          category: "AI platform",
          priority: "Urgent",
          dueDate: "Oct 17",
        },
      ],
      done: [
        {
          title: "Set up recommendation service",
          category: "Foundation",
          priority: "Medium",
          dueDate: "Oct 8",
          completed: true,
        },
      ],
    },
  },
  "personal-finance-app": {
    initials: "PF",
    title: "Personal Finance App",
    status: "At risk",
    description: "Smart budgeting, spending insights and financial goal tracking.",
    progress: 24,
    deadline: "Dec 12, 2025",
    completedTasks: 10,
    totalTasks: 41,
    timeRemaining: "49 days",
    tasks: {
      todo: [
        {
          title: "Build budget planner",
          category: "Core platform",
          priority: "High",
          dueDate: "Nov 2",
        },
        {
          title: "Connect bank accounts",
          category: "Integrations",
          priority: "Medium",
          dueDate: "Nov 8",
        },
      ],
      inProgress: [
        {
          title: "Define spending insights",
          category: "Analytics",
          priority: "Urgent",
          dueDate: "Oct 30",
        },
      ],
      done: [
        {
          title: "Create project repository",
          category: "Foundation",
          priority: "Medium",
          dueDate: "Oct 4",
          completed: true,
        },
      ],
    },
  },
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const project = projectData[projectId]

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-full px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-medium text-[#607493] hover:text-[#10233F]"
      >
        <ArrowLeft className="size-4" />
        All projects
      </Link>

      <header className="mt-8 flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#F0EDFF] text-sm font-semibold text-[#5B50D6]">
            {project.initials}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">
                {project.title}
              </h1>
              <span className="rounded-md bg-[#E8F8F3] px-2 py-1 text-[11px] font-medium text-[#087F65]">
                <span className="mr-1">●</span>
                {project.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-[#607493] md:text-base">{project.description}</p>
          </div>
        </div>
        <Button className="h-10 w-full rounded-lg bg-[#5B50D6] px-4 text-sm text-white hover:bg-[#4E44C4] md:w-auto">
          <Sparkles className="size-4" />
          Analyze Project with AI
        </Button>
      </header>

      <section className="mt-6 grid gap-4 rounded-xl border border-[#E1E5EC] bg-white p-4 shadow-[0_1px_2px_rgba(16,35,63,0.03)] md:grid-cols-[1.3fr_1fr_1fr_1fr] md:items-center">
        <div className="border-b border-[#EEF0F3] pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <div className="flex items-center justify-between text-xs text-[#607493]">
            <span>Overall progress</span>
            <span className="text-lg font-semibold text-[#10233F]">{project.progress}%</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-[#EEF0F3]">
            <div className="h-full rounded-full bg-[#2AA889]" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="size-5 text-[#607493]" />
          <div>
            <p className="text-xs text-[#607493]">Deadline</p>
            <p className="mt-1 text-sm font-semibold text-[#10233F]">{project.deadline}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <List className="size-5 text-[#607493]" />
          <div>
            <p className="text-xs text-[#607493]">Tasks</p>
            <p className="mt-1 text-sm font-semibold text-[#10233F]">{project.completedTasks} of {project.totalTasks} done</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock3 className="size-5 text-[#607493]" />
          <div>
            <p className="text-xs text-[#607493]">Time remaining</p>
            <p className="mt-1 text-sm font-semibold text-[#10233F]">{project.timeRemaining}</p>
          </div>
        </div>
      </section>

      <TaskBoard initialTasks={project.tasks} />
    </div>
  )
}
