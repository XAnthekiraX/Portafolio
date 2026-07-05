import { Router } from "express";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}
import { projectService } from "../../services/project.service";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const projects = await projectService.getPublic();
    res.json({ data: projects });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const project = await projectService.getById(p(req.params.id));
    if (!project || project.status !== "published") {
      res.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "Proyecto no encontrado" } });
      return;
    }
    await projectService.incrementVisits(p(req.params.id));
    res.json({ data: project });
  } catch (err) {
    next(err);
  }
});

export default router;
