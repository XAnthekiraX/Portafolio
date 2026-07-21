import { Router } from "express";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}
import { contactMessageService } from "../../services/contact-message.service.js";
import { validate } from "../../middleware/validate.js";
import { updateContactStatusSchema } from "../../validators/contact.validator.js";

const router = Router();

router.get("/count", async (_req, res, next) => {
  try {
    const count = await contactMessageService.getCount();
    res.json({ data: count });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const messages = await contactMessageService.getAll();
    res.json({ data: messages });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const message = await contactMessageService.getById(p(req.params.id));
    if (!message) {
      res.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "Mensaje no encontrado" } });
      return;
    }
    res.json({ data: message });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", validate(updateContactStatusSchema), async (req, res, next) => {
  try {
    const message = await contactMessageService.updateStatus(p(req.params.id), req.body.status);
    res.json({ data: message });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await contactMessageService.remove(p(req.params.id));
    res.json({ data: { status: "deleted" } });
  } catch (err) {
    next(err);
  }
});

export default router;
