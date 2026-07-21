import { Router } from "express";
import { serviceService } from "../../services/service.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const services = await serviceService.getAll();
    res.json({ data: services });
  } catch (err) {
    next(err);
  }
});

export default router;
