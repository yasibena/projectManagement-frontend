export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured")
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `API request failed: ${response.status} ${response.statusText}`

    try {
      const body = (await response.json()) as { message?: string | string[] }
      if (body.message) {
        message = Array.isArray(body.message) ? body.message.join(", ") : body.message
      }
    } catch {
      // Keep the status-based message when the response has no JSON body.
    }

    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json() as Promise<T>
}
