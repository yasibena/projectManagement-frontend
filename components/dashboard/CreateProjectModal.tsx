"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { CalendarDays, Plus, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { createProject } from "@/lib/api/projects"
import { useLocale } from "@/lib/i18n"

type CreateProjectModalProps = {
  onProjectCreated?: () => Promise<void>
}

export default function CreateProjectModal({
  onProjectCreated = async () => {},
}: CreateProjectModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { t } = useLocale()
  const deadlineInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  function closeModal() {
    setIsOpen(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get("projectName") ?? "").trim()
    const description = String(formData.get("projectGoal") ?? "").trim()
    const deadline = String(formData.get("deadline") ?? "")

    setError("")
    setIsSubmitting(true)

    try {
      await createProject({
        title,
        ...(description ? { description } : {}),
        ...(deadline ? { deadline } : {}),
      })
      await onProjectCreated()
      closeModal()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create project.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => {
          setError("")
          setIsOpen(true)
        }}
        className="h-10 w-full rounded-lg bg-[#5B50D6] px-4 text-sm text-white shadow-sm hover:bg-[#4E44C4] md:w-auto"
      >
        <Plus className="size-4" />
        {t("New Project")}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#0F172A]/55 p-4"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
            className="w-full max-w-190 rounded-xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#E1E5EC] px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="create-project-title"
                  className="text-xl font-semibold tracking-tight text-[#1F2937]"
                >
                  {t("Create a new project")}
                </h2>
                <p className="mt-1 text-sm text-[#607493]">
                  {t("Add the project details. You can plan tasks after saving.")}
                </p>
              </div>
              <button
                type="button"
                aria-label={t("Close create project dialog")}
                onClick={closeModal}
                className="rounded-md p-1 text-[#607493] transition-colors hover:bg-[#F7F8FA] hover:text-[#1F2937]"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 px-5 py-5 sm:px-6">
                <div>
                  <label
                    htmlFor="project-name"
                    className="text-sm font-medium text-[#344054]"
                  >
                    {t("Project name")}
                  </label>
                  <input
                    id="project-name"
                    name="projectName"
                    required
                    placeholder={t("Enter a project name")}
                    className="mt-2 h-10 w-full rounded-lg border border-[#D5DCE6] px-4 text-sm text-[#344054] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project-goal"
                    className="text-sm font-medium text-[#344054]"
                  >
                    {t("Project goal")}
                  </label>
                  <textarea
                    id="project-goal"
                    name="projectGoal"
                    rows={3}
                    placeholder={t("Describe the project goal (optional)")}
                    className="mt-2 w-full resize-y rounded-lg border border-[#D5DCE6] px-4 py-3 text-sm leading-5 text-[#344054] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="project-deadline"
                      className="text-sm font-medium text-[#344054]"
                    >
                      {t("Deadline")}
                    </label>
                    <div className="relative mt-2">
                      <button
                        type="button"
                        aria-label={t("Open deadline calendar")}
                        onClick={() => deadlineInputRef.current?.showPicker()}
                        className="absolute start-3 top-1/2 z-10 -translate-y-1/2 text-[#607493]"
                      >
                        <CalendarDays aria-hidden="true" className="size-4" />
                      </button>
                      <input
                        ref={deadlineInputRef}
                        id="project-deadline"
                        name="deadline"
                        type="date"
                        className="h-12 w-full rounded-lg border border-[#D5DCE6] ps-11 pe-4 text-sm text-[#344054] outline-none transition-colors focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border border-[#DED9FF] bg-[#F8F7FF] p-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#5B50D6] shadow-sm">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#4138A8]">
                      {t("Project planning")}
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-[#746FB4]">
                      {t("This form saves the project name, goal, and optional deadline. You can add milestones and tasks afterward.")}
                    </p>
                  </div>
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-600">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-[#E1E5EC] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="h-10 rounded-lg px-5 text-sm"
                >
                  {t("Cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 rounded-lg bg-[#5B50D6] px-5 text-sm text-white hover:bg-[#4E44C4] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Sparkles className="size-4" />
                  {isSubmitting ? t("Creating...") : t("Create Project")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
