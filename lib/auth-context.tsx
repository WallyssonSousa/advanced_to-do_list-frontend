"use client"

import { registerUser } from "@/services/userService"
import { loginUser, changeUserPassword } from "@/services/authService"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  uuid: string
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
    const storedUser = localStorage.getItem("advanced_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const register = async (name: string, email: string) => {
  try {
    await registerUser({ name, email })

    return { 
      success: true, 
      message: "Cadastro realizado! Verifique seu email para obter a senha provisória." 
    }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message }
      }

      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser({ email, password })

      if (data.firstLogin) {
        return { success: true, firstLogin: true }
      }

      const userData: User = {
        uuid: data.uuid,
        name: data.name || email.split("@")[0],
        email,
        token: data.token,
      }

      setUser(userData)
      localStorage.setItem("advanced_user", JSON.stringify(userData)) 

      return { success: true, firstLogin: false }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message }
      }

      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const changePassword = async (email: string, newPassword: string) => {
    try {
      await changeUserPassword({ email, newPassword })

      return {
        success: true,
        message: "Senha alterada com sucesso!",
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, message: error.message }
      }

      return { success: false, message: "Erro de conexão com o servidor" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("advanced_user")
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
