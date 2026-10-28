import { request } from "@/lib/api/client"

export type ApiProject = {
  id?: string | number
  _id?: string
  title: string
  description?: string | null
  deadline?: string | null
  lifecycleStatus?: string | null
  risk?: string | null
  status?: string | null
  progress?: number | null
  taskStats?: {
    total?: number | null
    completed?: number | null
    remaining?: number | null
    progress?: number | null
  } | null
}

export type ProjectInput = {
  title: string
  description?: string
  deadline?: string
}

export type ProjectCardData = {
  projectId: string
  initials: string
  title: string
  description: string
  status: "On track" | "Medium risk" | "At risk"
  statusClassName: string
  initialsClassName: string
  progress: number
  dueDate: string
  completedTasks: number
  totalTasks: number
}

function getInitials(title: string) {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("")
}

function getStatus(risk?: string | null): ProjectCardData["status"] {
  if (risk === "at_risk") return "At risk"
  if (risk === "medium_risk") return "Medium risk"
  return "On track"
}

function formatDeadline(deadline?: string | null) {
  if (!deadline) return "No deadline"

  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return "No deadline"

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function toProjectCard(project: ApiProject): ProjectCardData {
  const status = getStatus(project.risk)
  const statusClassName =
    status === "At risk"
      ? "bg-[#FFF0F0] text-[#C93636]"
      : status === "Medium risk"
        ? "bg-[#FFF4E5] text-[#C66A00]"
        : "bg-[#E8F8F3] text-[#159B7B]"

  return {
    projectId: String(project.id ?? project._id ?? ""),
    initials: getInitials(project.title),
    title: project.title,
    description: project.description || "No description yet.",
    status,
    statusClassName,
    initialsClassName: "bg-[#F0EDFF] text-[#5B50D6]",
    progress: project.progress ?? project.taskStats?.progress ?? 0,
    dueDate: formatDeadline(project.deadline),
    completedTasks: project.taskStats?.completed ?? 0,
    totalTasks: project.taskStats?.total ?? 0,
  }
}

export async function getProjects(): Promise<ProjectCardData[]> {
  const projects = await request<ApiProject[]>("/projects")
  return projects.map(toProjectCard)
}

export async function getProject(id: string): Promise<ApiProject> {
  return request<ApiProject>(`/projects/${encodeURIComponent(id)}`)
}

export async function createProject(data: ProjectInput): Promise<ApiProject> {
  return request<ApiProject>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateProject(
  id: string,
  data: Partial<ProjectInput>,
): Promise<ApiProject | null> {
  return request<ApiProject | null>(`/projects/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteProject(id: string): Promise<ApiProject | null> {
  return request<ApiProject | null>(`/projects/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}
