import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "../../components/ui/Button"
import type { Technology } from "../../types/admin"
import { getTechnologies } from "../../services/admin"

const iconColors: Record<string, { bg: string; text: string }> = {
  React: { bg: "rgba(97,218,251,0.15)", text: "#61dafb" },
  "Next.js": { bg: "rgba(255,255,255,0.1)", text: "#fff" },
  TypeScript: { bg: "rgba(49,120,198,0.15)", text: "#3178c6" },
  "Node.js": { bg: "rgba(104,160,99,0.15)", text: "#68a063" },
  PostgreSQL: { bg: "rgba(51,103,145,0.15)", text: "#336791" },
  Tailwind: { bg: "rgba(56,189,248,0.15)", text: "#38bdf8" },
  Python: { bg: "rgba(249,115,22,0.15)", text: "#f97316" },
  Django: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  Docker: { bg: "rgba(13,183,237,0.15)", text: "#0db7ed" },
  AWS: { bg: "rgba(255,153,0,0.15)", text: "#ff9900" },
  Git: { bg: "rgba(240,80,51,0.15)", text: "#f05033" },
  GraphQL: { bg: "rgba(255,107,53,0.15)", text: "#ff6b35" },
  "Vue.js": { bg: "rgba(65,184,131,0.15)", text: "#41b883" },
  Prisma: { bg: "rgba(128,90,213,0.15)", text: "#805ad5" },
  Express: { bg: "rgba(0,0,0,0.1)", text: "var(--text)" },
  Figma: { bg: "rgba(242,204,68,0.15)", text: "#f2cc44" },
  Vercel: { bg: "rgba(255,255,255,0.05)", text: "#a1a1aa" },
  Linux: { bg: "rgba(255,87,34,0.15)", text: "#ff5722" },
}

function getInitials(name: string): string {
  return name
    .split(/[-\s]/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function Technologies() {
  const [techs, setTechs] = useState<Technology[]>([])

  useEffect(() => {
    getTechnologies().then((res) => setTechs(res.data))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-400">
          {techs.length} tecnologías en tu catálogo
        </p>
        <Button>
          <Plus className="w-3.5 h-3.5" /> Agregar
        </Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {techs.map((t) => {
          const colors = iconColors[t.name] || {
            bg: "rgba(255,255,255,0.05)",
            text: "#a1a1aa",
          }
          return (
            <div
              key={t.id}
              className="flex flex-col items-center justify-center gap-2.5 p-5 bg-zinc-900 border border-zinc-700 rounded-xl cursor-pointer transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-500/10 hover:-translate-y-0.5"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base"
                style={{ background: colors.bg, color: colors.text }}
              >
                {getInitials(t.name)}
              </div>
              <span className="text-xs font-medium text-zinc-100">
                {t.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
