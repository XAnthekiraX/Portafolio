import { X } from "lucide-react"
import { useNotification } from "../../context/NotificationContext"

const typeStyles: Record<string, string> = {
  success: "border-green-500/30 bg-green-500/10 text-green-400",
  error: "border-red-500/30 bg-red-500/10 text-red-400",
  info: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
  warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
}

export function ToastContainer() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm ${typeStyles[n.type] || typeStyles.info}`}
        >
          <span className="flex-1">{n.message}</span>
          <button
            onClick={() => removeNotification(n.id)}
            className="cursor-pointer bg-transparent border-none p-0 leading-none opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
