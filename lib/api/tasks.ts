import { request } from "@/lib/api/client"

export type TaskStatus = "todo" | "in_progress" | "completed"
export type TaskPriority = "low" | "medium" | "high"

export type ApiTask = {
  _id?: string
  id?: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  projectId: string
}

export type CreateTaskInput = {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string
}

export type TaskStats = {
  total: number
  completed: number
  remaining: number
  progress: number
}

export function getTasks(): Promise<ApiTask[]> {
  return request<ApiTask[]>("/tasks")
}

export function getTasksByProject(projectId: string): Promise<ApiTask[]> {
  return request<ApiTask[]>(`/tasks/project/${encodeURIComponent(projectId)}`)
}

export function getTaskStatsByProject(projectId: string): Promise<TaskStats> {
  return request<TaskStats>(`/tasks/project/${encodeURIComponent(projectId)}/stats`)
}

export function createTask(data: CreateTaskInput): Promise<ApiTask> {
  return request<ApiTask>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function deleteTask(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/tasks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}
