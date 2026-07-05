import { Bell, Menu, Mail, Clock } from "lucide-react"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../../context/AuthContext"
import { getNotifications, markContactRead } from "../../services/admin"
import { queryKeys } from "../../lib/queryKeys"

interface TopbarProps {
  title: string
  onToggleSidebar: () => void
}

export function Topbar({ title, onToggleSidebar }: TopbarProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showNotifications, setShowNotifications] = useState(false)

  const { data: notifData } = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => getNotifications().then((r) => r.data),
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
  })

  const markReadMutation = useMutation({
    mutationFn: markContactRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard })
    },
  })

  return (
    <header className="h-16 min-h-16 bg-zinc-900 border-b border-zinc-700 flex items-center px-6 gap-5 max-md:px-4">
      <button
        className="w-10 h-10 rounded-xl border border-zinc-600 bg-transparent text-zinc-400 cursor-pointer flex items-center justify-center hover:text-zinc-100 hover:bg-zinc-700/50 transition-all duration-150 max-md:flex lg:hidden xl:hidden"
        onClick={onToggleSidebar}
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-heading font-semibold text-lg text-zinc-100">
        {title}
      </h1>

      <div className="flex-1" />

      <div className="relative">
        <button
          className="w-10 h-10 rounded-xl border border-zinc-600 bg-transparent text-zinc-400 cursor-pointer flex items-center justify-center hover:text-zinc-100 hover:bg-zinc-700/50 transition-all duration-150"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          {(notifData?.unreadCount ?? 0) > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {notifData!.unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-700">
                <h3 className="text-sm font-semibold text-zinc-100">Notificaciones</h3>
                {notifData && notifData.todayCount > 0 && (
                  <span className="text-xs text-cyan-400">
                    {notifData.todayCount} hoy
                  </span>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {!notifData || notifData.recent.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-8">Sin notificaciones</p>
                ) : (
                  notifData.recent.map((n) => (
                    <button
                      key={n.id}
                      onClick={async () => {
                        await markReadMutation.mutateAsync(n.id)
                        window.location.href = `mailto:${n.email}?subject=Re: ${n.subject}`
                      }}
                      className="w-full text-left block px-5 py-3.5 border-b border-zinc-700/50 flex items-start gap-3 bg-zinc-800 hover:bg-zinc-700/50 transition-colors cursor-pointer border-none"
                    >
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-100 truncate">
                          {n.subject}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {n.name} &lt;{n.email}&gt;
                        </p>
                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[11px] text-zinc-600 mt-1.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(n.createdAt).toLocaleString("es-ES", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {user && (
        <img
          src={`https://picsum.photos/seed/${user.email}/80/80.jpg`}
          alt="Avatar"
          className="w-9 h-9 rounded-full object-cover border border-zinc-600"
        />
      )}
    </header>
  )
}
