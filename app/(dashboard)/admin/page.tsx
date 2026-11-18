"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"
import {
  getAdminUsers,
  isUserRole,
  updateUserRole,
  type AdminUser,
  type UserRole,
} from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"

export default function AdminPage() {
  const router = useRouter()
  const { isLoading: isAuthLoading, user } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthLoading || !user || user.role !== "admin") return

    let isCurrent = true

    getAdminUsers()
      .then((nextUsers) => {
        if (isCurrent) setUsers(nextUsers)
      })
      .catch((reason: unknown) => {
        if (!isCurrent) return
        if (reason instanceof ApiError && reason.status === 401) {
          router.replace("/login")
          return
        }
        setError(
          reason instanceof ApiError && reason.status === 403
            ? "You do not have permission to manage users."
            : reason instanceof ApiError && reason.status === 404
              ? "Admin users endpoint not found. Restart or rebuild the backend so the latest admin routes are loaded."
              : reason instanceof Error
                ? reason.message
                : "Unable to load users.",
        )
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [isAuthLoading, router, user])

  async function changeRole(target: AdminUser, role: string) {
    if (target.id === user?.id || !isUserRole(role)) {
      setError("Select a valid role.")
      return
    }

    setError(null)
    setUpdatingUserId(target.id)
    try {
      const updated = await updateUserRole(target.id, role as UserRole)
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (reason: unknown) {
      if (reason instanceof ApiError && reason.status === 401) {
        router.replace("/login")
        return
      }
      setError(
        reason instanceof ApiError && reason.status === 403
          ? "You do not have permission to change user roles."
          : reason instanceof ApiError && reason.status === 404
            ? "Admin users endpoint not found. Restart or rebuild the backend so the latest admin routes are loaded."
            : reason instanceof Error
              ? reason.message
              : "Unable to update role.",
      )
    } finally {
      setUpdatingUserId(null)
    }
  }

  if (user?.role !== "admin") {
    return <div className="p-8 text-sm text-[#607493]">You do not have permission to view this page.</div>
  }

  return (
    <div className="min-h-full px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-[#5B50D6]">ADMINISTRATION</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#10233F]">User management</h1>
        <p className="mt-3 text-sm text-[#607493]">Manage access roles for everyone in the workspace.</p>

        {error && <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <section className="mt-8 overflow-hidden rounded-xl border border-[#E1E5EC] bg-white shadow-[0_1px_2px_rgba(16,35,63,0.03)]">
          {isLoading ? (
            <p className="p-6 text-sm text-[#607493]">Loading users...</p>
          ) : (
            <div className="divide-y divide-[#E8EBF0]">
              {users.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-[#10233F]">{item.email}</p>
                    <p className="mt-1 text-xs text-[#607493]">Joined {new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <select
                    aria-label={`Role for ${item.email}`}
                    value={item.role}
                    disabled={item.id === user.id || updatingUserId === item.id}
                    onChange={(event) => void changeRole(item, event.target.value)}
                    className="h-10 rounded-lg border border-[#D5DCE6] bg-white px-3 text-sm text-[#10233F] disabled:cursor-not-allowed disabled:bg-[#F7F8FA]"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
