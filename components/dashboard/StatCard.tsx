import type { LucideIcon } from "lucide-react"

type StatCardProps = {
  label: string
  value: string
  description: string
  icon: LucideIcon
  iconClassName: string
  iconBackgroundClassName: string
}

export default function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
}: StatCardProps) {
  return (
    <article className="rounded-xl border border-[#E1E5EC] bg-white p-4 shadow-[0_1px_2px_rgba(16,35,63,0.03)]">
      <div className="flex items-start gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${iconBackgroundClassName}`}
        >
          <Icon className={`size-5 ${iconClassName}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-[#607493]">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold leading-none tracking-tight text-[#10233F]">
            {value}
          </p>
          <p className="mt-2 text-xs text-[#8798B3]">{description}</p>
        </div>
      </div>
    </article>
  )
}
