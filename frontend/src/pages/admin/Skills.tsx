import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Tag } from "../../components/ui/Tag"
import { SkillCategoryModal } from "../../components/admin/SkillCategoryModal"
import {
  getSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} from "../../services/admin"
import type { SkillCategory } from "../../types/admin"
import { queryKeys } from "../../lib/queryKeys"
import { useNotification } from "../../context/NotificationContext"

const dotColors = ["bg-red-600", "bg-cyan-500", "bg-green-500", "bg-yellow-500"]

export function Skills() {
  const queryClient = useQueryClient()
  const { notify } = useNotification()
  const { data: skills = [] } = useQuery({
    queryKey: queryKeys.skills,
    queryFn: () => getSkills().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const [editing, setEditing] = useState<SkillCategory | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.skills })
  }

  const createMutation = useMutation({
    mutationFn: ({ name, technologies }: { name: string; technologies: string[] }) =>
      createSkillCategory({ name, technologies }),
    onSuccess: () => {
      notify("Categoría creada", "success")
      setShowCreate(false)
      invalidate()
    },
    onError: () => notify("Error al crear categoría", "error"),
  })

  const editMutation = useMutation({
    mutationFn: ({ id, name, technologies }: { id: string; name: string; technologies: string[] }) =>
      updateSkillCategory(id, { name, technologies }),
    onSuccess: () => {
      notify("Categoría actualizada", "success")
      setEditing(null)
      invalidate()
    },
    onError: () => notify("Error al actualizar categoría", "error"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSkillCategory,
    onSuccess: () => {
      notify("Categoría eliminada", "success")
      invalidate()
    },
    onError: () => notify("Error al eliminar categoría", "error"),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-base text-zinc-400">
          {skills.reduce((a, c) => a + c.technologies.length, 0)} skills organizadas en{" "}
          {skills.length} categorías
        </p>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" /> Nueva skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((cat, i) => (
          <Card key={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${dotColors[i % dotColors.length]}`} />
              <h3 className="font-heading font-semibold text-base text-zinc-100">
                {cat.name}
              </h3>
              <span className="font-mono text-xs ml-auto text-zinc-400">
                {cat.technologies.length} skills
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  className="!p-1.5"
                  onClick={() => setEditing(cat)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="!p-1.5 hover:!bg-red-500/10 hover:!text-red-500"
                  onClick={() => {
                    if (window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) {
                      deleteMutation.mutate(cat.id)
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {showCreate && (
        <SkillCategoryModal
          mode="create"
          onSave={(name, technologies) => createMutation.mutate({ name, technologies })}
          onCancel={() => setShowCreate(false)}
          isPending={createMutation.isPending}
        />
      )}

      {editing && (
        <SkillCategoryModal
          mode="edit"
          initialName={editing.name}
          initialTechnologies={editing.technologies}
          onSave={(name, technologies) =>
            editMutation.mutate({ id: editing.id, name, technologies })
          }
          onCancel={() => setEditing(null)}
          isPending={editMutation.isPending}
        />
      )}
    </div>
  )
}
