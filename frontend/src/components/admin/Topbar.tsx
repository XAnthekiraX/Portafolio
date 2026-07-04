import { Bell, Menu } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../context/NotificationContext"

interface TopbarProps {
  title: string
  onToggleSidebar: () => void
}

export function Topbar({ title, onToggleSidebar }: TopbarProps) {
  const { user } = useAuth()
  const { notifications, removeNotification, markAllRead } = useNotification()
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="h-15 min-h-15 bg-zinc-900 border-b border-zinc-700 flex items-center px-6 gap-4 max-md:px-4">
      <button
        className="w-9 h-9 rounded-lg border border-zinc-600 bg-transparent text-zinc-400 cursor-pointer flex items-center justify-center hover:text-zinc-100 hover:bg-zinc-700/50 transition-all duration-150 max-md:flex lg:hidden xl:hidden"
        onClick={onToggleSidebar}
        aria-label="Abrir menú"
      >
        <Menu className="w-4 h-4" />
      </button>

      <h1 className="font-heading font-semibold text-base text-zinc-100">
        {title}
      </h1>

      <div className="flex-1" />

      <div className="relative">
        <button
          className="w-9 h-9 rounded-lg border border-zinc-600 bg-transparent text-zinc-400 cursor-pointer flex items-center justify-center hover:text-zinc-100 hover:bg-zinc-700/50 transition-all duration-150"
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
                <h3 className="text-sm font-semibold text-zinc-100">Notificaciones</h3>
                <button
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none"
                  onClick={markAllRead}
                >
                  Marcar todas leídas
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-8">Sin notificaciones</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-zinc-700/50 flex items-start gap-3 transition-colors ${
                        n.read ? "opacity-60" : "bg-zinc-800"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-200">{n.message}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{n.time}</p>
                      </div>
                      <button
                        className="text-zinc-500 hover:text-zinc-300 cursor-pointer bg-transparent border-none shrink-0"
                        onClick={() => removeNotification(n.id)}
                      >
                        ×
                      </button>
                    </div>
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
          className="w-8 h-8 rounded-full object-cover border border-zinc-600"
        />
      )}
    </header>
  )
}
