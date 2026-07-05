import { Router } from "express";
import { projectService } from "../../services/project.service";
import { uploadService } from "../../services/upload.service";
import { uploadImage } from "../../config/multer";
import { validate } from "../../middleware/validate";
import { createProjectSchema, updateProjectSchema } from "../../validators/project.validator";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const projects = await projectService.getAll();
    res.json({ data: projects });
  } catch (err) {
    next(err);
  }
});

router.post("/", uploadImage.single("image"), async (req, res, next) => {
  try {
    const { technologyIds, ...data } = req.body;

    if (req.file) {
      data.imageUrl = "";
    }

    const project = await projectService.create(data);

    if (req.file) {
      const publicUrl = await uploadService.uploadFile(
        "Images",
        `${project.id}/image.webp`,
        req.file.buffer,
        "image/webp",
      );
      await projectService.update(project.id, { imageUrl: publicUrl });
    }

    if (technologyIds) {
      const ids = Array.isArray(technologyIds) ? technologyIds : [technologyIds];
      await projectService.replaceTechnologies(project.id, ids);
    }

    const result = await projectService.getById(project.id);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", uploadImage.single("image"), async (req, res, next) => {
  try {
    const { technologyIds, ...data } = req.body;

    if (req.file) {
      const publicUrl = await uploadService.uploadFile(
        "Images",
        `${p(req.params.id)}/image.webp`,
        req.file.buffer,
        "image/webp",
      );
      data.imageUrl = publicUrl;
    }

    const project = await projectService.update(p(req.params.id), data);

    if (technologyIds) {
      const ids = Array.isArray(technologyIds) ? technologyIds : [technologyIds];
      await projectService.replaceTechnologies(p(req.params.id), ids);
    }

    const result = await projectService.getById(project.id);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await projectService.remove(p(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
