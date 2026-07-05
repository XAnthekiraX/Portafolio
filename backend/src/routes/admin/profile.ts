import { Router } from "express";
import { profileService } from "../../services/profile.service";
import { socialLinkService } from "../../services/social-link.service";
import { profileCompletionService } from "../../services/profile-completion.service";
import { uploadService } from "../../services/upload.service";
import { uploadAvatar } from "../../config/multer";
import { validate } from "../../middleware/validate";
import { updateProfileSchema } from "../../validators/profile.validator";
import { createSocialLinkSchema, updateSocialLinkSchema } from "../../validators/social.validator";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const profile = await profileService.getAdmin();
    if (!profile) {
      res.status(404).json({ error: { code: "RESOURCE_NOT_FOUND", message: "Perfil no encontrado" } });
      return;
    }
    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
});

router.put("/", uploadAvatar.single("avatar"), async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No autenticado" } });
      return;
    }

    const data: Record<string, unknown> = {};

    const fields = ["firstName", "lastName", "title", "description", "location", "email"];
    for (const field of fields) {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    }
    if (req.body.experienceYears !== undefined) {
      data.experienceYears = parseInt(req.body.experienceYears as string, 10);
    }
    if (req.body.isAvailable !== undefined) {
      data.isAvailable = req.body.isAvailable === "true";
    }

    if (req.file) {
      const publicUrl = await uploadService.uploadFile(
        "Images",
        `${req.user.id}/avatar.webp`,
        req.file.buffer,
        "image/webp",
      );
      data.avatarUrl = publicUrl;
    }

    const profile = await profileService.update(req.user.id, data);
    res.json({ data: profile });
  } catch (err) {
    next(err);
  }
});

router.get("/completion", async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No autenticado" } });
      return;
    }
    const result = await profileCompletionService.getCompletion(req.user.id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.get("/social", async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No autenticado" } });
      return;
    }
    const links = await socialLinkService.getAll(req.user.id);
    res.json({ data: links });
  } catch (err) {
    next(err);
  }
});

router.post("/social", validate(createSocialLinkSchema), async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "No autenticado" } });
      return;
    }
    const link = await socialLinkService.create({
      ...req.body,
      profileId: req.user.id,
    });
    res.status(201).json({ data: link });
  } catch (err) {
    next(err);
  }
});

router.patch("/social/:id", validate(updateSocialLinkSchema), async (req, res, next) => {
  try {
    const link = await socialLinkService.update(p(req.params.id), req.body);
    res.json({ data: link });
  } catch (err) {
    next(err);
  }
});

router.delete("/social/:id", async (req, res, next) => {
  try {
    await socialLinkService.remove(p(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
