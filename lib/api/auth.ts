import { request } from "@/lib/api/client"

export type AuthUser = {
  id: string
  email: string
  role: "user" | "admin"
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
