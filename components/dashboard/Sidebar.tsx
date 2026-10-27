"use client"

import { usePathname } from "next/navigation"

import {
  Folder,
  LayoutDashboard,
  Settings,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Projects", icon: Folder, href: "/projects" },
  {
    label: "AI Analysis",
    icon: Sparkles,
    href: "/ai-analysis",
    badge: "AI",
  },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-65 shrink-0 flex-col bg-[#0F172A] px-3 py-6 text-white md:flex">
      <div className="flex items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#5B50D6]">
          <Sparkles className="size-5" />
        </div>
        <span className="text-xl font-semibold tracking-tight">Planwise</span>
      </div>

      <nav className="mt-7 space-y-1.5">
        {navigationItems.map(({ label, icon: Icon, href, badge }) => {
          const isActive =
            href !== "#" &&
            (href === "/" ? pathname === "/" : pathname.startsWith(href))

          return (
          <Link
            key={label}
            href={href}
            className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
              isActive
                ? "bg-[#28294F] text-[#BEB9FF]"
                : "text-[#9BA9C2] hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="size-4.5" />
            <span>{label}</span>
            {badge && (
              <span className="ml-auto rounded bg-[#28294F] px-1.5 py-0.5 text-[10px] font-semibold text-[#BEB9FF]">
                {badge}
              </span>
            )}
          </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-[#2B3A50] bg-[#172337] p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#B8C4D8]">AI credits</span>
          <span className="text-xs font-semibold text-white">18 / 25</span>
        </div>
        <div className="mt-3 h-1 rounded-full bg-[#3A4961]">
          <div className="h-full w-[72%] rounded-full bg-[#5B50D6]" />
        </div>
        <p className="mt-2 text-xs text-[#70819D]">Resets in 12 days</p>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-lg border border-[#2B3A50] bg-[#172337] p-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#DCD8FF] text-[10px] font-semibold text-[#BEB9FF]">
          AM
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-white">Alex Morgan</p>
          <p className="truncate text-xs text-[#70819D]">alex@planwise.dev</p>
        </div>
      </div>
    </aside>
  )
}
