import { Router } from "express";
import { profileService } from "../../services/profile.service";
import { uploadService } from "../../services/upload.service";
import { uploadCv } from "../../config/multer";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const url = await profileService.getCvUrl();
    res.json({ data: { url } });
  } catch (err) {
    next(err);
  }
});

router.post("/", uploadCv.single("file"), async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No autenticado" } });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Archivo PDF requerido" } });
      return;
    }

    const publicUrl = await uploadService.uploadFile(
      "Images",
      `${req.user.id}/cv.pdf`,
      req.file.buffer,
      "application/pdf",
    );

    await profileService.updateCvUrl(req.user.id, publicUrl);
    res.status(201).json({ data: { url: publicUrl } });
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
