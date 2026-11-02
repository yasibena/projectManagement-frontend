"use client"

import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

import {
  getProfile,
  login as loginRequest,
  logout as logoutRequest,
  type AuthUser,
  type Credentials,
} from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (credentials: Credentials) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    getProfile()
      .then((profile) => {
        if (isCurrent) setUser(profile)
      })
      .catch((error: unknown) => {
        if (isCurrent && (!(error instanceof ApiError) || error.status !== 401)) {
          setUser(null)
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (credentials) => {
        const loggedInUser = await loginRequest(credentials)
        setUser(loggedInUser)
        return loggedInUser
      },
      logout: async () => {
        await logoutRequest()
        setUser(null)
      },
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}

export function useRequireAuth() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      router.replace("/login")
    }
  }, [auth.isLoading, auth.user, router])

  return auth
}
