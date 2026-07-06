import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Input"
import { useFocusTrap } from "../../hooks/useFocusTrap"

interface EducationModalProps {
  mode: "create" | "edit"
  initial?: {
    title: string
    institution: string
    type: "academic" | "certification"
    startDate: string
    endDate: string
    description: string
    status: "active" | "expiring" | "expired"
    displayOrder: number
  }
  onSave: (data: {
    title: string
    institution: string
    type: "academic" | "certification"
    startDate: string
    endDate?: string
    description?: string
    status?: string
    displayOrder?: number
  }) => void
  onCancel: () => void
  isPending?: boolean
}

export function EducationModal({
  mode,
  initial,
  onSave,
  onCancel,
  isPending,
}: EducationModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [institution, setInstitution] = useState(initial?.institution ?? "")
  const [type, setType] = useState(initial?.type ?? "academic")
  const [startDate, setStartDate] = useState(initial?.startDate ?? "")
  const [endDate, setEndDate] = useState(initial?.endDate ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [status, setStatus] = useState<string>(initial?.status ?? "active")
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder ?? 0)

  const isValid = title.trim() && institution.trim() && startDate
  const containerRef = useFocusTrap(true, onCancel)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Nueva formación" : "Editar formación"}
          className="w-full max-w-lg bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        >
          <h3 className="font-heading font-semibold text-base text-zinc-100 mb-5">
            {mode === "create" ? "Nueva formación" : "Editar formación"}
          </h3>

          <div className="space-y-4">
            <Input
              label="Título"
              placeholder="Ej: Licenciatura en Ciencias de la Computación"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Institución"
              placeholder="Ej: Universidad de Buenos Aires"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
            <div>
              <label className="block font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "academic" | "certification")}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
              >
                <option value="academic">Académico</option>
                <option value="certification">Certificación</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fecha de inicio"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="Fecha de fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Textarea
              label="Descripción"
              placeholder="Descripción opcional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <div>
              <label className="block font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
              >
                <option value="active">Activo</option>
                <option value="expiring">Próximo a expirar</option>
                <option value="expired">Expirado</option>
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
                  institution: institution.trim(),
                  type,
                  startDate,
                  endDate: endDate || undefined,
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
