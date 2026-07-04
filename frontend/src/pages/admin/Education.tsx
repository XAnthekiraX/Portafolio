import { useEffect, useState } from "react"
import { Plus, MoreHorizontal } from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import type { EducationItem } from "../../types/admin"
import { getEducation } from "../../services/admin"

export function Education() {
  const [items, setItems] = useState<EducationItem[]>([])

  useEffect(() => {
    getEducation().then((res) => setItems(res.data))
  }, [])

  const academic = items.filter((i) => i.type === "academic")
  const certifications = items.filter((i) => i.type === "certification")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-400">
          Tu formación académica y certificaciones
        </p>
        <Button>
          <Plus className="w-3.5 h-3.5" /> Agregar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-5">
            Formación académica
          </h3>
          {academic.map((item) => (
            <div key={item.id} className="relative pl-8 pb-7 last:pb-0 before:absolute before:left-[5px] before:top-2 before:bottom-0 before:w-px before:bg-zinc-700 last:before:hidden">
              <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-red-600 bg-zinc-950" />
              <Card padding={false} className="!p-4">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-heading font-semibold text-sm text-zinc-100">
                    {item.title}
                  </h4>
                  <Button variant="ghost" className="!p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs mb-2 text-cyan-500">{item.institution}</p>
                <p className="text-[11px] text-zinc-400">
                  {item.startDate.slice(0, 4)} — {item.endDate.slice(0, 4)}
                </p>
                {item.description && (
                  <p className="text-xs mt-2 leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                )}
              </Card>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-5">
            Certificaciones
          </h3>
          {certifications.map((item) => (
            <div key={item.id} className="relative pl-8 pb-7 last:pb-0 before:absolute before:left-[5px] before:top-2 before:bottom-0 before:w-px before:bg-zinc-700 last:before:hidden">
              <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-cyan-500 bg-zinc-950" />
              <Card padding={false} className="!p-4">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-heading font-semibold text-sm text-zinc-100">
                    {item.title}
                  </h4>
                  <Badge
                    variant={
                      item.status === "active"
                        ? "green"
                        : item.status === "expiring"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {item.status === "active"
                      ? "Activo"
                      : item.status === "expiring"
                      ? "Próximo a expirar"
                      : "Expirado"}
                  </Badge>
                </div>
                <p className="text-xs mb-2 text-cyan-500">{item.institution}</p>
                <p className="text-[11px] text-zinc-400">
                  Obtenido:{" "}
                  {new Date(item.startDate).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
