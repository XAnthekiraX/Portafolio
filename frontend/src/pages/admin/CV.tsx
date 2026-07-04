import { useEffect, useState } from "react"
import { Upload, Download, CheckCircle2, Info } from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Skeleton } from "../../components/ui/Skeleton"
import type { CV as CVType } from "../../types/admin"
import { getCV } from "../../services/admin"

export function CV() {
  const [cv, setCv] = useState<CVType | null>(null)

  useEffect(() => {
    getCV().then((res) => setCv(res.data))
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-semibold text-base text-zinc-100">
                Vista previa del CV
              </h3>
              <p className="text-sm mt-1 text-zinc-400">
                Este es el documento que los visitantes podrán descargar
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-500">
              <CheckCircle2 className="w-3.5 h-3.5" /> Actualizado
            </span>
          </div>

          <div className="rounded-lg border border-zinc-700 overflow-hidden bg-zinc-950">
            <div className="p-8 border-b border-zinc-700">
              <div className="flex items-center gap-5">
                <Skeleton noAnimation className="w-20 h-20 rounded-xl flex-shrink-0 bg-zinc-800" />
                <div>
                  <Skeleton noAnimation className="h-6 w-56 rounded mb-2 bg-zinc-800" />
                  <Skeleton noAnimation className="h-4 w-40 rounded bg-zinc-800" />
                </div>
              </div>
            </div>
            <div className="p-8 space-y-5">
              {[1, 2, 3].map((section) => (
                <div key={section}>
                  <Skeleton noAnimation className="h-4 w-24 rounded mb-3 bg-zinc-800" />
                  <div className="space-y-2">
                    <Skeleton noAnimation className="h-3 w-full rounded bg-zinc-800" />
                    <Skeleton noAnimation className="h-3 w-5/6 rounded bg-zinc-800" />
                    <Skeleton noAnimation className="h-3 w-4/6 rounded bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button>
              <Upload className="w-4 h-4" /> Reemplazar CV
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4" /> Descargar
            </Button>
          </div>
        </Card>
      </div>

      {cv && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-heading font-semibold text-base mb-5 text-zinc-100">
              Información del archivo
            </h3>
            <div className="space-y-4">
              {[
                { label: "Nombre", value: cv.fileName },
                { label: "Tamaño", value: `${(cv.fileSize / 1024).toFixed(0)} KB` },
                { label: "Tipo", value: cv.fileType },
                { label: "Páginas", value: String(cv.pages) },
                { label: "Última actualización", value: `Hace ${Math.floor((Date.now() - new Date(cv.lastUpdated).getTime()) / 86400000)} días` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-zinc-400">{item.label}</span>
                  <span className="font-mono text-zinc-100">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-cyan-500/30 bg-cyan-500/10 [&>div]:bg-transparent [&>div]:border-0">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-cyan-400" />
              <div>
                <p className="text-sm font-medium text-zinc-100">
                  Formato recomendado
                </p>
                <p className="text-xs mt-1 leading-relaxed text-zinc-400">
                  Sube tu CV en formato PDF, máximo 5MB. Se mostrará como enlace
                  de descarga en tu portafolio.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
