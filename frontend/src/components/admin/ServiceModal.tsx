import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Input"
import { useFocusTrap } from "../../hooks/useFocusTrap"

interface ServiceModalProps {
  mode: "create" | "edit"
  initial?: {
    title: string
    description: string
    status: string
    displayOrder: number
  }
  onSave: (data: {
    title: string
    description?: string
    status?: string
    displayOrder?: number
  }) => void
  onCancel: () => void
  isPending?: boolean
}

export function ServiceModal({
  mode,
  initial,
  onSave,
  onCancel,
  isPending,
}: ServiceModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [status, setStatus] = useState(initial?.status ?? "available")
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder ?? 0)

  const isValid = title.trim().length > 0
  const containerRef = useFocusTrap(true, onCancel)

  return (
    <>
      <button type="button" aria-label="Cerrar" className="fixed inset-0 z-40 bg-black/50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Nuevo servicio" : "Editar servicio"}
          className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-6"
        >
          <h3 className="font-heading font-semibold text-base text-zinc-100 mb-5">
            {mode === "create" ? "Nuevo servicio" : "Editar servicio"}
          </h3>

          <div className="space-y-4">
            <Input
              label="Título"
              placeholder="Ej: Desarrollo Web"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              label="Descripción"
              placeholder="Descripción opcional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <div>
              <label htmlFor="svc-status" className="block font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Estado
              </label>
              <select
                id="svc-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
              >
                <option value="available">Disponible</option>
                <option value="popular">Popular</option>
                <option value="ondemand">Bajo demanda</option>
              </select>
            </div>
            <Input
              label="Orden"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-zinc-700">
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={() =>
                onSave({
                  title: title.trim(),
                  description: description.trim() || undefined,
                  status,
                  displayOrder,
                })
              }
              disabled={!isValid || isPending}
            >
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
