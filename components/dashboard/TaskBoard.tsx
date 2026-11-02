"use client"

import { Plus, Trash2, X } from "lucide-react"
import { useCallback, useEffect, useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/i18n"
import {
  createTask,
  deleteTask,
  getTasksByProject,
  type ApiTask,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/api/tasks"

type Priority = "High" | "Medium" | "Low"
type ColumnId = "todo" | "inProgress" | "done"
type Task = {
  id: string
  title: string
  description: string
  priority: Priority
  status: TaskStatus
}

const columnLabels: Record<ColumnId, string> = {
  todo: "Todo",
  inProgress: "In Progress",
  done: "Done",
}

const columnStatuses: Record<ColumnId, TaskStatus> = {
  todo: "todo",
  inProgress: "in_progress",
  done: "completed",
}

const priorityClasses: Record<Priority, string> = {
  High: "bg-[#FFF4E5] text-[#A65300]",
  Medium: "bg-[#EAF2FF] text-[#2563EB]",
  Low: "bg-[#F1F3F6] text-[#52627A]",
}

function toBoardTask(task: ApiTask): Task {
  const priority: Priority =
    task.priority === "high" ? "High" : task.priority === "low" ? "Low" : "Medium"

  return {
    id: String(task.id ?? task._id ?? task.title),
    title: task.title,
    description: task.description ?? "",
    priority,
    status: task.status,
  }
}

function TaskCard({
  task,
  isDeleting,
  onDelete,
}: {
  task: Task
  isDeleting: boolean
  onDelete: (task: Task) => void
}) {
  const { t } = useLocale()

  return (
    <article className="rounded-lg border border-[#E1E5EC] bg-white p-3 shadow-[0_1px_2px_rgba(16,35,63,0.03)]">
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${priorityClasses[task.priority]}`}>
          {t(task.priority)}
        </span>
        <button
          type="button"
          aria-label={t("Delete {title}", { title: task.title })}
          disabled={isDeleting}
          onClick={() => onDelete(task)}
          className="rounded-md p-1 text-[#8798B3] transition-colors hover:bg-[#FFF0F1] hover:text-[#C92A3D] disabled:cursor-wait disabled:opacity-60"
        >
          <Trash2 aria-hidden="true" className="size-4" />
        </button>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-[#10233F]">{t(task.title)}</h3>
      {task.description && <p className="mt-1 text-xs text-[#607493]">{t(task.description)}</p>}
    </article>
  )
}

function TaskColumn({
  columnId,
  tasks,
  onAddTask,
  onDeleteTask,
  deletingTaskId,
  dotClassName,
}: {
  columnId: ColumnId
  tasks: Task[]
  onAddTask: (columnId: ColumnId) => void
  onDeleteTask: (task: Task) => void
  deletingTaskId: string | null
  dotClassName: string
}) {
  const { t } = useLocale()
  const title = t(columnLabels[columnId])

  return (
    <section className="rounded-xl bg-[#F0F2F5] p-3">
      <div className="flex items-center justify-between px-1 py-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[#10233F]">
          <span className={`size-2 rounded-full ${dotClassName}`} />
          {title}
          <span className="rounded bg-[#E1E5EC] px-1.5 py-0.5 text-[10px] text-[#607493]">
            {tasks.length}
          </span>
        </h2>
        <button
          type="button"
          aria-label={t("Add task to {column}", { column: title })}
          onClick={() => onAddTask(columnId)}
          className="text-xl leading-none text-[#607493] hover:text-[#10233F]"
        >
          +
        </button>
      </div>
      <div className="mt-2 space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isDeleting={deletingTaskId === task.id}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAddTask(columnId)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#D5DCE6] py-3 text-xs text-[#607493] hover:border-[#5B50D6] hover:text-[#5B50D6]"
      >
        <span className="text-base leading-none">+</span>
        {t("Add task")}
      </button>
    </section>
  )
}

export default function TaskBoard({
  projectId,
  onTasksChanged,
}: {
  projectId: string
  onTasksChanged?: () => void
}) {
  const { t } = useLocale()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [openColumn, setOpenColumn] = useState<ColumnId | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    getTasksByProject(projectId)
      .then((data) => {
        if (isCurrent) {
          setTasks(data.map(toBoardTask))
          setError("")
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load tasks.")
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [projectId])

  const closeTaskModal = useCallback(() => {
    setOpenColumn(null)
    setTitle("")
    setDescription("")
    setPriority("Medium")
  }, [])

  async function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!openColumn || !title.trim()) return

    setIsSubmitting(true)
    setError("")
    try {
      const created = await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority: priority.toLowerCase() as TaskPriority,
        status: columnStatuses[openColumn],
        projectId,
      })
      setTasks((currentTasks) => [...currentTasks, toBoardTask(created)])
      onTasksChanged?.()
      closeTaskModal()
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create task.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function removeTask(task: Task) {
    if (deletingTaskId) return

    setDeletingTaskId(task.id)
    setError("")
    try {
      await deleteTask(task.id)
      setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== task.id))
      onTasksChanged?.()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete task.")
    } finally {
      setDeletingTaskId(null)
    }
  }

  const columns: { id: ColumnId; dotClassName: string }[] = [
    { id: "todo", dotClassName: "bg-[#98A2B3]" },
    { id: "inProgress", dotClassName: "bg-[#4387E5]" },
    { id: "done", dotClassName: "bg-[#2AA889]" },
  ]

  return (
    <>
      <nav className="mt-7 flex items-center justify-between border-b border-[#DDE2EA]">
        <div className="flex items-center gap-6">
          <span className="border-b-2 border-[#5B50D6] px-1 pb-3 text-sm font-medium text-[#5B50D6]">
            {t("Board")}
          </span>
        </div>
        <Button
          id="add-task"
          type="button"
          variant="outline"
          onClick={() => setOpenColumn("todo")}
          className="mb-2 h-9 rounded-lg px-3 text-sm"
        >
          <Plus className="size-4" />
          {t("Add task")}
        </Button>
      </nav>

      {error && <p role="alert" className="mt-4 rounded-lg bg-[#FFF0F1] px-4 py-3 text-sm text-[#C92A3D]">{t(error)}</p>}

      {isLoading ? (
        <div role="status" aria-label={t("Loading tasks...")} className="mt-6 grid animate-pulse gap-4 xl:grid-cols-3">
          <span className="sr-only">{t("Loading tasks...")}</span>
          {columns.map(({ id }) => (
            <div key={id} className="h-72 rounded-xl bg-[#E8EBF0]" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {columns.map(({ id, dotClassName }) => (
            <TaskColumn
              key={id}
              columnId={id}
              tasks={tasks.filter((task) => task.status === columnStatuses[id])}
              onAddTask={setOpenColumn}
              onDeleteTask={removeTask}
              deletingTaskId={deletingTaskId}
              dotClassName={dotClassName}
            />
          ))}
        </div>
      )}

      {openColumn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/55 p-4"
          onClick={closeTaskModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-task-title"
            className="w-full max-w-md rounded-xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E1E5EC] px-5 py-4">
              <div>
                <h2 id="add-task-title" className="text-lg font-semibold text-[#10233F]">
                  {t("Add task")}
                </h2>
                <p className="mt-1 text-xs text-[#607493]">{t("Add a task to your project board.")}</p>
              </div>
              <button
                type="button"
                aria-label={t("Close add task dialog")}
                onClick={closeTaskModal}
                className="rounded-md p-1 text-[#607493] hover:bg-[#F7F8FA]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={addTask} className="space-y-4 p-5">
              <div>
                <label htmlFor="task-title" className="text-xs font-medium text-[#344054]">{t("Task title")}</label>
                <input
                  id="task-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="mt-1.5 h-10 w-full rounded-lg border border-[#D5DCE6] px-3 text-sm text-[#344054] outline-none focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                />
              </div>

              <div>
                <label htmlFor="task-description" className="text-xs font-medium text-[#344054]">{t("Description")}</label>
                <textarea
                  id="task-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-lg border border-[#D5DCE6] px-3 py-2 text-sm text-[#344054] outline-none focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="task-priority" className="text-xs font-medium text-[#344054]">{t("Priority")}</label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as Priority)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D5DCE6] bg-white px-3 text-sm text-[#344054] outline-none focus:border-[#5B50D6]"
                  >
                    <option value="High">{t("High")}</option>
                    <option value="Medium">{t("Medium")}</option>
                    <option value="Low">{t("Low")}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="task-column" className="text-xs font-medium text-[#344054]">{t("Column")}</label>
                  <select
                    id="task-column"
                    value={openColumn}
                    onChange={(event) => setOpenColumn(event.target.value as ColumnId)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D5DCE6] bg-white px-3 text-sm text-[#344054] outline-none focus:border-[#5B50D6]"
                  >
                    {Object.entries(columnLabels).map(([value, label]) => (
                      <option key={value} value={value}>{t(label)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeTaskModal} disabled={isSubmitting} className="h-9 px-3 text-sm">
                  {t("Cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting} className="h-9 bg-[#5B50D6] px-3 text-sm text-white hover:bg-[#4E44C4]">
                  {isSubmitting ? t("Creating...") : t("Add task")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
