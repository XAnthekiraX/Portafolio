import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Tag } from "../../components/ui/Tag"
import type { SkillCategory } from "../../types/admin"
import { getSkills } from "../../services/admin"

const dotColors = ["bg-red-600", "bg-cyan-500", "bg-green-500", "bg-yellow-500"]

export function Skills() {
  const [skills, setSkills] = useState<SkillCategory[]>([])

  useEffect(() => {
    getSkills().then((res) => setSkills(res.data))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-base text-zinc-400">
          {skills.reduce((a, c) => a + c.technologies.length, 0)} skills organizadas en{" "}
          {skills.length} categorías
        </p>
        <Button>
          <Plus className="w-4 h-4" /> Nueva skill
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((cat, i) => (
          <Card key={cat.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-2.5 h-2.5 rounded-full ${dotColors[i % dotColors.length]}`} />
              <h3 className="font-heading font-semibold text-base text-zinc-100">
                {cat.name}
              </h3>
              <span className="font-mono text-xs ml-auto text-zinc-400">
                {cat.technologies.length} skills
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
