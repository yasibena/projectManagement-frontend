"use client"

import { CalendarDays, Plus, X } from "lucide-react"
import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"

type Priority = "High" | "Medium" | "Urgent"

type Task = {
  title: string
  category: string
  priority: Priority
  dueDate: string
  completed?: boolean
}

export type BoardTasks = {
  todo: Task[]
  inProgress: Task[]
  done: Task[]
}

type ColumnId = keyof BoardTasks

const columnLabels: Record<ColumnId, string> = {
  todo: "Todo",
  inProgress: "In Progress",
  done: "Done",
}

const priorityClasses: Record<Priority, string> = {
  High: "bg-[#FFF4E5] text-[#A65300]",
  Medium: "bg-[#EAF2FF] text-[#2563EB]",
  Urgent: "bg-[#FFF0F1] text-[#C92A3D]",
}

function TaskCard({ task }: { task: Task }) {
  return (
    <article className="rounded-lg border border-[#E1E5EC] bg-white p-3 shadow-[0_1px_2px_rgba(16,35,63,0.03)]">
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${priorityClasses[task.priority]}`}>
          {task.priority}
        </span>
        <button
          type="button"
          aria-label={`More options for ${task.title}`}
          className="text-[#8798B3]"
        >
          ···
        </button>
      </div>
      <h3
        className={`mt-4 text-sm font-semibold text-[#10233F] ${task.completed ? "line-through opacity-60" : ""}`}
      >
        {task.title}
      </h3>
      <p className="mt-1 text-xs text-[#607493]">{task.category}</p>
      <div className="mt-4 flex items-center justify-between border-t border-[#EEF0F3] pt-3 text-[11px] text-[#607493]">
        <span className="flex -space-x-1">
          <span className="flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#F0EDFF] text-[8px] font-semibold text-[#5B50D6]">
            AM
          </span>
          <span className="flex size-5 items-center justify-center rounded-full border-2 border-white bg-[#E8F8F3] text-[8px] font-semibold text-[#087F65]">
            JK
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          {task.dueDate}
        </span>
      </div>
    </article>
  )
}

function TaskColumn({
  columnId,
  tasks,
  onAddTask,
  dotClassName,
}: {
  columnId: ColumnId
  tasks: Task[]
  onAddTask: (columnId: ColumnId) => void
  dotClassName: string
}) {
  const title = columnLabels[columnId]

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
          aria-label={`Add task to ${title}`}
          onClick={() => onAddTask(columnId)}
          className="text-xl leading-none text-[#607493] hover:text-[#10233F]"
        >
          +
        </button>
      </div>
      <div className="mt-2 space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.title} task={task} />
        ))}
      </div>
      <button
        type="button"
        onClick={() => onAddTask(columnId)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#D5DCE6] py-3 text-xs text-[#607493] hover:border-[#5B50D6] hover:text-[#5B50D6]"
      >
        <span className="text-base leading-none">+</span>
        Add task
      </button>
    </section>
  )
}

export default function TaskBoard({ initialTasks }: { initialTasks: BoardTasks }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [openColumn, setOpenColumn] = useState<ColumnId | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState<Priority>("Medium")
  const [dueDate, setDueDate] = useState("")

  function openTaskModal(columnId?: ColumnId) {
    setOpenColumn(columnId ?? "todo")
  }

  function closeTaskModal() {
    setOpenColumn(null)
    setTitle("")
    setCategory("")
    setPriority("Medium")
    setDueDate("")
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!openColumn) return

    const newTask: Task = {
      title,
      category: category || "General",
      priority,
      dueDate: dueDate || "No due date",
    }

    setTasks((currentTasks) => ({
      ...currentTasks,
      [openColumn]: [...currentTasks[openColumn], newTask],
    }))
    closeTaskModal()
  }

  return (
    <>
      <nav className="mt-7 flex items-center justify-between border-b border-[#DDE2EA]">
        <div className="flex items-center gap-6">
          <a href="#" className="border-b-2 border-[#5B50D6] px-1 pb-3 text-sm font-medium text-[#5B50D6]">
            Board
          </a>
          <a href="#" className="pb-3 text-sm text-[#607493]">
            Milestones <span className="ml-1 text-xs">4</span>
          </a>
          <a href="#" className="pb-3 text-sm text-[#607493]">
            Timeline
          </a>
        </div>
        <Button
          id="add-task"
          type="button"
          variant="outline"
          onClick={() => openTaskModal()}
          className="mb-2 h-9 rounded-lg px-3 text-sm"
        >
          <Plus className="size-4" />
          Add task
        </Button>
      </nav>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <TaskColumn
          columnId="todo"
          tasks={tasks.todo}
          onAddTask={openTaskModal}
          dotClassName="bg-[#98A2B3]"
        />
        <TaskColumn
          columnId="inProgress"
          tasks={tasks.inProgress}
          onAddTask={openTaskModal}
          dotClassName="bg-[#4387E5]"
        />
        <TaskColumn
          columnId="done"
          tasks={tasks.done}
          onAddTask={openTaskModal}
          dotClassName="bg-[#2AA889]"
        />
      </div>

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
                  Add task
                </h2>
                <p className="mt-1 text-xs text-[#607493]">
                  Add a task to your project board.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close add task dialog"
                onClick={closeTaskModal}
                className="rounded-md p-1 text-[#607493] hover:bg-[#F7F8FA]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={addTask} className="space-y-4 p-5">
              <div>
                <label htmlFor="task-title" className="text-xs font-medium text-[#344054]">
                  Task title
                </label>
                <input
                  id="task-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="mt-1.5 h-10 w-full rounded-lg border border-[#D5DCE6] px-3 text-sm text-[#344054] outline-none focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                />
              </div>

              <div>
                <label htmlFor="task-category" className="text-xs font-medium text-[#344054]">
                  Category
                </label>
                <input
                  id="task-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-[#D5DCE6] px-3 text-sm text-[#344054] outline-none focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="task-priority" className="text-xs font-medium text-[#344054]">
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as Priority)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D5DCE6] bg-white px-3 text-sm text-[#344054] outline-none focus:border-[#5B50D6]"
                  >
                    <option>Urgent</option>
                    <option>High</option>
                    <option>Medium</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="task-due-date" className="text-xs font-medium text-[#344054]">
                    Due date
                  </label>
                  <input
                    id="task-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="mt-1.5 h-10 w-full rounded-lg border border-[#D5DCE6] px-3 text-sm text-[#344054] outline-none focus:border-[#5B50D6]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="task-column" className="text-xs font-medium text-[#344054]">
                  Column
                </label>
                <select
                  id="task-column"
                  value={openColumn}
                  onChange={(event) => setOpenColumn(event.target.value as ColumnId)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-[#D5DCE6] bg-white px-3 text-sm text-[#344054] outline-none focus:border-[#5B50D6]"
                >
                  {Object.entries(columnLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={closeTaskModal} className="h-9 px-3 text-sm">
                  Cancel
                </Button>
                <Button type="submit" className="h-9 bg-[#5B50D6] px-3 text-sm text-white hover:bg-[#4E44C4]">
                  Add task
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
