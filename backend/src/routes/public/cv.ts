import { Router } from "express";
import { cvService } from "../../services/cv.service";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const url = await cvService.getUrl();
    if (!url) {
      res.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "CV no disponible" } });
      return;
    }
    res.redirect(url);
  } catch (err) {
    next(err);
  }
});

export default router;
