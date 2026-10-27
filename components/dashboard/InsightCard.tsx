import type { LucideIcon } from "lucide-react"

type InsightCardProps = {
  category: string
  title: string
  description: string
  recommendation: string
  icon: LucideIcon
  iconClassName: string
  iconBackgroundClassName: string
}

export default function InsightCard({
  category,
  title,
  description,
  recommendation,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
}: InsightCardProps) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-[#E1E5EC] bg-white p-3 shadow-[0_1px_2px_rgba(16,35,63,0.03)] sm:p-4">
      <div className="flex gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconBackgroundClassName}`}
        >
          <Icon className={`size-5 ${iconClassName}`} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-[#607493]">
            {category}
          </p>
          <h3 className="mt-1 text-base font-semibold leading-5 text-[#10233F]">
            {title}
          </h3>
          <p className="mt-2 text-xs leading-5 text-[#607493]">{description}</p>
        </div>
      </div>

      <div className="mt-auto rounded-lg bg-[#F7F8FA] p-3">
        <p className="text-[10px] font-semibold tracking-[0.12em] text-[#5B50D6]">
          RECOMMENDATION
        </p>
        <p className="mt-1 text-xs leading-5 text-[#344054]">{recommendation}</p>
      </div>
    </article>
  )
}
