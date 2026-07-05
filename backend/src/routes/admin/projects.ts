import { Router } from "express";
import { projectService } from "../../services/project.service";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}
import { validate } from "../../middleware/validate";
import { createProjectSchema, updateProjectSchema } from "../../validators/project.validator";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const projects = await projectService.getAll();
    res.json({ data: projects });
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(createProjectSchema), async (req, res, next) => {
  try {
    const { technologyIds, ...data } = req.body;
    const project = await projectService.create(data);

    if (technologyIds?.length) {
      await projectService.replaceTechnologies(project.id, technologyIds);
    }

    const result = await projectService.getById(project.id);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", validate(updateProjectSchema), async (req, res, next) => {
  try {
    const { technologyIds, ...data } = req.body;
    const project = await projectService.update(p(req.params.id), data);

    if (technologyIds) {
      await projectService.replaceTechnologies(p(req.params.id), technologyIds);
    }

    const result = await projectService.getById(project.id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await projectService.remove(p(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
