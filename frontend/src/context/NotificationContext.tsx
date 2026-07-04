import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  read: boolean
  time: string
}

interface NotificationContextValue {
  notifications: Notification[]
  notify: (message: string, type?: Notification["type"]) => void
  removeNotification: (id: string) => void
  markAllRead: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const notify = useCallback((message: string, type: Notification["type"] = "info") => {
    const id = crypto.randomUUID()
    const now = new Date()
    const time = now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    setNotifications((prev) => [
      { id, message, type, read: false, time },
      ...prev,
    ])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 6000)
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, notify, removeNotification, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotification must be used within a NotificationProvider")
  return ctx
}
