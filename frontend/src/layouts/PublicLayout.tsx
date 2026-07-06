import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { SeoHead } from "../components/SeoHead"

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SeoHead />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
