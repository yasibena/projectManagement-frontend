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

const insights = [
  {
    category: "CRITICAL BOTTLENECK",
    title: "Authentication is blocking 4 other tasks",
    description:
      "Checkout, user profiles, order history, and saved payments cannot begin until authentication is complete.",
    recommendation: "Complete authentication before starting checkout integration.",
    icon: TriangleAlert,
    iconClassName: "text-[#D92D45]",
    iconBackgroundClassName: "bg-[#FFF0F1]",
  },
  {
    category: "SCHEDULE RISK",
    title: "Payments milestone may slip by 6 days",
    description:
      "The current task velocity suggests the payments milestone will miss its planned completion date.",
    recommendation: "Move one developer to the checkout flow this week.",
    icon: Clock3,
    iconClassName: "text-[#C66A00]",
    iconBackgroundClassName: "bg-[#FFF4E5]",
  },
  {
    category: "RECOMMENDED NEXT ACTION",
    title: "Prioritize database integration",
    description:
      "Completing the database connection now unlocks the highest number of downstream tasks.",
    recommendation: "Schedule a focused 2-hour integration session.",
    icon: Zap,
    iconClassName: "text-[#2563EB]",
    iconBackgroundClassName: "bg-[#EAF2FF]",
  },
]

const metrics = [
  {
    label: "Overall progress",
    value: "68%",
    description: "22 of 32 tasks",
    icon: TrendingUp,
    iconClassName: "text-[#2563EB]",
    iconBackgroundClassName: "bg-[#EAF2FF]",
  },
  {
    label: "Remaining work",
    value: "10 tasks",
    description: "Est. 46 hours",
    icon: ListTodo,
    iconClassName: "text-[#5B50D6]",
    iconBackgroundClassName: "bg-[#F0EDFF]",
  },
  {
    label: "Deadline risk",
    value: "6 days",
    description: "Potential delay",
    icon: CalendarDays,
    iconClassName: "text-[#C66A00]",
    iconBackgroundClassName: "bg-[#FFF4E5]",
  },
  {
    label: "Blocked tasks",
    value: "4",
    description: "1 critical blocker",
    icon: TriangleAlert,
    iconClassName: "text-[#D92D45]",
    iconBackgroundClassName: "bg-[#FFF0F1]",
  },
  {
    label: "Critical tasks",
    value: "3",
    description: "Need attention",
    icon: Zap,
    iconClassName: "text-[#C66A00]",
    iconBackgroundClassName: "bg-[#FFF4E5]",
  },
]

export default function AiAnalysisPage() {
  return (
    <div className="min-h-full px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
      <header className="flex flex-col items-start justify-between gap-3 md:flex-row">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#5B50D6]">
            AI ANALYSIS
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">
            Project health
          </h1>
          <p className="mt-3 text-sm text-[#607493] md:text-base">
            AI-powered insights based on your current project activity.
          </p>
        </div>

        <Button className="h-9 w-full rounded-lg bg-[#5B50D6] px-3 text-xs text-white hover:bg-[#4E44C4] md:w-auto">
          <RefreshCw className="size-3.5" />
          Run Analysis
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
              <span className="mt-0.5 text-[9px] text-[#607493]">Health score</span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-flex rounded-md bg-[#FFF4E5] px-2 py-1 text-[11px] font-medium text-[#A65300]">
              Medium risk
            </span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-[#10233F]">
              Project Health: Medium Risk
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[#607493]">
              Your project is making steady progress, but one critical dependency
              is putting the delivery timeline at risk.
            </p>
            <Link
              href="#"
              className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-[#5B50D6] hover:text-[#4138A8]"
            >
              View project board
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#8798B3] lg:self-start">
            <Clock3 className="size-4" />
            Analyzed 2 min ago
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#10233F]">
              AI Insights
            </h2>
            <p className="mt-1.5 text-sm text-[#607493]">
              Prioritized recommendations to keep your project on track.
            </p>
          </div>
          <span className="hidden items-center gap-1 rounded-md bg-[#F0EDFF] px-2 py-1 text-[11px] font-medium text-[#5B50D6] sm:flex">
            <Sparkles className="size-3" />
            3 insights
          </span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {insights.map((insight) => (
            <InsightCard key={insight.title} {...insight} />
          ))}
        </div>
      </section>
    </div>
  )
}
