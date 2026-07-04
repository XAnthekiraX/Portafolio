import { useEffect, useState } from "react"
import {
  Camera,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Pencil,
  Plus,
} from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input, Textarea } from "../../components/ui/Input"
import type { Profile as ProfileType } from "../../types/admin"
import { getProfile } from "../../services/admin"

export function Profile() {
  const [profile, setProfile] = useState<ProfileType | null>(null)

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data))
  }, [])

  if (!profile) return null

  const socialIcons: Record<string, typeof Github> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="w-28 h-28 rounded-2xl object-cover border-2 border-zinc-600"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center border border-red-600 bg-red-600">
            <Camera className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
        <h2 className="font-heading font-bold text-lg text-zinc-100">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-sm mt-1 text-cyan-500">{profile.title}</p>
        <p className="text-xs mt-3 leading-relaxed max-w-[240px] text-zinc-400">
          {profile.description}
        </p>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-zinc-400">
          <MapPin className="w-3 h-3" />
          {profile.location}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-400">
          <Briefcase className="w-3 h-3" />
          {profile.experienceYears} años de experiencia
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h3 className="font-heading font-semibold text-sm mb-5 text-zinc-100">
            Información personal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nombre" value={profile.firstName} readOnly />
            <Input label="Apellido" value={profile.lastName} readOnly />
            <Input label="Título" value={profile.title} readOnly />
            <Input label="Email" value={profile.email} readOnly />
            <div className="sm:col-span-2">
              <Textarea label="Descripción" value={profile.description} rows={3} readOnly />
            </div>
            <Input label="Ubicación" value={profile.location} readOnly />
            <Input label="Experiencia" value={`${profile.experienceYears} años`} readOnly />
          </div>
          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-zinc-700">
            <Button variant="secondary">Cancelar</Button>
            <Button>Guardar cambios</Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold text-sm mb-4 text-zinc-100">
            Redes sociales
          </h3>
          {profile.socialLinks.map((link) => {
            const Icon = socialIcons[link.platform] || Globe
            return (
              <div
                key={link.id}
                className="flex items-center gap-2.5 py-2 border-b border-zinc-700 last:border-b-0 text-[13px]"
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-zinc-400" />
                <span className="font-mono text-xs text-zinc-400 w-[70px]">
                  {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                </span>
                <span className="text-sm flex-1 text-zinc-100">{link.url}</span>
                <Button variant="ghost" className="!p-1">
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </div>
            )
          })}
          <Button variant="secondary" className="mt-4 w-full justify-center">
            <Plus className="w-3.5 h-3.5" /> Agregar red social
          </Button>
        </Card>
      </div>
    </div>
  )
}
