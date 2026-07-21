import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useFocusTrap } from "../../hooks/useFocusTrap"

interface TechnologyModalProps {
  mode: "create" | "edit"
  initialName?: string
  onSave: (name: string) => void
  onCancel: () => void
  isPending?: boolean
}

export function TechnologyModal({
  mode,
  initialName = "",
  onSave,
  onCancel,
  isPending,
}: TechnologyModalProps) {
  const [name, setName] = useState(initialName)
  const isValid = name.trim().length > 0
  const containerRef = useFocusTrap(true, onCancel)

  return (
    <>
      <button type="button" aria-label="Cerrar" className="fixed inset-0 z-40 bg-black/50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Nueva tecnología" : "Editar tecnología"}
          className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-6"
        >
          <h3 className="font-heading font-semibold text-base text-zinc-100 mb-5">
            {mode === "create" ? "Nueva tecnología" : "Editar tecnología"}
          </h3>

          <div className="mb-6">
            <Input
              label="Nombre"
              placeholder="Ej: React"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={() => onSave(name.trim())}
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
