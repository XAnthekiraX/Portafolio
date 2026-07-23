import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "../components/admin/Sidebar"
import { Topbar } from "../components/admin/Topbar"

const viewTitles: Record<string, string> = {
  "/admin": "Panel",
  "/admin/profile": "Perfil",
  "/admin/skills": "Habilidades",
  "/admin/cv": "CV",
  "/admin/education": "Formacion",
  "/admin/technologies": "Tecnologias",
  "/admin/projects": "Proyectos",
  "/admin/services": "Servicios",
}

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = viewTitles[location.pathname] || "Admin"

  useEffect(() => {
    if (!sidebarOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div
        aria-hidden="true"
        role="presentation"
        className={`${sidebarOpen ? "block" : "hidden"} fixed inset-0 bg-black/50 z-30 max-md:block lg:hidden`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        data-open={sidebarOpen}
        className="max-md:data-[open=true]:!left-0"
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar title={title} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-8 max-md:p-4 max-lg:p-6 bg-[radial-gradient(circle_at_1px_1px,rgba(63,63,70,0.5)_0.5px,transparent_0)] bg-[length:32px_32px] bg-[position:16px_16px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
