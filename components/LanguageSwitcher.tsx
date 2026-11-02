"use client"

import { Select } from "@base-ui/react/select"
import { Check, ChevronDown, Languages, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"

import { useLocale } from "@/lib/i18n"

const languages = [
  { label: "English", value: "en" },
  { label: "فارسی", value: "fa" },
]

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    if (!isChanging) return

    const timeoutId = window.setTimeout(() => setIsChanging(false), 350)
    return () => window.clearTimeout(timeoutId)
  }, [isChanging])

  return (
    <Select.Root
      items={languages}
      value={locale}
      onValueChange={(value) => {
        if (value === "en" || value === "fa") {
          setIsChanging(true)
          setLocale(value)
        }
      }}
    >
      <Select.Trigger
        aria-label={t("Language")}
        aria-busy={isChanging}
        disabled={isChanging}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#D5DCE6] bg-white px-3 text-sm font-medium text-[#344054] transition-colors hover:bg-[#F7F8FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B50D6]/20 disabled:cursor-wait disabled:opacity-75"
      >
        {isChanging ? (
          <LoaderCircle aria-hidden="true" className="size-4 shrink-0 animate-spin text-[#5B50D6]" />
        ) : (
          <Languages aria-hidden="true" className="size-4 shrink-0 text-[#607493]" />
        )}
        <Select.Value />
        <span className="sr-only" aria-live="polite">
          {isChanging ? t("Changing language...") : ""}
        </span>
        <Select.Icon>
          <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-[#607493]" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner sideOffset={6} className="z-50 outline-none">
          <Select.Popup className="min-w-[var(--anchor-width)] overflow-hidden rounded-lg border border-[#E1E5EC] bg-white p-1 shadow-lg outline-none">
            <Select.List>
              {languages.map((language) => (
                <Select.Item
                  key={language.value}
                  value={language.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-[#344054] outline-none data-[highlighted]:bg-[#F0EDFF] data-[selected]:font-semibold"
                >
                  <Select.ItemIndicator className="flex size-4 items-center justify-center text-[#5B50D6]">
                    <Check aria-hidden="true" className="size-4" />
                  </Select.ItemIndicator>
                  <Select.ItemText>{language.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
