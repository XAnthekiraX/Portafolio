import { Router } from "express";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}
import { serviceService } from "../../services/service.service.js";
import { validate } from "../../middleware/validate.js";
import { createServiceSchema, updateServiceSchema } from "../../validators/service.validator.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const services = await serviceService.getAll();
    res.json({ data: services });
  } catch (err) {
    next(err);
  }
});

router.post("/", validate(createServiceSchema), async (req, res, next) => {
  try {
    const service = await serviceService.create(req.body);
    res.status(201).json({ data: service });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", validate(updateServiceSchema), async (req, res, next) => {
  try {
    const service = await serviceService.update(p(req.params.id), req.body);
    res.json({ data: service });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await serviceService.remove(p(req.params.id));
    res.json({ data: { status: "deleted" } });
  } catch (err) {
    next(err);
  }
});

export default router;
