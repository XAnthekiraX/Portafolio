import { Plus, Pencil, ExternalLink, Github, MoreHorizontal } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Tag } from "../../components/ui/Tag"
import { Button } from "../../components/ui/Button"
import { getProjects } from "../../services/admin"
import { queryKeys } from "../../lib/queryKeys"

export function Projects() {
  const { data: projects = [] } = useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => getProjects().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-base text-zinc-400">
          {projects.length} proyectos en tu portafolio
        </p>
        <Button>
          <Plus className="w-4 h-4" /> Nuevo proyecto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Card key={p.id} padding={false} className="overflow-hidden group">
            <div className="overflow-hidden">
              <img
                src={p.imageUrl}
                alt=""
                className="w-full aspect-[16/10] object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-102"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-heading font-semibold text-base text-zinc-100">
                  {p.title}
                </h4>
                <Button variant="ghost" className="!p-1.5">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm leading-relaxed mb-4 text-zinc-400">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.technologies.slice(0, 4).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                <Badge
                  variant={
                    p.status === "published"
                      ? "green"
                      : p.status === "draft"
                      ? "yellow"
                      : "red"
                  }
                >
                  {p.status === "published"
                    ? "Publicado"
                    : p.status === "draft"
                    ? "Borrador"
                    : "Oculto"}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" className="!p-1.5">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="!p-1.5">
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Card ghost className="flex flex-col items-center justify-center text-center min-h-[340px]">
          <div className="w-16 h-16 rounded-2xl bg-zinc-700/50 border border-zinc-600 flex items-center justify-center mb-4 text-zinc-400">
            <Plus className="w-7 h-7" />
          </div>
          <p className="text-base font-medium text-zinc-400">
            Agregar proyecto
          </p>
          <p className="text-sm mt-1 max-w-[220px] text-zinc-500">
            Añade un nuevo proyecto a tu portafolio
          </p>
        </Card>
      </div>

      <Card padding={false} className="mt-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-700">
          <h3 className="font-heading font-semibold text-base text-zinc-100">
            Todos los proyectos
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Proyecto", "Estado", "Tecnologías", "Visitas", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left font-mono text-xs font-medium uppercase tracking-wider text-zinc-400 px-5 py-3 border-b border-zinc-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors duration-100 hover:bg-zinc-700/30"
                >
                  <td className="px-5 py-4 text-sm font-medium text-zinc-100 border-b border-zinc-700">
                    {p.title}
                  </td>
                  <td className="px-5 py-4 border-b border-zinc-700">
                    <Badge
                      variant={
                        p.status === "published"
                          ? "green"
                          : p.status === "draft"
                          ? "yellow"
                          : "red"
                      }
                    >
                      {p.status === "published"
                        ? "Publicado"
                        : p.status === "draft"
                        ? "Borrador"
                        : "Oculto"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 border-b border-zinc-700">
                    <div className="flex gap-1">
                      {p.technologies.slice(0, 2).map((t) => (
                        <Tag key={t}>{t}</Tag>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-sm text-zinc-400 border-b border-zinc-700">
                    {p.visits || "—"}
                  </td>
                  <td className="px-5 py-4 border-b border-zinc-700">
                    <Button variant="ghost" className="!p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
