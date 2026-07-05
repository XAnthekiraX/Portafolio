import { Router } from "express";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}
import { technologyService } from "../../services/technology.service";
import { validate } from "../../middleware/validate";
import { createTechnologySchema, updateTechnologySchema } from "../../validators/technology.validator";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const technologies = await technologyService.getAll();
    res.json({ data: technologies });
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(createTechnologySchema), async (req, res, next) => {
  try {
    const tech = await technologyService.create(req.body);
    res.status(201).json({ data: tech });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", validate(updateTechnologySchema), async (req, res, next) => {
  try {
    const tech = await technologyService.update(p(req.params.id), req.body);
    res.json({ data: tech });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await technologyService.remove(p(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
