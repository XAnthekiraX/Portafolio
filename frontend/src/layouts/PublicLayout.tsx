import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
