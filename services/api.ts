const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const storedUser = localStorage.getItem("advanced_user")

  let token: string | undefined

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      token = user.token
    } catch {
      localStorage.removeItem("advanced_user")
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // 🔥 ESSENCIAL
      ...options.headers,
    },
  })

  if (response.status === 401) {
      localStorage.removeItem("advanced_user")
      window.location.href = "/login"
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro na requisição")
  }

  return response.json()
}