import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { profiles } from "../../db/schema/profiles";
import { profileService } from "../../services/profile.service";
import { uploadService } from "../../services/upload.service";
import { uploadCv } from "../../config/multer";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const url = await profileService.getCvUrl(req.user?.id);
    if (!url) {
      res.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "CV no disponible" } });
      return;
    }
    const [profile] = await db
      .select({ cvUpdatedAt: profiles.cvUpdatedAt })
      .from(profiles)
      .limit(1);

    res.json({ data: { cvUrl: url, lastUpdated: profile?.cvUpdatedAt ?? null } });
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

    const [profile] = await db
      .select({ cvUrl: profiles.cvUrl, cvUpdatedAt: profiles.cvUpdatedAt })
      .from(profiles)
      .where(eq(profiles.id, req.user.id))
      .limit(1);

    res.status(200).json({ data: { cvUrl: profile!.cvUrl, lastUpdated: profile!.cvUpdatedAt } });
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
    res.json({ data: { status: "deleted" } });
  } catch (err) {
    next(err);
  }
});

export default router;
