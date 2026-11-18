import { ApiError, request } from "@/lib/api/client"

export const USER_ROLES = ["user", "admin"] as const
export type UserRole = (typeof USER_ROLES)[number]

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole)
}

export type AuthUser = {
  id: string
  email: string
  role: UserRole
}

export type Credentials = {
  email: string
  password: string
}

export function register(credentials: Credentials): Promise<AuthUser> {
  return request<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export function login(credentials: Credentials): Promise<AuthUser> {
  return request<AuthUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export function logout(): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/logout", {
    method: "POST",
  })
}

export function getProfile(): Promise<AuthUser> {
  return request<AuthUser>("/auth/profile")
}

export type AdminUser = AuthUser & {
  createdAt: string
}

async function requestAdminUsers<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    return await request<T>(`/admin${path}`, options)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return request<T>(`/auth/admin${path}`, options)
    }
    throw error
  }
}

export function getAdminUsers(): Promise<AdminUser[]> {
  return requestAdminUsers<AdminUser[]>("/users")
}

export function updateUserRole(id: string, role: UserRole): Promise<AdminUser> {
  if (!isUserRole(role)) {
    return Promise.reject(new Error("Invalid user role."))
  }

  return requestAdminUsers<AdminUser>(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  })
}
