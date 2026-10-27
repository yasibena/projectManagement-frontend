import { CalendarDays, Check, MoreHorizontal } from "lucide-react"
import Link from "next/link"

type ProjectCardProps = {
  projectId: string
  initials: string
  title: string
  description: string
  status: string
  statusClassName: string
  initialsClassName: string
  progress: number
  progressClassName?: string
  dueDate: string
  completedTasks: number
  totalTasks: number
  compact?: boolean
  className?: string
}

export default function ProjectCard({
  projectId,
  initials,
  title,
  description,
  status,
  statusClassName,
  initialsClassName,
  progress,
  progressClassName = "bg-[#2AA889]",
  dueDate,
  completedTasks,
  totalTasks,
  compact = false,
  className = "",
}: ProjectCardProps) {
  return (
    <article
      className={`${compact ? "rounded-lg p-3 shadow-[0_1px_2px_rgba(16,35,63,0.03)]" : "rounded-xl p-6 shadow-[0_4px_14px_rgba(16,35,63,0.05)]"} border border-[#E1E5EC] bg-white ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex size-9 items-center justify-center rounded-lg text-xs font-semibold ${initialsClassName}`}
        >
          {initials}
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${statusClassName}`}>
            <span className="mr-1">●</span>
            {status}
          </span>
          <Link
            href={`/projects/${projectId}`}
            aria-label={`Open ${title}`}
            className="text-[#607493] transition-colors hover:text-[#10233F]"
          >
            <MoreHorizontal className="size-4" />
          </Link>
        </div>
      </div>

      <h3 className={`${compact ? "mt-4 text-base" : "mt-6 text-lg"} font-semibold tracking-tight text-[#10233F]`}>
        <Link href={`/projects/${projectId}`} className="transition-colors hover:text-[#5B50D6]">
          {title}
        </Link>
      </h3>
      <p className="mt-1.5 min-h-10 text-xs leading-5 text-[#607493]">{description}</p>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#607493]">Progress</span>
          <span className="font-semibold text-[#10233F]">{progress}%</span>
        </div>
        <div
          className="mt-2 h-1.5 rounded-full bg-[#EEF0F3]"
          role="progressbar"
          aria-label={`${title} progress`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full ${progressClassName}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#EEF0F3] pt-3 text-[11px] text-[#607493]">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-4" />
          {dueDate}
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="size-4" />
          {completedTasks}/{totalTasks} tasks
        </span>
      </div>
    </article>
  )
}
