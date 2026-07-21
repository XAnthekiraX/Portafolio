import { Router } from "express";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}
import { educationService } from "../../services/education.service.js";
import { validate } from "../../middleware/validate.js";
import { createEducationSchema, updateEducationSchema } from "../../validators/education.validator.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const items = await educationService.getAll();
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(createEducationSchema), async (req, res, next) => {
  try {
    const item = await educationService.create(req.body);
    res.status(201).json({ data: item });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", validate(updateEducationSchema), async (req, res, next) => {
  try {
    const item = await educationService.update(p(req.params.id), req.body);
    res.json({ data: item });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await educationService.remove(p(req.params.id));
    res.json({ data: { status: "deleted" } });
  } catch (err) {
    next(err);
  }
});

export default router;
