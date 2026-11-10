"use client"

import { useCallback, useEffect, useState } from "react"
import {
  CalendarDays,
  Clock3,
  ListTodo,
  RefreshCw,
  Sparkles,
  TriangleAlert,
  TrendingUp,
  Zap,
} from "lucide-react"
import Link from "next/link"

import InsightCard from "@/components/dashboard/InsightCard"
import StatCard from "@/components/dashboard/StatCard"
import { Button } from "@/components/ui/button"
import { getAiAnalysis, type AiAnalysis } from "@/lib/api/ai-analysis"
import { useLocale } from "@/lib/i18n"

function getInsightPresentation(type: string) {
  if (type === "error" || type === "critical") {
    return {
      category: "CRITICAL INSIGHT",
      icon: TriangleAlert,
      iconClassName: "text-[#D92D45]",
      iconBackgroundClassName: "bg-[#FFF0F1]",
    }
  }

  if (type === "warning") {
    return {
      category: "SCHEDULE RISK",
      icon: Clock3,
      iconClassName: "text-[#C66A00]",
      iconBackgroundClassName: "bg-[#FFF4E5]",
    }
  }

  return {
    category: "RECOMMENDED NEXT ACTION",
    icon: Zap,
    iconClassName: "text-[#2563EB]",
    iconBackgroundClassName: "bg-[#EAF2FF]",
  }
}

function AiAnalysisSkeleton({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="min-h-full animate-pulse px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8"
    >
      <span className="sr-only">{label}</span>
      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="w-full max-w-xl">
          <div className="h-3 w-24 rounded bg-[#E1E5EC]" />
          <div className="mt-4 h-10 w-64 rounded bg-[#E1E5EC]" />
          <div className="mt-4 h-4 w-full max-w-md rounded bg-[#E1E5EC]" />
        </div>
        <div className="h-9 w-full rounded-lg bg-[#E1E5EC] md:w-32" />
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-lg border border-[#F0D9AC] bg-[#FFFCF6] p-5 sm:flex-row sm:items-center">
        <div className="size-24 shrink-0 rounded-full bg-[#F2E6D2]" />
        <div className="flex-1">
          <div className="h-5 w-24 rounded bg-[#F2E6D2]" />
          <div className="mt-3 h-6 w-64 max-w-full rounded bg-[#E1E5EC]" />
          <div className="mt-3 h-4 w-full rounded bg-[#E1E5EC]" />
          <div className="mt-4 h-4 w-32 rounded bg-[#E1E5EC]" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="h-28 rounded-lg border border-[#E1E5EC] bg-white" />
        ))}
      </div>

      <div className="mt-6">
        <div className="h-6 w-32 rounded bg-[#E1E5EC]" />
        <div className="mt-2 h-4 w-72 max-w-full rounded bg-[#E1E5EC]" />
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-52 rounded-lg border border-[#E1E5EC] bg-white" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AiAnalysisPage() {
  const { t } = useLocale()
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadAnalysis = useCallback(() => {
    setIsLoading(true)
    setError("")

    getAiAnalysis()
      .then(setAnalysis)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load AI analysis.")
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    let isCurrent = true

    getAiAnalysis()
      .then((data) => {
        if (isCurrent) setAnalysis(data)
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load AI analysis.")
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  if (isLoading && !analysis) {
    return <AiAnalysisSkeleton label={t("Loading AI analysis...")} />
  }

  const metrics = analysis
    ? [
        {
          label: "Projects analyzed",
          value: String(analysis.projectsCount),
          description: "Current workspace",
          icon: TrendingUp,
          iconClassName: "text-[#2563EB]",
          iconBackgroundClassName: "bg-[#EAF2FF]",
        },
        {
          label: "Total tasks",
          value: String(analysis.tasksCount),
          description: "Across all projects",
          icon: ListTodo,
          iconClassName: "text-[#5B50D6]",
          iconBackgroundClassName: "bg-[#F0EDFF]",
        },
        {
          label: "Overdue tasks",
          value: String(analysis.overdueCount),
          description: "Need attention",
          icon: CalendarDays,
          iconClassName: "text-[#C66A00]",
          iconBackgroundClassName: "bg-[#FFF4E5]",
        },
      ]
    : []

  return (
    <div className="min-h-full px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <header className="flex flex-col items-start justify-between gap-3 md:flex-row">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#5B50D6]">
            {t("AI ANALYSIS")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">
            {t("Project health")}
          </h1>
          <p className="mt-3 text-sm text-[#607493] md:text-base">
            {t("AI-powered insights based on your current project activity.")}
          </p>
        </div>

        <Button
          onClick={loadAnalysis}
          disabled={isLoading}
          className="h-9 w-full rounded-lg bg-[#5B50D6] px-3 text-xs text-white hover:bg-[#4E44C4] md:w-auto"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? t("Loading...") : t("Run Analysis")}
        </Button>
      </header>

      <section className="mt-6 rounded-lg border border-[#F0D9AC] bg-[#FFFCF6] p-4 shadow-[0_1px_2px_rgba(16,35,63,0.03)] sm:p-5">
        <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
          <div
            className="relative flex size-24 shrink-0 -rotate-90 items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(#E38B1D 0deg 230deg, #F2E6D2 230deg 360deg)",
            }}
          >
            <div className="flex size-17 rotate-90 flex-col items-center justify-center rounded-full bg-[#FFFCF6]">
              <span className="text-2xl font-semibold leading-none text-[#10233F]">
                64
              </span>
              <span className="mt-0.5 text-[9px] text-[#607493]">{t("Health score")}</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-md bg-[#FFF4E5] px-2 py-1 text-[11px] font-medium text-[#A65300]">
              {t("Medium risk")}
            </span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#10233F]">
              {t("Project Health: Medium Risk")}
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[#607493]">
              {t("Your project is making steady progress, but one critical dependency is putting the delivery timeline at risk.")}
            </p>
            <Link
              href="#"
              className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-[#5B50D6] hover:text-[#4138A8]"
            >
              {t("View project board")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#8798B3] lg:self-start">
            <Clock3 className="size-4" />
            {t("Analyzed 2 min ago")}
          </div>
        </div>
      </section>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-[#FFF0F1] p-3 text-sm text-[#D92D45]">
          {t(error)}
        </p>
      )}

      <section className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#10233F]">
              {t("AI Insights")}
            </h2>
            <p className="mt-1.5 text-sm text-[#607493]">
              {t("Prioritized recommendations to keep your project on track.")}
            </p>
          </div>
          <span className="hidden items-center gap-1 rounded-md bg-[#F0EDFF] px-2 py-1 text-[11px] font-medium text-[#5B50D6] sm:flex">
            <Sparkles className="size-3" />
            {t("{count} insights", { count: analysis?.insights.length ?? 0 })}
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <p className="text-sm text-[#607493]">{t("Loading...")}</p>
          ) : analysis?.insights.length ? (
            analysis.insights.map((insight, index) => {
              const presentation = getInsightPresentation(insight.type)
              return (
                <InsightCard
                  key={`${insight.type}-${index}`}
                  {...presentation}
                  title={insight.message}
                  description={insight.message}
                  recommendation={insight.message}
                />
              )
            })
          ) : (
            <p className="text-sm text-[#607493]">{t("No insights available.")}</p>
          )}
        </div>
      </section>
    </div>
  )
}
