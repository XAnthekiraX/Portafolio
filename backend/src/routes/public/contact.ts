import { Router } from "express";
import { contactMessageService } from "../../services/contact-message.service";
import { validate } from "../../middleware/validate";
import { rateLimitContact } from "../../middleware/rate-limit";
import { createContactMessageSchema } from "../../validators/contact.validator";

const router = Router();

router.post("/", rateLimitContact, validate(createContactMessageSchema), async (req, res, next) => {
  try {
    const message = await contactMessageService.create(req.body);
    res.status(201).json({ data: message });
  } catch (err) {
    next(err);
  }
});

export default router;
