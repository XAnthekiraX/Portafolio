import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { http } from "../lib/http"
import type { Admin } from "../types/admin"
import type { AuthResponse } from "../types/admin"

interface AuthState {
  user: Admin | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    http.get<{ id: string; email: string }>("/api/admin/auth/me")
      .then((data) => {
        const displayName = data.email.split("@")[0] ?? "";
        setState({
          user: { id: data.id, firstName: displayName, lastName: "", email: data.email },
          isAuthenticated: true,
          isLoading: false,
        })
      })
      .catch(() => {
        setState({ user: null, isAuthenticated: false, isLoading: false })
      })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await http.post<AuthResponse>("/api/admin/auth/login", { email, password })
    const { admin } = data
    setState({ user: admin, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(async () => {
    await http.post("/api/admin/auth/logout").catch(() => {})
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
