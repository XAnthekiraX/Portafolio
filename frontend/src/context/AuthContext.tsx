import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Admin } from "../types/admin"

interface AuthState {
  user: Admin | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = "folio-cms-token"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setState((s) => ({ ...s, isLoading: false }))
      return
    }
    fetch("/api/admin/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token")
        return res.json()
      })
      .then((json) => {
        setState({
          user: json.data,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
      })
  }, [])

  // TODO: Eliminar esta validación falsa cuando las APIs estén habilitadas.
  // Reemplazar con el fetch real a /api/admin/auth/login
  const login = useCallback(async (email: string, password: string) => {
    if (email !== "alexbalverde123@gmail.com" || password !== "12345") {
      throw new Error("Credenciales inválidas")
    }
    const admin: Admin = {
      id: "1",
      firstName: "Alex",
      lastName: "Balverde",
      email: "alexbalverde123@gmail.com",
    }
    const token = "mock-jwt-token-folio-cms"
    localStorage.setItem(TOKEN_KEY, token)
    setState({ user: admin, token, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    const token = state.token
    if (token) {
      fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {})
    }
    localStorage.removeItem(TOKEN_KEY)
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }, [state.token])

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
