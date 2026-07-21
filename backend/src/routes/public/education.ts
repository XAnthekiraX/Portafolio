import { Router } from "express";
import { educationService } from "../../services/education.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const education = await educationService.getPublic();
    res.json({ data: education });
  } catch (err) {
    next(err);
  }
});

export default router;
