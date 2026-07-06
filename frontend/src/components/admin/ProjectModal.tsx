import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Input"
import { useFocusTrap } from "../../hooks/useFocusTrap"

interface ProjectModalProps {
  mode: "create" | "edit"
  initial?: {
    title: string
    description: string
    category: string
    url: string
    repository: string
    features: string[]
    technologies: string[]
    status: string
    displayOrder: number
  }
  onSave: (data: {
    title: string
    description?: string
    category?: string
    url?: string
    repository?: string
    features?: string[]
    technologies?: string[]
    status?: string
    displayOrder?: number
  }, image?: File) => void
  onCancel: () => void
  isPending?: boolean
}

export function ProjectModal({
  mode,
  initial,
  onSave,
  onCancel,
  isPending,
}: ProjectModalProps) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [url, setUrl] = useState(initial?.url ?? "")
  const [repository, setRepository] = useState(initial?.repository ?? "")
  const [techInput, setTechInput] = useState("")
  const [technologies, setTechnologies] = useState<string[]>(initial?.technologies ?? [])
  const [featureInput, setFeatureInput] = useState("")
  const [features, setFeatures] = useState<string[]>(initial?.features ?? [])
  const [status, setStatus] = useState(initial?.status ?? "draft")
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder ?? 0)
  const [imageFile, setImageFile] = useState<File | undefined>()

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

  const addFeature = () => {
    const trimmed = featureInput.trim()
    if (trimmed && !features.includes(trimmed)) {
      setFeatures([...features, trimmed])
    }
    setFeatureInput("")
  }

  const removeFeature = (f: string) => {
    setFeatures(features.filter((x) => x !== f))
  }

  const isValid = title.trim().length > 0
  const containerRef = useFocusTrap(true, onCancel)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Nuevo proyecto" : "Editar proyecto"}
          className="w-full max-w-lg bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        >
          <h3 className="font-heading font-semibold text-base text-zinc-100 mb-5">
            {mode === "create" ? "Nuevo proyecto" : "Editar proyecto"}
          </h3>

          <div className="space-y-4">
            <Input
              label="Título"
              placeholder="Ej: Mi Proyecto"
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
            <Input
              label="Categoría"
              placeholder="Ej: Web App, Mobile, API"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              label="URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Input
              label="Repositorio"
              placeholder="https://github.com/user/repo"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
            />

            <div>
              <label className="block font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Features
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  placeholder="Ej: Autenticación JWT"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)] placeholder:text-zinc-400"
                />
                <Button onClick={addFeature} disabled={!featureInput.trim()}>
                  +
                </Button>
              </div>
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-200"
                    >
                      {f}
                      <button
                        onClick={() => removeFeature(f)}
                        className="cursor-pointer bg-transparent border-none p-0 leading-none text-zinc-400 hover:text-zinc-100"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
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
                  +
                </Button>
              </div>
              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {technologies.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-200"
                    >
                      {t}
                      <button
                        onClick={() => removeTech(t)}
                        className="cursor-pointer bg-transparent border-none p-0 leading-none text-zinc-400 hover:text-zinc-100"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
              >
                <option value="published">Publicado</option>
                <option value="draft">Borrador</option>
                <option value="hidden">Oculto</option>
              </select>
            </div>

            <Input
              label="Orden"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
            />

            <div>
              <label className="block font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0])}
                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-700 file:text-zinc-200 hover:file:bg-zinc-600 file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-zinc-700">
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={() =>
                onSave(
                  {
                    title: title.trim(),
                    description: description.trim() || undefined,
                    category: category.trim() || undefined,
                    url: url.trim() || undefined,
                    repository: repository.trim() || undefined,
                    features: features.length ? features : undefined,
                    technologies: technologies.length ? technologies : undefined,
                    status,
                    displayOrder,
                  },
                  imageFile
                )
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
