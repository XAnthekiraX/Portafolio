import { Router } from "express";
import { dashboardService } from "../../services/dashboard.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const counts = await dashboardService.getCounts();
    res.json({ data: counts });
  } catch (err) {
    next(err);
  }
});

export default router;
