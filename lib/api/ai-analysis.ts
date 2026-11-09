import { request } from "@/lib/api/client"

export type AiInsight = {
  type: string
  message: string
}

export type AiAnalysis = {
  projectsCount: number
  tasksCount: number
  overdueCount: number
  insights: AiInsight[]
}

export function getAiAnalysis(): Promise<AiAnalysis> {
  return request<AiAnalysis>("/ai-analysis")
}
