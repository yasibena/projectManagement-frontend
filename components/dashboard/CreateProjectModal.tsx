"use client"

import { useEffect, useState, type FormEvent } from "react"
import { CalendarDays, Plus, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CreateProjectModal() {
  const [isOpen, setIsOpen] = useState(false)

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    closeModal()
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-10 w-full rounded-lg bg-[#5B50D6] px-4 text-sm text-white shadow-sm hover:bg-[#4E44C4] md:w-auto"
      >
        <Plus className="size-4" />
        New Project
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
                  Create a new project
                </h2>
                <p className="mt-1 text-sm text-[#607493]">
                  Tell us what you want to build. AI will handle the planning.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close create project dialog"
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
                    Project name
                  </label>
                  <input
                    id="project-name"
                    name="projectName"
                    defaultValue="Developer Analytics Dashboard"
                    className="mt-2 h-10 w-full rounded-lg border border-[#D5DCE6] px-4 text-sm text-[#344054] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project-goal"
                    className="text-sm font-medium text-[#344054]"
                  >
                    Project goal
                  </label>
                  <textarea
                    id="project-goal"
                    name="projectGoal"
                    rows={3}
                    defaultValue="Build a real-time analytics dashboard that helps engineering teams understand delivery velocity, deployment health, and team workload."
                    className="mt-2 w-full resize-y rounded-lg border border-[#D5DCE6] px-4 py-3 text-sm leading-5 text-[#344054] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="project-deadline"
                      className="text-sm font-medium text-[#344054]"
                    >
                      Deadline
                    </label>
                    <div className="relative mt-2">
                      <CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#607493]" />
                      <input
                        id="project-deadline"
                        name="deadline"
                        type="date"
                        defaultValue="2025-12-18"
                        className="h-12 w-full rounded-lg border border-[#D5DCE6] pl-11 pr-4 text-sm text-[#344054] outline-none transition-colors focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="technology-stack"
                        className="text-sm font-medium text-[#344054]"
                      >
                        Technology stack
                      </label>
                      <span className="text-sm text-[#98A2B3]">Optional</span>
                    </div>
                    <input
                      id="technology-stack"
                      name="technologyStack"
                      defaultValue="Next.js, TypeScript, PostgreSQL"
                      className="mt-2 h-10 w-full rounded-lg border border-[#D5DCE6] px-4 text-sm text-[#344054] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                    />
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border border-[#DED9FF] bg-[#F8F7FF] p-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#5B50D6] shadow-sm">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#4138A8]">
                      Plan smarter with AI
                    </h3>
                    <p className="mt-1 text-sm leading-5 text-[#746FB4]">
                      AI will analyze your goal and create milestones and tasks
                      for your project. You can review and edit everything before
                      saving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-[#E1E5EC] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="h-10 rounded-lg px-5 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-10 rounded-lg bg-[#5B50D6] px-5 text-sm text-white hover:bg-[#4E44C4]"
                >
                  <Sparkles className="size-4" />
                  Generate Plan with AI
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
