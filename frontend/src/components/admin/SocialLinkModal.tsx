import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useFocusTrap } from "../../hooks/useFocusTrap"

const ALLOWED_PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "website",
  "dribbble",
  "youtube",
  "instagram",
]

interface SocialLinkModalProps {
  mode: "create" | "edit"
  initialPlatform?: string
  initialUrl?: string
  onSave: (platform: string, url: string) => void
  onCancel: () => void
  isPending?: boolean
}

export function SocialLinkModal({
  mode,
  initialPlatform = "",
  initialUrl = "",
  onSave,
  onCancel,
  isPending,
}: SocialLinkModalProps) {
  const [platform, setPlatform] = useState(initialPlatform)
  const [url, setUrl] = useState(initialUrl)

  const isValid = platform && url.startsWith("http")
  const containerRef = useFocusTrap(true, onCancel)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Agregar red social" : "Editar red social"}
          className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-6"
        >
          <h3 className="font-heading font-semibold text-base text-zinc-100 mb-5">
            {mode === "create" ? "Agregar red social" : "Editar red social"}
          </h3>

          <div className="mb-4">
            <label className="block font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 mb-2">
              Plataforma
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-600 rounded-lg text-zinc-100 text-sm outline-none transition-all duration-150 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.15)]"
            >
              <option value="">Seleccionar plataforma</option>
              {ALLOWED_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <Input
              label="URL"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              onClick={() => onSave(platform, url)}
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
