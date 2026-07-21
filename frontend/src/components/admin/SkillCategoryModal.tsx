import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useFocusTrap } from "../../hooks/useFocusTrap"

interface SkillCategoryModalProps {
  mode: "create" | "edit"
  initialName?: string
  initialTechnologies?: string[]
  onSave: (name: string, technologies: string[]) => void
  onCancel: () => void
  isPending?: boolean
}

export function SkillCategoryModal({
  mode,
  initialName = "",
  initialTechnologies = [],
  onSave,
  onCancel,
  isPending,
}: SkillCategoryModalProps) {
  const [name, setName] = useState(initialName)
  const [techInput, setTechInput] = useState("")
  const [technologies, setTechnologies] = useState<string[]>(initialTechnologies)

  const addTech = () => {
    const trimmed = techInput.trim()
    if (trimmed && !technologies.includes(trimmed)) {
      setTechnologies([...technologies, trimmed])
    }
    setTechInput("")
  }

  const removeTech = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const isValid = name.trim().length > 0 && technologies.length > 0
  const containerRef = useFocusTrap(true, onCancel)

  return (
    <>
      <button type="button" aria-label="Cerrar" className="fixed inset-0 z-40 bg-black/50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Nueva categoría" : "Editar categoría"}
          className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-6"
        >
          <h3 className="font-heading font-semibold text-base text-zinc-100 mb-5">
            {mode === "create" ? "Nueva categoría" : "Editar categoría"}
          </h3>

          <div className="mb-4">
            <Input
              label="Nombre de la categoría"
              placeholder="Ej: Frontend"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
              Tecnologías
            </label>
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Ej: React"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTech()
                  }
                }}
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] placeholder:text-zinc-400"
              />
              <Button onClick={addTech} disabled={!techInput.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {technologies.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-200"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTech(t)}
                      aria-label={`Quitar ${t}`}
                      className="cursor-pointer bg-transparent border-none p-0 leading-none text-zinc-400 hover:text-zinc-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500">Agregá al menos una tecnología</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={() => onSave(name.trim(), technologies)}
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
