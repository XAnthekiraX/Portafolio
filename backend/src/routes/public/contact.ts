import { Router } from "express";
import { contactMessageService } from "../../services/contact-message.service.js";
import { validate } from "../../middleware/validate.js";
import { rateLimitContact } from "../../middleware/rate-limit.js";
import { createContactMessageSchema } from "../../validators/contact.validator.js";

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
