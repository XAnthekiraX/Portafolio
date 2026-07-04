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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <Card key={m.label}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {m.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  m.color === "red" ? "bg-red-500/15" : "bg-cyan-500/10"
                }`}
              >
                <m.icon
                  className={`w-4 h-4 ${
                    m.color === "red" ? "text-red-500" : "text-cyan-500"
                  }`}
                />
              </div>
            </div>
            <p className="font-heading text-2xl font-bold text-zinc-100">
              {m.value}
            </p>

            {"change" in m && m.change && (
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="green">
                  <TrendingUp className="w-3 h-3" /> {m.change}
                </Badge>
                <span className="text-[11px] text-zinc-400">
                  {"trend" in m && m.trend === "up" ? "este mes" : "vs mes anterior"}
                </span>
              </div>
            )}

            {"sparkline" in m && m.sparkline && (
              <div className="mt-2">
                <Sparkline values={m.sparkline} />
              </div>
            )}

            {"tags" in m && m.tags && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {m.tags.map((t: string) => (
                  <Tag key={t} variant={t === "Frontend" ? "red" : t === "Backend" ? "cyan" : "default"}>
                    {t}
                  </Tag>
                ))}
              </div>
            )}

            <div
              className={`h-0.5 rounded mt-3 ${
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
            <h2 className="font-heading font-semibold text-sm text-zinc-100">
              Proyectos recientes
            </h2>
            <button className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-100 transition-colors bg-transparent border-none cursor-pointer">
              Ver todos <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-20 h-14 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
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
                      className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-zinc-100">
                        {p.title}
                      </p>
                      <p className="text-xs mt-0.5 truncate text-zinc-400">
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
            <h3 className="font-heading font-semibold text-sm mb-4 text-zinc-100">
              Estado del perfil
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://picsum.photos/seed/dev-avatar-cms/80/80.jpg"
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Carlos Mendez
                </p>
                <p className="text-[11px] text-zinc-400">75% completo</p>
              </div>
            </div>
            <ProgressBar value={75} />
            <div className="mt-3 space-y-1.5">
              {[
                { label: "Foto de perfil", done: true },
                { label: "Descripción", done: true },
                { label: "CV adjunto", done: true },
                { label: "Redes sociales", done: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="text-zinc-400">{item.label}</span>
                  {item.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-zinc-500" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-heading font-semibold text-sm mb-4 text-zinc-100">
              Actividad reciente
            </h3>
            <div className="space-y-3">
              {activities.map((a) => (
                <div key={a.text} className="flex items-start gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColors[a.dot]}`}
                  />
                  <div>
                    <p className="text-xs text-zinc-100">{a.text}</p>
                    <p className="text-[11px] mt-0.5 text-zinc-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-heading font-semibold text-sm mb-4 text-zinc-100">
              Loading preview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-3/4 rounded" />
                  <Skeleton className="h-2.5 w-1/2 rounded" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-lg" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
