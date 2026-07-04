import { useEffect, useState } from "react"
import {
  FolderKanban,
  Cpu,
  Zap,
  Eye,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Tag } from "../../components/ui/Tag"
import { Sparkline } from "../../components/ui/Sparkline"
import { ProgressBar } from "../../components/ui/ProgressBar"
import { Skeleton } from "../../components/ui/Skeleton"
import type { Project } from "../../types/admin"
import { getProjects } from "../../services/admin"

const metrics = [
  {
    label: "Projects",
    value: "12",
    change: "+3",
    trend: "up",
    color: "red",
    icon: FolderKanban,
  },
  {
    label: "Technologies",
    value: "18",
    sparkline: [40, 65, 45, 80, 55, 90, 70, 100],
    color: "cyan",
    icon: Cpu,
  },
  {
    label: "Skills",
    value: "24",
    tags: ["Frontend", "Backend", "DevOps"],
    color: "red",
    icon: Zap,
  },
  {
    label: "Visits",
    value: "1.2k",
    change: "+18%",
    trend: "up",
    color: "cyan",
    icon: Eye,
  },
]

const activities = [
  { text: 'Proyecto "E-Commerce" publicado', time: "Hace 2 horas", dot: "red" },
  { text: 'Skill "TypeScript" actualizada', time: "Hace 5 horas", dot: "cyan" },
  { text: "CV actualizado", time: "Hace 1 día", dot: "gray" },
  { text: "3 tecnologías añadidas", time: "Hace 2 días", dot: "gray" },
]

const dotColors: Record<string, string> = {
  red: "bg-red-600",
  cyan: "bg-cyan-500",
  gray: "bg-zinc-500",
}

export function Dashboard() {
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects().then((res) => {
      setRecentProjects(res.data.slice(0, 3))
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((m) => (
          <Card key={m.label}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-400">
                {m.label}
              </span>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  m.color === "red" ? "bg-red-500/15" : "bg-cyan-500/10"
                }`}
              >
                <m.icon
                  className={`w-5 h-5 ${
                    m.color === "red" ? "text-red-500" : "text-cyan-500"
                  }`}
                />
              </div>
            </div>
            <p className="font-heading text-3xl font-bold text-zinc-100">
              {m.value}
            </p>

            {"change" in m && m.change && (
              <div className="flex items-center gap-1.5 mt-2">
                <Badge variant="green">
                  <TrendingUp className="w-3.5 h-3.5" /> {m.change}
                </Badge>
                <span className="text-xs text-zinc-400">
                  {"trend" in m && m.trend === "up" ? "este mes" : "vs mes anterior"}
                </span>
              </div>
            )}

            {"sparkline" in m && m.sparkline && (
              <div className="mt-3">
                <Sparkline values={m.sparkline} />
              </div>
            )}

            {"tags" in m && m.tags && (
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {m.tags.map((t: string) => (
                  <Tag key={t} variant={t === "Frontend" ? "red" : t === "Backend" ? "cyan" : "default"}>
                    {t}
                  </Tag>
                ))}
              </div>
            )}

            <div
              className={`h-0.5 rounded mt-4 ${
                m.color === "red"
                  ? "bg-gradient-to-r from-red-600 to-transparent"
                  : "bg-gradient-to-r from-cyan-500 to-transparent"
              }`}
            />
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-base text-zinc-100">
              Proyectos recientes
            </h2>
            <button className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors bg-transparent border-none cursor-pointer">
              Ver todos <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-24 h-16 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <Card key={p.id} hover={false}>
                  <div className="flex items-center gap-4">
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="w-24 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-zinc-100">
                        {p.title}
                      </p>
                      <p className="text-sm mt-0.5 truncate text-zinc-400">
                        {p.description}
                      </p>
                    </div>
                    <Badge
                      variant={
                        p.status === "published"
                          ? "green"
                          : p.status === "draft"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {p.status === "published"
                        ? "Publicado"
                        : p.status === "draft"
                        ? "Borrador"
                        : "Oculto"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-heading font-semibold text-base mb-5 text-zinc-100">
              Estado del perfil
            </h3>
            <div className="flex items-center gap-4 mb-5">
              <img
                src="https://picsum.photos/seed/dev-avatar-cms/80/80.jpg"
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-base font-medium text-zinc-100">
                  Carlos Mendez
                </p>
                <p className="text-xs text-zinc-400">75% completo</p>
              </div>
            </div>
            <ProgressBar value={75} />
            <div className="mt-4 space-y-2">
              {[
                { label: "Foto de perfil", done: true },
                { label: "Descripción", done: true },
                { label: "CV adjunto", done: true },
                { label: "Redes sociales", done: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-400">{item.label}</span>
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-heading font-semibold text-base mb-5 text-zinc-100">
              Actividad reciente
            </h3>
            <div className="space-y-4">
              {activities.map((a) => (
                <div key={a.text} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColors[a.dot]}`}
                  />
                  <div>
                    <p className="text-sm text-zinc-100">{a.text}</p>
                    <p className="text-xs mt-0.5 text-zinc-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
