import { useEffect, useState, useRef } from "react"
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
  Trash2,
  Loader2,
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input, Textarea } from "../../components/ui/Input"
import { SocialLinkModal } from "../../components/admin/SocialLinkModal"
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  type UpdateProfilePayload,
} from "../../services/admin"
import type { AdminSocialLink } from "../../types/admin"
import { queryKeys } from "../../lib/queryKeys"
import { useNotification } from "../../context/NotificationContext"

export function Profile() {
  const queryClient = useQueryClient()
  const { data: profile, isLoading } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: ({ signal }) => getProfile(signal).then((r) => r.data),
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
    isAvailable: true,
  })

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [editingLink, setEditingLink] = useState<AdminSocialLink | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

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
        isAvailable: profile.isAvailable ?? true,
      })
    }
  }, [profile])

  const { notify } = useNotification()

  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.profile })
    queryClient.invalidateQueries({ queryKey: queryKeys.profileCompletion })
  }

  const saveMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      notify("Perfil guardado correctamente", "success")
      invalidateProfile()
    },
    onError: () => {
      notify("Error al guardar el perfil", "error")
    },
  })

  const createMutation = useMutation({
    mutationFn: (payload: { platform: string; url: string }) => createSocialLink(payload),
    onSuccess: () => {
      notify("Red social agregada", "success")
      setShowCreateModal(false)
      invalidateProfile()
    },
    onError: () => {
      notify("Error al agregar red social", "error")
    },
  })

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { platform: string; url: string } }) =>
      updateSocialLink(id, payload),
    onSuccess: () => {
      notify("Red social actualizada", "success")
      setEditingLink(null)
      invalidateProfile()
    },
    onError: () => {
      notify("Error al actualizar red social", "error")
    },
  })

  const avatarUploadMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      notify("Avatar actualizado", "success")
      setAvatarPreview(null)
      invalidateProfile()
    },
    onError: (error) => {
      const msg = typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "Error al subir avatar"
      notify(msg, "error")
      setAvatarPreview(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSocialLink,
    onSuccess: () => {
      notify("Red social eliminada", "success")
      invalidateProfile()
    },
    onError: () => {
      notify("Error al eliminar red social", "error")
    },
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center text-center p-8">
          <div className="h-32 w-32 rounded-2xl bg-zinc-700/50 animate-pulse mb-5" />
          <div className="h-6 w-40 rounded bg-zinc-700/50 animate-pulse mb-2" />
          <div className="h-4 w-28 rounded bg-zinc-700/50 animate-pulse" />
        </Card>
        <Card className="lg:col-span-2 p-8">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-20 rounded bg-zinc-700/50 animate-pulse" />
                <div className="h-10 w-full rounded-lg bg-zinc-700/50 animate-pulse" />
              </div>
            ))}
            <div className="h-10 w-40 rounded-lg bg-zinc-700/50 animate-pulse" />
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

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
          <input
            ref={avatarInputRef}
            type="file"
            accept=".webp,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              if (file.type !== "image/webp") {
                notify("El archivo debe ser formato WebP. Verificá que la imagen sea realmente WebP.", "error")
                e.target.value = ""
                return
              }
              setAvatarPreview(URL.createObjectURL(file))
              avatarUploadMutation.mutate(file)
              e.target.value = ""
            }}
          />
          <img
            src={avatarPreview || profile.avatarUrl}
            alt={profile.firstName ? `${profile.firstName} ${profile.lastName}` : "Avatar"}
            loading="lazy"
            className="w-32 h-32 rounded-2xl object-cover border-2 border-zinc-600"
          />
          <button
            onClick={() => avatarInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center border border-red-600 bg-red-600 cursor-pointer hover:bg-red-500 transition-colors disabled:opacity-50"
            disabled={avatarUploadMutation.isPending}
          >
            {avatarUploadMutation.isPending ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Camera className="w-4 h-4 text-white" />
            )}
          </button>
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
            <div className="sm:col-span-2 flex items-center gap-3 py-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.isAvailable}
                  onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                />
                <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-green-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500/30 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <div>
                <p className="text-sm font-medium text-zinc-100">Disponible para proyectos</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {form.isAvailable ? "Aparecerá como disponible en tu portafolio" : "Ocultar estado de disponibilidad"}
                </p>
              </div>
            </div>
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
                isAvailable: profile.isAvailable ?? true,
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
                <span className="text-sm flex-1 text-zinc-100 truncate">{link.url}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    className="!p-1.5"
                    onClick={() => setEditingLink(link)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="!p-1.5 hover:!bg-red-500/10 hover:!text-red-500"
                    onClick={() => deleteMutation.mutate(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
          <Button
            variant="secondary"
            className="mt-5 w-full justify-center"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" /> Agregar red social
          </Button>
        </Card>
      </div>

      {showCreateModal && (
        <SocialLinkModal
          mode="create"
          onSave={(platform, url) => createMutation.mutate({ platform, url })}
          onCancel={() => setShowCreateModal(false)}
          isPending={createMutation.isPending}
        />
      )}

      {editingLink && (
        <SocialLinkModal
          mode="edit"
          initialPlatform={editingLink.platform}
          initialUrl={editingLink.url}
          onSave={(platform, url) =>
            editMutation.mutate({ id: editingLink.id, payload: { platform, url } })
          }
          onCancel={() => setEditingLink(null)}
          isPending={editMutation.isPending}
        />
      )}
    </div>
  )
}
