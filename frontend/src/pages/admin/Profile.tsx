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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input, Textarea } from "../../components/ui/Input"
import { getProfile, updateProfile, type UpdateProfilePayload } from "../../services/admin"
import { queryKeys } from "../../lib/queryKeys"
import { useNotification } from "../../context/NotificationContext"

export function Profile() {
  const queryClient = useQueryClient()
  const { data: profile } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => getProfile().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })

  const [form, setForm] = useState<UpdateProfilePayload>({
    firstName: "",
    lastName: "",
    title: "",
    description: "",
    location: "",
    experienceYears: 0,
    email: "",
  })

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        title: profile.title,
        description: profile.description,
        location: profile.location,
        experienceYears: profile.experienceYears,
        email: profile.email,
      })
    }
  }, [profile])

  const { notify } = useNotification()

  const saveMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      notify("Perfil guardado correctamente", "success")
      queryClient.invalidateQueries({ queryKey: queryKeys.profile })
      queryClient.invalidateQueries({ queryKey: queryKeys.profileCompletion })
    },
    onError: () => {
      notify("Error al guardar el perfil", "error")
    },
  })

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
        <div className="relative mb-5">
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="w-32 h-32 rounded-2xl object-cover border-2 border-zinc-600"
          />
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center border border-red-600 bg-red-600">
            <Camera className="w-4 h-4 text-white" />
          </div>
        </div>
        <h2 className="font-heading font-bold text-xl text-zinc-100">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-base mt-1.5 text-cyan-500">{profile.title}</p>
        <p className="text-sm mt-4 leading-relaxed max-w-[260px] text-zinc-400">
          {profile.description}
        </p>
        <div className="flex items-center gap-2 mt-4 text-sm text-zinc-400">
          <MapPin className="w-4 h-4" />
          {profile.location}
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-sm text-zinc-400">
          <Briefcase className="w-4 h-4" />
          {profile.experienceYears} años de experiencia
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h3 className="font-heading font-semibold text-base mb-6 text-zinc-100">
            Información personal
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Nombre"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              label="Apellido"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <Input
              label="Título"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Textarea
                label="Descripción"
                value={form.description}
                rows={4}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <Input
              label="Ubicación"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <Input
              label="Experiencia"
              type="number"
              value={form.experienceYears}
              onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-zinc-700">
            <Button
              variant="secondary"
              onClick={() => setForm({
                firstName: profile.firstName,
                lastName: profile.lastName,
                title: profile.title,
                description: profile.description,
                location: profile.location,
                experienceYears: profile.experienceYears,
                email: profile.email,
              })}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => saveMutation.mutate(form)}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold text-base mb-5 text-zinc-100">
            Redes sociales
          </h3>
          {profile.socialLinks.map((link) => {
            const Icon = socialIcons[link.platform] || Globe
            return (
              <div
                key={link.id}
                className="flex items-center gap-3 py-3 border-b border-zinc-700 last:border-b-0 text-sm"
              >
                <Icon className="w-5 h-5 flex-shrink-0 text-zinc-400" />
                <span className="font-mono text-xs text-zinc-400 w-[80px]">
                  {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                </span>
                <span className="text-sm flex-1 text-zinc-100">{link.url}</span>
                <Button variant="ghost" className="!p-1.5">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            )
          })}
          <Button variant="secondary" className="mt-5 w-full justify-center">
            <Plus className="w-4 h-4" /> Agregar red social
          </Button>
        </Card>
      </div>
    </div>
  )
}
