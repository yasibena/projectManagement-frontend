import { request } from "@/lib/api/client"
import type { ApiProject } from "@/lib/api/projects"

export type DashboardSummary = {
  activeProjects: number
  completedTasks: number
  overallProgress: number
  needsAttention: number
  projects: ApiProject[]
}

export function getDashboard(): Promise<DashboardSummary> {
  return request<DashboardSummary>("/dashboard")
}
