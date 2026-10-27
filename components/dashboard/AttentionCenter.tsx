import { ArrowRight, TriangleAlert } from "lucide-react"
import Link from "next/link"

const dueTasks = [
  {
    title: "Implement authentication",
    project: "E-commerce Platform",
    dueDate: "Today",
    priority: "Urgent",
    priorityClassName: "bg-[#FFF0F1] text-[#C92A3D]",
  },
  {
    title: "Design product catalog",
    project: "E-commerce Platform",
    dueDate: "Oct 16",
    priority: "Medium",
    priorityClassName: "bg-[#EAF2FF] text-[#2563EB]",
  },
  {
    title: "Review learning model",
    project: "AI Learning Coach",
    dueDate: "Oct 17",
    priority: "Low",
    priorityClassName: "bg-[#F1F3F6] text-[#52627A]",
  },
]

export default function AttentionCenter() {
  return (
    <aside>
      <header>
        <h2 className="text-lg font-semibold tracking-tight text-[#10233F]">
          AI attention center
        </h2>
        <p className="mt-1 text-sm text-[#607493]">
          Priorities detected across your work
        </p>
      </header>

      <article className="mt-5 rounded-xl border border-[#E1E5EC] bg-white p-4 shadow-[0_1px_2px_rgba(16,35,63,0.03)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#FFF0F1]">
            <TriangleAlert className="size-5 text-[#D92D45]" />
          </div>
          <span className="rounded-md bg-[#FFF0F1] px-2 py-1 text-[11px] font-medium text-[#C92A3D]">
            Critical
          </span>
        </div>
        <h3 className="mt-5 text-base font-semibold text-[#10233F]">
          Authentication is blocking 4 tasks
        </h3>
        <p className="mt-2 text-sm leading-5 text-[#607493]">
          Resolve the authentication flow in E-commerce Platform to unblock
          checkout and account work.
        </p>
        <Link
          href="/ai-analysis"
          className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#DDE2EA] text-sm font-medium text-[#10233F] transition-colors hover:bg-[#F7F8FA]"
        >
          Review AI insight
          <ArrowRight className="size-4" />
        </Link>
      </article>

      <section className="mt-3 rounded-lg border border-[#E1E5EC] bg-white p-3 shadow-[0_1px_2px_rgba(16,35,63,0.03)]">
        <h3 className="text-lg font-semibold tracking-tight text-[#10233F]">
          Due this week
        </h3>
        <div className="mt-4 divide-y divide-[#EEF0F3] border-t border-[#EEF0F3]">
          {dueTasks.map((task) => (
            <label
              key={task.title}
              className="flex cursor-pointer items-center gap-3 py-4"
            >
              <input
                type="checkbox"
                aria-label={task.title}
                className="size-4 shrink-0 accent-[#5B50D6]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-[#10233F]">
                  {task.title}
                </span>
                <span className="mt-1 block text-sm text-[#607493]">
                  {task.project} · {task.dueDate}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-medium ${task.priorityClassName}`}
              >
                {task.priority}
              </span>
            </label>
          ))}
        </div>
      </section>
    </aside>
  )
}
