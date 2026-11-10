import { request } from "@/lib/api/client"

export type HealthRisk = "at_risk" | "medium_risk" | "on_track"

export type HealthData = {
  score: number
  risk: HealthRisk
  title: string
  message: string
  projectId: string | null
}

export type AiAnalysis = {
  health: HealthData
}

export function getAiAnalysis(): Promise<AiAnalysis> {
  return request<AiAnalysis>("/ai-analysis")
}
