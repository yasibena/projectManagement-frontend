"use client"

import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"
import { register } from "@/lib/api/auth"
import { ApiError } from "@/lib/api/client"

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter()
  const { user, isLoading, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error">("success")

  useEffect(() => {
    if (!isLoading && user) router.replace("/")
  }, [isLoading, router, user])

  useEffect(() => {
    if (!toastMessage) return

    const timeout = window.setTimeout(() => setToastMessage(""), 4000)
    return () => window.clearTimeout(timeout)
  }, [toastMessage])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setToastMessage("")
    setIsSubmitting(true)

    try {
      if (mode === "login") {
        await login({ email, password })
        router.replace("/")
      } else {
        await register({ email, password })
        setToastType("success")
        setToastMessage("Account created. You can now sign in.")
        setPassword("")
      }
    } catch (submitError: unknown) {
      setToastType("error")
      setToastMessage(
        isLogin && submitError instanceof ApiError && submitError.status === 401
          ? "Invalid email or password"
          : submitError instanceof Error
            ? submitError.message
            : "Unable to complete the request.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLogin = mode === "login"

  return (
    <>
      <main className="flex min-h-svh items-center justify-center bg-[#F7F8FA] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#E1E5EC] bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-[#5B50D6] text-white">✦</div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#10233F]">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-[#607493]">
            {isLogin ? "Sign in to continue to Planwise." : "Start planning your work with Planwise."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[#10233F]">Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[#D5DCE6] px-4 text-sm text-[#10233F] outline-none focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[#10233F]">Password</label>
            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={isLogin ? 1 : 12}
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-xl border border-[#D5DCE6] px-4 pr-12 text-sm text-[#10233F] outline-none focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#607493] hover:text-[#10233F]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {!isLogin && <p className="mt-2 text-xs text-[#607493]">Use at least 12 characters.</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-[#5B50D6] text-sm font-semibold text-white transition-colors hover:bg-[#4D43C5] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#607493]">
          {isLogin ? "New to Planwise?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-[#5B50D6] hover:underline">
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </section>
      </main>
      {toastMessage && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-lg ${
            toastType === "error"
              ? "border-red-200 text-red-600"
              : "border-[#B7E8D8] text-[#159B7B]"
          }`}
          role="status"
          aria-live="polite"
        >
          {toastMessage}
        </div>
      )}
    </>
  )
}
