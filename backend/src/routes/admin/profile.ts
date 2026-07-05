import { Router } from "express";
import { profileService } from "../../services/profile.service";
import { socialLinkService } from "../../services/social-link.service";
import { profileCompletionService } from "../../services/profile-completion.service";
import { uploadService } from "../../services/upload.service";
import { uploadAvatar } from "../../config/multer";
import { validate } from "../../middleware/validate";
import { updateProfileSchema } from "../../validators/profile.validator";
import { createSocialLinkSchema, updateSocialLinkSchema } from "../../validators/social.validator";
import type { ZodError } from "zod";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}

function parseProfileBody(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  const fields = ["firstName", "lastName", "title", "description", "location", "email"] as const;
  for (const field of fields) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  if (body.experienceYears !== undefined) {
    data.experienceYears = parseInt(body.experienceYears as string, 10);
  }
  if (body.isAvailable !== undefined) {
    data.isAvailable = body.isAvailable === "true" || body.isAvailable === true;
  }
  return data;
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

    const parsed = parseProfileBody(req.body);

    const result = updateProfileSchema.safeParse(parsed);
    if (!result.success) {
      const zodErr = result.error as ZodError;
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Datos de perfil inválidos",
          details: zodErr.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
        },
      });
      return;
    }

    const data = result.data as Record<string, unknown>;

    if (req.file) {
      const publicUrl = await uploadService.uploadFile(
        "Images",
        `${req.user.id}/avatar.webp`,
        req.file.buffer,
        "image/webp",
      );
      data.avatarUrl = publicUrl;
    }

    await profileService.update(req.user.id, data);
    const profile = await profileService.getAdmin();
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
    res.json({ data: { status: "deleted" } });
  } catch (err) {
    next(err);
  }
});

export default router;
