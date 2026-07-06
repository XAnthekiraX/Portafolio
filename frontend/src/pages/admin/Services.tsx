import { useState } from "react"
import { Plus, Pencil, Trash2, Code2, Smartphone, Server, Palette, Cloud } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Tag } from "../../components/ui/Tag"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { ServiceModal } from "../../components/admin/ServiceModal"
import type { AdminService } from "../../types/admin"
import { getServices, createService, updateService, deleteService } from "../../services/admin"
import { queryKeys } from "../../lib/queryKeys"
import { useNotification } from "../../context/NotificationContext"

const serviceIcons: Record<string, typeof Code2> = {
  "Desarrollo Web": Code2,
  "Aplicaciones Móviles": Smartphone,
  "Backend & APIs": Server,
  "UI/UX Design": Palette,
  "DevOps & Cloud": Cloud,
}

const iconBgColors: Record<string, string> = {
  "Desarrollo Web": "bg-red-500/15",
  "Aplicaciones Móviles": "bg-cyan-500/10",
  "Backend & APIs": "bg-red-500/15",
  "UI/UX Design": "bg-cyan-500/10",
  "DevOps & Cloud": "bg-red-500/15",
}

const iconTextColors: Record<string, string> = {
  "Desarrollo Web": "text-red-500",
  "Aplicaciones Móviles": "text-cyan-500",
  "Backend & APIs": "text-red-500",
  "UI/UX Design": "text-cyan-500",
  "DevOps & Cloud": "text-red-500",
}

function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: AdminService
  onEdit: () => void
  onDelete: () => void
}) {
  const IconComponent = serviceIcons[service.title] || Code2
  const bg = iconBgColors[service.title] || "bg-red-500/15"
  const color = iconTextColors[service.title] || "text-red-500"

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-700 rounded-xl transition-all duration-250 hover:border-zinc-400 hover:-translate-y-0.5 relative overflow-hidden group before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-red-600 before:to-cyan-500 before:opacity-0 before:transition-opacity before:duration-250 hover:before:opacity-100">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bg}`}>
        <IconComponent className={`w-6 h-6 ${color}`} />
      </div>
      <h4 className="font-heading font-semibold text-base mb-2 text-zinc-100">
        {service.title}
      </h4>
      <p className="text-sm leading-relaxed text-zinc-400">
        {service.description}
      </p>
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-zinc-700">
        {service.status === "popular" ? (
          <Tag variant="red" onClick={() => {}}>Popular</Tag>
        ) : service.status === "ondemand" ? (
          <Badge variant="yellow">Bajo demanda</Badge>
        ) : (
          <Badge variant="green">Disponible</Badge>
        )}
        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" className="!p-1.5" onClick={onEdit}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            className="!p-1.5 hover:!bg-red-500/10 hover:!text-red-500"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Services() {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const { data: services = [] } = useQuery({
    queryKey: queryKeys.services,
    queryFn: ({ signal }) => getServices(signal).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const [editing, setEditing] = useState<AdminService | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.services })
  }

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      notify("Servicio creado", "success")
      setShowCreate(false)
      invalidate()
    },
    onError: () => notify("Error al crear servicio", "error"),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Parameters<typeof updateService>[1]) =>
      updateService(id, data),
    onSuccess: () => {
      notify("Servicio actualizado", "success")
      setEditing(null)
      invalidate()
    },
    onError: () => notify("Error al actualizar servicio", "error"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      notify("Servicio eliminado", "success")
      invalidate()
    },
    onError: () => notify("Error al eliminar servicio", "error"),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-base text-zinc-400">
          Servicios que ofreces como profesional
        </p>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Nuevo servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            onEdit={() => setEditing(s)}
            onDelete={() => {
              if (window.confirm(`¿Eliminar el servicio "${s.title}"?`)) {
                deleteMutation.mutate(s.id)
              }
            }}
          />
        ))}

        <div
          className="border-2 border-dashed border-zinc-700 hover:border-red-500 hover:bg-red-500/10 rounded-xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center min-h-[240px]"
          onClick={() => setShowCreate(true)}
        >
          <div className="w-16 h-16 rounded-2xl bg-zinc-700/50 border border-zinc-600 flex items-center justify-center mb-4 text-zinc-400">
            <Plus className="w-7 h-7" />
          </div>
          <p className="text-base font-medium text-zinc-400">
            Agregar servicio
          </p>
          <p className="text-sm mt-1 max-w-[200px] text-zinc-500">
            Ofrece un nuevo servicio en tu portafolio
          </p>
        </div>
      </div>

      {showCreate && (
        <ServiceModal
          mode="create"
          onSave={(data) => createMutation.mutate(data)}
          onCancel={() => setShowCreate(false)}
          isPending={createMutation.isPending}
        />
      )}

      {editing && (
        <ServiceModal
          mode="edit"
          initial={{
            title: editing.title,
            description: editing.description,
            status: editing.status,
            displayOrder: editing.displayOrder,
          }}
          onSave={(data) => editMutation.mutate({ id: editing.id, ...data })}
          onCancel={() => setEditing(null)}
          isPending={editMutation.isPending}
        />
      )}
    </div>
  )
}
