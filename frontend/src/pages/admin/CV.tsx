import { useEffect, useState, useRef } from "react"
import { Upload, Download, Trash2, FileText, Info, Loader2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { getCV, uploadCv, deleteCv } from "../../services/admin"
import { queryKeys } from "../../lib/queryKeys"
import { useNotification } from "../../context/NotificationContext"

export function CV() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { notify } = useNotification()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { data: cv } = useQuery({
    queryKey: queryKeys.cv,
    queryFn: () => getCV().then((r) => r.data),
    staleTime: 0,
  })

  useEffect(() => {
    if (cv?.downloadUrl) {
      const cacheBuster = `?t=${new Date().getTime()}`;
      setPreviewUrl(`${cv.downloadUrl}${cacheBuster}`);
    }
  }, [cv])

  const uploadMutation = useMutation({
    mutationFn: uploadCv,
    onSuccess: (res) => {
      notify("CV subido correctamente", "success")
      const cacheBuster = `?t=${new Date().getTime()}`;
      setPreviewUrl(`${res.data.url}${cacheBuster}`)
      queryClient.invalidateQueries({ queryKey: queryKeys.cv })
    },
    onError: (error) => {
      const msg = typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "Error al subir CV"
      notify(msg, "error")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCv,
    onSuccess: () => {
      notify("CV eliminado", "success")
      setPreviewUrl(null)
      queryClient.invalidateQueries({ queryKey: queryKeys.cv })
    },
    onError: () => {
      notify("Error al eliminar CV", "error")
    },
  })

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
                {cv
                  ? "Este es el documento que los visitantes podrán descargar"
                  : "Aún no has subido ningún CV"}
              </p>
            </div>
            {cv && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-500">
                <Upload className="w-3.5 h-3.5" /> Subido
              </span>
            )}
          </div>

          <div className="rounded-lg border border-zinc-700 overflow-hidden bg-zinc-950">
            <div className="p-8 border-b border-zinc-700">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center bg-zinc-800 flex-shrink-0">
                  <FileText className="w-8 h-8 text-zinc-400" />
                </div>
                <div>
                  <p className="text-base font-medium text-zinc-100">
                    {cv?.fileName || "Ningún archivo seleccionado"}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    {cv ? `${(cv.fileSize / 1024).toFixed(0)} KB · PDF` : "Subí tu CV en formato PDF"}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[500px] rounded-lg border-0"
                  title="Vista previa del CV"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                  <FileText className="w-12 h-12 mb-3 text-zinc-600" />
                  <p className="text-sm">Sin vista previa disponible</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                if (file.type !== "application/pdf") {
                  notify("Solo se acepta formato PDF", "error")
                  e.target.value = ""
                  return
                }
                uploadMutation.mutate(file)
                e.target.value = ""
              }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo...</>
              ) : (
                <><Upload className="w-4 h-4" /> {cv ? "Reemplazar CV" : "Subir CV"}</>
              )}
            </Button>
            {previewUrl && (
              <Button
                variant="secondary"
                onClick={() => window.open(previewUrl, "_blank")}
              >
                <Download className="w-4 h-4" /> Descargar
              </Button>
            )}
            {cv && (
              <Button
                variant="secondary"
                className="!text-red-400 hover:!bg-red-500/10 hover:!text-red-400"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </Button>
            )}
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <h3 className="font-heading font-semibold text-base mb-5 text-zinc-100">
            Información del archivo
          </h3>
          {cv ? (
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
          ) : (
            <p className="text-sm text-zinc-500">No hay CV subido</p>
          )}
        </Card>

        <Card className="border-cyan-500/30 bg-cyan-500/10 [&>div]:bg-transparent [&>div]:border-0">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-zinc-100">
                Formato recomendado
              </p>
              <p className="text-xs mt-1 leading-relaxed text-zinc-400">
                Sube tu CV en formato PDF, máximo 10MB. Se mostrará como enlace
                de descarga en tu portafolio.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
