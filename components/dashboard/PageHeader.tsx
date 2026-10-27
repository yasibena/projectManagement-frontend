import type { ReactNode } from "react"

type PageHeaderProps = {
  title: string
  subtitle: string
  action?: ReactNode
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#10233F]">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-[#607493]">{subtitle}</p>
      </div>
      {action}
    </header>
  )
}
