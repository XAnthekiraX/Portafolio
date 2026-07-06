import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "../../components/ui/Button"
import { TechnologyModal } from "../../components/admin/TechnologyModal"
import {
  getTechnologies,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "../../services/admin"
import type { AdminTechnology } from "../../types/admin"
import { queryKeys } from "../../lib/queryKeys"
import { useNotification } from "../../context/NotificationContext"

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
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const { data: techs = [] } = useQuery({
    queryKey: queryKeys.technologies,
    queryFn: ({ signal }) => getTechnologies(signal).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const [editing, setEditing] = useState<AdminTechnology | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.technologies })
  }

  const createMutation = useMutation({
    mutationFn: (name: string) => createTechnology({ name }),
    onSuccess: () => {
      notify("Tecnología creada", "success")
      setShowCreate(false)
      invalidate()
    },
    onError: () => notify("Error al crear tecnología", "error"),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateTechnology(id, { name }),
    onSuccess: () => {
      notify("Tecnología actualizada", "success")
      setEditing(null)
      invalidate()
    },
    onError: () => notify("Error al actualizar tecnología", "error"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTechnology,
    onSuccess: () => {
      notify("Tecnología eliminada", "success")
      invalidate()
    },
    onError: () => notify("Error al eliminar tecnología", "error"),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-base text-zinc-400">
          {techs.length} tecnologías en tu catálogo
        </p>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Agregar
        </Button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {techs.map((t) => {
          const colors = iconColors[t.name] || {
            bg: "rgba(255,255,255,0.05)",
            text: "#a1a1aa",
          }
          return (
            <div
              key={t.id}
              className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-zinc-900 border border-zinc-700 rounded-xl transition-all duration-200 hover:border-cyan-500 hover:bg-cyan-500/10 hover:-translate-y-0.5"
            >
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  className="!p-1"
                  onClick={(e) => { e.stopPropagation(); setEditing(t) }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  className="!p-1 hover:!bg-red-500/10 hover:!text-red-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm(`¿Eliminar "${t.name}"?`)) {
                      deleteMutation.mutate(t.id)
                    }
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{ background: colors.bg, color: colors.text }}
              >
                {getInitials(t.name)}
              </div>
              <span className="text-sm font-medium text-zinc-100">
                {t.name}
              </span>
            </div>
          )
        })}
      </div>

      {showCreate && (
        <TechnologyModal
          mode="create"
          onSave={(name) => createMutation.mutate(name)}
          onCancel={() => setShowCreate(false)}
          isPending={createMutation.isPending}
        />
      )}

      {editing && (
        <TechnologyModal
          mode="edit"
          initialName={editing.name}
          onSave={(name) => editMutation.mutate({ id: editing.id, name })}
          onCancel={() => setEditing(null)}
          isPending={editMutation.isPending}
        />
      )}
    </div>
  )
}
