"use client"

import { useAuth } from "@/components/auth/AuthProvider"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/i18n"

export default function SettingsPage() {
  const { t } = useLocale()
  const { user } = useAuth()
  const email = user?.email ?? ""
  const initials = email.slice(0, 2).toUpperCase() || "??"

  return (
    <div className="min-h-full px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-xs font-semibold tracking-[0.16em] text-[#5B50D6]">{t("WORKSPACE")}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10233F] md:text-4xl">{t("Settings")}</h1>
          <p className="mt-3 text-sm text-[#607493] md:text-base">
            {t("Manage your workspace and AI planning preferences.")}
          </p>
        </header>

        <section className="mt-10 rounded-xl border border-[#E1E5EC] bg-white p-6 shadow-[0_1px_2px_rgba(16,35,63,0.03)] sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-[#10233F]">{t("Profile")}</h2>
          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-15 items-center justify-center rounded-full bg-[#DCD8FF] text-sm font-semibold text-[#5B50D6]">
                {initials}
              </div>
              <div>
                <p className="text-base font-semibold text-[#10233F]">{email}</p>
                <p className="mt-1 text-sm text-[#607493]">{user?.role ?? "user"}</p>
              </div>
            </div>
            <Button type="button" variant="outline" className="h-12 rounded-xl px-5 text-sm">
              {t("Edit profile")}
            </Button>
          </div>
        </section>

        <section className="mt-5 rounded-xl border border-[#E1E5EC] bg-white p-6 shadow-[0_1px_2px_rgba(16,35,63,0.03)] sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-[#10233F]">{t("AI preferences")}</h2>
          <p className="mt-2 text-sm text-[#607493]">
            {t("Choose how detailed your generated plans should be.")}
          </p>

          <div className="mt-7 max-w-sm">
            <label htmlFor="planning-detail" className="text-sm font-medium text-[#10233F]">
              {t("Planning detail")}
            </label>
            <select
              id="planning-detail"
              defaultValue="balanced"
              className="mt-2 h-13 w-full rounded-xl border border-[#D5DCE6] bg-white px-4 text-sm text-[#10233F] outline-none transition-colors focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
            >
              <option value="concise">{t("Concise")}</option>
              <option value="balanced">{t("Balanced")}</option>
              <option value="detailed">{t("Detailed")}</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  )
}
