"use client"

import type { ReactNode } from "react"

import { useLocale } from "@/lib/i18n"

type PageHeaderProps = {
  title: string
  subtitle: string
  action?: ReactNode
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { t } = useLocale()

  return (
    <header className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-[#10233F]">
          {t(title)}
        </h2>
        <p className="mt-1.5 text-sm text-[#607493]">{t(subtitle)}</p>
      </div>
      {action}
    </header>
  )
}
