import { Router } from "express";
import { skillCategoryService } from "../../services/skill-category.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const skills = await skillCategoryService.getAll();
    res.json({ data: skills });
  } catch (err) {
    next(err);
  }
});

export default router;
