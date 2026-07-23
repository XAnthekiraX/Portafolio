import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  User,
  Zap,
  FileText,
  GraduationCap,
  Cpu,
  FolderKanban,
  Briefcase,
  Code2,
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const navGroups = [
  {
    label: "General",
    items: [
      { to: "/admin", label: "Panel", icon: LayoutDashboard },
    ],
  },
  {
    label: "Perfil",
    items: [
      { to: "/admin/profile", label: "Perfil", icon: User },
      { to: "/admin/skills", label: "Habilidades", icon: Zap },
      { to: "/admin/cv", label: "CV", icon: FileText },
      { to: "/admin/education", label: "Formacion", icon: GraduationCap },
    ],
  },
  {
    label: "Contenido",
    items: [
      { to: "/admin/technologies", label: "Tecnologias", icon: Cpu },
      { to: "/admin/projects", label: "Proyectos", icon: FolderKanban },
      { to: "/admin/services", label: "Servicios", icon: Briefcase },
    ],
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside
      role="navigation"
      aria-label="Navegacion admin"
      className="w-64 min-w-64 bg-zinc-900 border-r border-zinc-700 flex flex-col z-40 transition-all duration-300 max-lg:w-16 max-lg:min-w-16 max-md:fixed max-md:-left-64 max-md:w-64 max-md:top-0 max-md:bottom-0 max-md:z-50 max-md:data-[open=true]:left-0"
      id="sidebar"
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-zinc-700 max-lg:justify-center max-lg:px-2 max-md:justify-start max-md:px-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-600">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-heading font-semibold text-base text-zinc-100 max-lg:hidden max-md:inline">
          FolioCMS
        </span>
      </div>

      <nav className="flex-1 px-4 py-5 overflow-y-auto flex flex-col gap-0.5 max-lg:px-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400 px-4 mb-2 mt-4 first:mt-0 max-lg:hidden max-md:block">
              {group.label}
            </p>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium relative transition-all duration-150 max-lg:justify-center max-lg:px-2 max-md:justify-start max-md:px-4 ${
                    isActive
                      ? "text-zinc-100 bg-zinc-700/50 before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-6 before:bg-red-600 before:rounded-r before:max-lg:left-0"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50"
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="max-lg:hidden max-md:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-zinc-700 flex items-center gap-3 max-lg:justify-center max-md:justify-start max-md:px-5">
        {user && (
          <>
            <img
              src={`https://picsum.photos/seed/${user.email}/80/80.jpg`}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />
            <div className="min-w-0 max-lg:hidden max-md:block">
              <p className="text-sm font-medium truncate text-zinc-100">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs truncate text-zinc-400">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="ml-auto text-xs text-zinc-500 hover:text-red-400 transition-colors max-lg:hidden max-md:block"
              title="Cerrar sesión"
            >
              Salir
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
