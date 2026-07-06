import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { EducationModal } from "../../components/admin/EducationModal"
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../services/admin"
import type { AdminEducationItem } from "../../types/admin"
import { queryKeys } from "../../lib/queryKeys"
import { useNotification } from "../../context/NotificationContext"

export function Education() {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const { data: items = [] } = useQuery({
    queryKey: queryKeys.education,
    queryFn: () => getEducation().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const [editing, setEditing] = useState<AdminEducationItem | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.education })
  }

  const createMutation = useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      notify("Formación creada", "success")
      setShowCreate(false)
      invalidate()
    },
    onError: () => notify("Error al crear formación", "error"),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateEducation>[1]) =>
      updateEducation(id, data),
    onSuccess: () => {
      notify("Formación actualizada", "success")
      setEditing(null)
      invalidate()
    },
    onError: () => notify("Error al actualizar formación", "error"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      notify("Formación eliminada", "success")
      invalidate()
    },
    onError: () => notify("Error al eliminar formación", "error"),
  })

  const academic = items.filter((i) => i.type === "academic")
  const certifications = items.filter((i) => i.type === "certification")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-base text-zinc-400">
          Tu formación académica y certificaciones
        </p>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Agregar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
            Formación académica
          </h3>
          {academic.map((item) => (
            <div key={item.id} className="relative pl-10 pb-8 last:pb-0 before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-px before:bg-zinc-700 last:before:hidden">
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-red-600 bg-zinc-950" />
              <Card padding={false} className="!p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-heading font-semibold text-base text-zinc-100">
                    {item.title}
                  </h4>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      className="!p-1.5"
                      onClick={() => setEditing(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="!p-1.5 hover:!bg-red-500/10 hover:!text-red-500"
                      onClick={() => {
                        if (window.confirm(`¿Eliminar "${item.title}"?`)) {
                          deleteMutation.mutate(item.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm mb-2 text-cyan-500">{item.institution}</p>
                <p className="text-xs text-zinc-400">
                  {item.startDate.slice(0, 4)} — {item.endDate.slice(0, 4)}
                </p>
                {item.description && (
                  <p className="text-sm mt-3 leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                )}
              </Card>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
            Certificaciones
          </h3>
          {certifications.map((item) => (
            <div key={item.id} className="relative pl-10 pb-8 last:pb-0 before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-px before:bg-zinc-700 last:before:hidden">
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-cyan-500 bg-zinc-950" />
              <Card padding={false} className="!p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-heading font-semibold text-base text-zinc-100">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.status === "active"
                          ? "green"
                          : item.status === "expiring"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {item.status === "active"
                        ? "Activo"
                        : item.status === "expiring"
                        ? "Próximo a expirar"
                        : "Expirado"}
                    </Badge>
                    <Button
                      variant="ghost"
                      className="!p-1.5"
                      onClick={() => setEditing(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="!p-1.5 hover:!bg-red-500/10 hover:!text-red-500"
                      onClick={() => {
                        if (window.confirm(`¿Eliminar "${item.title}"?`)) {
                          deleteMutation.mutate(item.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm mb-2 text-cyan-500">{item.institution}</p>
                <p className="text-xs text-zinc-400">
                  Obtenido:{" "}
                  {new Date(item.startDate).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <EducationModal
          mode="create"
          onSave={(data) => createMutation.mutate(data)}
          onCancel={() => setShowCreate(false)}
          isPending={createMutation.isPending}
        />
      )}

      {editing && (
        <EducationModal
          mode="edit"
          initial={{
            title: editing.title,
            institution: editing.institution,
            type: editing.type,
            startDate: editing.startDate,
            endDate: editing.endDate,
            description: editing.description,
            status: editing.status,
            displayOrder: editing.displayOrder,
          }}
          onSave={(data) =>
            editMutation.mutate({ id: editing.id, ...data })
          }
          onCancel={() => setEditing(null)}
          isPending={editMutation.isPending}
        />
      )}
    </div>
  )
}
