"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  name: string
  email: string
  token?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; firstLogin?: boolean; message?: string }>
  register: (name: string, email: string) => Promise<{ success: boolean; message?: string }>
  changePassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3090"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("taskflow_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const register = async (name: string, email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      })

      if (response.ok) {
        return { 
          success: true, 
          message: "Cadastro realizado! Verifique seu email para obter a senha provisória." 
        }
      }

      const error = await response.json()
      return { success: false, message: error.message || "Erro ao criar conta" }
    } catch {
      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.firstLogin) {
          return { success: true, firstLogin: true }
        }

        const userData: User = {
          name: data.name || email.split("@")[0],
          email: email,
          token: data.token
        }
        
        setUser(userData)
        localStorage.setItem("taskflow_user", JSON.stringify(userData))
        
        return { success: true, firstLogin: false }
      }

      const error = await response.json()
      return { success: false, message: error.message || "Email ou senha inválidos" }
    } catch {
      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const changePassword = async (email: string, newPassword: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      })

      if (response.ok) {
        return { success: true, message: "Senha alterada com sucesso!" }
      }

      const error = await response.json()
      return { success: false, message: error.message || "Erro ao alterar senha" }
    } catch {
      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("taskflow_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
