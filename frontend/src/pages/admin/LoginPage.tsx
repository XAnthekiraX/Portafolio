import { useState } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Code2 } from "lucide-react"

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/admin", { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center mb-4">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-heading text-xl font-bold text-zinc-100">
            FolioCMS
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-600 rounded-lg text-zinc-100 text-[13px] outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] placeholder:text-zinc-500"
              placeholder="admin@dev.io"
              required
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-600 rounded-lg text-zinc-100 text-[13px] outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] placeholder:text-zinc-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-red-600 text-white rounded-lg text-[13px] font-medium cursor-pointer border-none transition-all duration-150 hover:bg-red-700 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  )
}
