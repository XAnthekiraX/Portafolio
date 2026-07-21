import { Router } from "express";
import { profileService } from "../../services/profile.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const profile = await profileService.getPublic();
    if (!profile) {
      res.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "Perfil no encontrado" } });
      return;
    }
    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
});

export default router;
