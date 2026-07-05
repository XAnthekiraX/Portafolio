import { Router } from "express";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}
import { skillCategoryService } from "../../services/skill-category.service";
import { validate } from "../../middleware/validate";
import { createSkillCategorySchema, updateSkillCategorySchema } from "../../validators/skill.validator";

function normalizeTechs(techs: (string | { name: string; displayOrder?: number })[]) {
  return techs.map((t) =>
    typeof t === "string" ? { name: t } : t,
  );
}

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const skills = await skillCategoryService.getAll();
    res.json({ data: skills });
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(createSkillCategorySchema), async (req, res, next) => {
  try {
    const { technologies: techs, ...data } = req.body;
    const category = await skillCategoryService.create(data);

    if (techs?.length) {
      await skillCategoryService.replaceTechnologies(category.id, normalizeTechs(techs));
    }

    const result = await skillCategoryService.getAll();
    const created = result.find((c) => c.id === category.id);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", validate(updateSkillCategorySchema), async (req, res, next) => {
  try {
    const { technologies: techs, ...data } = req.body;
    const category = await skillCategoryService.update(p(req.params.id), data);

    if (techs) {
      await skillCategoryService.replaceTechnologies(p(req.params.id), normalizeTechs(techs));
    }

    const result = await skillCategoryService.getAll();
    const updated = result.find((c) => c.id === category.id);
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await skillCategoryService.remove(p(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
