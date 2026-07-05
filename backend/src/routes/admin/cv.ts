import { Router } from "express";
import { profileService } from "../../services/profile.service";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const url = await profileService.getCvUrl();
    res.json({ data: { url } });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No autenticado" } });
      return;
    }
    const { url } = req.body;
    await profileService.updateCvUrl(req.user.id, url);
    res.status(201).json({ data: { url } });
  } catch (err) {
    next(err);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No autenticado" } });
      return;
    }
    await profileService.clearCvUrl(req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
