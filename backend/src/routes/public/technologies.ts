import { Router } from "express";
import { technologyService } from "../../services/technology.service";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const technologies = await technologyService.getAll();
    res.json({ data: technologies });
  } catch (err) {
    next(err);
  }
});

export default router;
