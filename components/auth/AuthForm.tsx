"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuth } from "@/components/auth/AuthProvider"
import { register } from "@/lib/api/auth"

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter()
  const { user, isLoading, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    if (!isLoading && user) router.replace("/")
  }, [isLoading, router, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setRegistered(false)
    setIsSubmitting(true)

    try {
      if (mode === "login") {
        await login({ email, password })
        router.replace("/")
      } else {
        await register({ email, password })
        setRegistered(true)
        setPassword("")
      }
    } catch (submitError: unknown) {
      setError(submitError instanceof Error ? submitError.message : "Unable to complete the request.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLogin = mode === "login"

  return (
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
            <input
              id="password"
              type="password"
              required
              minLength={isLogin ? 1 : 12}
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-[#D5DCE6] px-4 text-sm text-[#10233F] outline-none focus:border-[#5B50D6] focus:ring-2 focus:ring-[#5B50D6]/15"
            />
            {!isLogin && <p className="mt-2 text-xs text-[#607493]">Use at least 12 characters.</p>}
          </div>

          {registered && <p className="text-sm text-[#159B7B]" role="status">Account created. You can now sign in.</p>}
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

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
  )
}
