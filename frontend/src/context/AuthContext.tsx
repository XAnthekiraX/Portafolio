import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { http } from "../lib/http"
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

interface LoginResponse {
  user: { id: string; email: string }
  session?: { access_token: string }
}

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
    http.get<{ id: string; email: string }>("/api/admin/auth/me")
      .then((data) => {
        setState({
          user: { id: data.id, firstName: "", lastName: "", email: data.email },
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

  const login = useCallback(async (email: string, password: string) => {
    const data = await http.post<LoginResponse>("/api/admin/auth/login", { email, password })
    const accessToken = data.session?.access_token ?? data.user?.id ?? ""
    const admin: Admin = {
      id: data.user.id,
      firstName: "",
      lastName: "",
      email: data.user.email,
    }
    localStorage.setItem(TOKEN_KEY, accessToken)
    setState({ user: admin, token: accessToken, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    const token = state.token
    if (token) {
      http.post("/api/admin/auth/logout").catch(() => {})
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
