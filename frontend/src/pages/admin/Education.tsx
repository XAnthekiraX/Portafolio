import { Plus, MoreHorizontal } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Button } from "../../components/ui/Button"
import { getEducation } from "../../services/admin"
import { queryKeys } from "../../lib/queryKeys"

export function Education() {
  const { data: items = [] } = useQuery({
    queryKey: queryKeys.education,
    queryFn: () => getEducation().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const academic = items.filter((i) => i.type === "academic")
  const certifications = items.filter((i) => i.type === "certification")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-base text-zinc-400">
          Tu formación académica y certificaciones
        </p>
        <Button>
          <Plus className="w-4 h-4" /> Agregar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
            Formación académica
          </h3>
          {academic.map((item) => (
            <div key={item.id} className="relative pl-10 pb-8 last:pb-0 before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-px before:bg-zinc-700 last:before:hidden">
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-red-600 bg-zinc-950" />
              <Card padding={false} className="!p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-heading font-semibold text-base text-zinc-100">
                    {item.title}
                  </h4>
                  <Button variant="ghost" className="!p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm mb-2 text-cyan-500">{item.institution}</p>
                <p className="text-xs text-zinc-400">
                  {item.startDate.slice(0, 4)} — {item.endDate.slice(0, 4)}
                </p>
                {item.description && (
                  <p className="text-sm mt-3 leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                )}
              </Card>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
            Certificaciones
          </h3>
          {certifications.map((item) => (
            <div key={item.id} className="relative pl-10 pb-8 last:pb-0 before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-px before:bg-zinc-700 last:before:hidden">
              <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-cyan-500 bg-zinc-950" />
              <Card padding={false} className="!p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-heading font-semibold text-base text-zinc-100">
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
                <p className="text-sm mb-2 text-cyan-500">{item.institution}</p>
                <p className="text-xs text-zinc-400">
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
