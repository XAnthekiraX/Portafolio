import { Router } from "express";
import { projectService } from "../../services/project.service";
import { uploadService } from "../../services/upload.service";
import { uploadImage } from "../../config/multer";
import { validate } from "../../middleware/validate";
import { createProjectSchema, updateProjectSchema } from "../../validators/project.validator";
import { technologyService } from "../../services/technology.service";

function p(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}

function parseJsonArray(val: unknown): string[] | undefined {
  if (!val) return undefined;
  if (Array.isArray(val)) return val;
  try {
    const parsed = JSON.parse(val as string);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveTechnologyIds(techs: string[]): Promise<string[]> {
  const allNames = techs.filter((t) => !UUID_RE.test(t));
  if (allNames.length === 0) return techs;
  const allTechs = await technologyService.getAll();
  const nameMap = new Map(allTechs.map((t) => [t.name.toLowerCase(), t.id]));
  const resolved: string[] = [];
  const toCreate = techs.filter((t) => !UUID_RE.test(t) && !nameMap.has(t.toLowerCase()));
  const created = await Promise.all(
    toCreate.map((t) => technologyService.create({ name: t }))
  );
  for (const c of created) {
    nameMap.set(c.name.toLowerCase(), c.id);
  }
  for (const t of techs) {
    if (UUID_RE.test(t)) {
      resolved.push(t);
    } else {
      resolved.push(nameMap.get(t.toLowerCase())!);
    }
  }
  return resolved;
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
    const technologies = parseJsonArray(req.body.technologies);
    const features = parseJsonArray(req.body.features);

    const parsed: Record<string, unknown> = {
      title: req.body.title,
      description: req.body.description ?? null,
      category: req.body.category ?? null,
      url: req.body.url ?? null,
      repository: req.body.repository ?? null,
      repoUrl: req.body.repoUrl ?? null,
      demoUrl: req.body.demoUrl ?? null,
      status: req.body.status ?? "draft",
      displayOrder: req.body.displayOrder ? parseInt(req.body.displayOrder as string, 10) : 0,
      features: features ?? [],
    };

    const result = createProjectSchema.safeParse(parsed);
    if (!result.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Datos de proyecto inválidos",
          details: result.error.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
        },
      });
      return;
    }

    const data = result.data;

    if (req.file) {
      (data as any).imageUrl = "";
    }

    const project = await projectService.create(data as any);

    if (req.file) {
      const publicUrl = await uploadService.uploadFile(
        "Images",
        `${project.id}/image.webp`,
        req.file.buffer,
        "image/webp",
      );
      await projectService.update(project.id, { imageUrl: publicUrl });
    }

    if (technologies?.length) {
      const techIds = await resolveTechnologyIds(technologies);
      await projectService.replaceTechnologies(project.id, techIds);
    }

    const resultProject = await projectService.getById(project.id);
    res.status(201).json({ data: resultProject });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", uploadImage.single("image"), async (req, res, next) => {
  try {
    const technologies = parseJsonArray(req.body.technologies);
    const features = parseJsonArray(req.body.features);

    const parsed: Record<string, unknown> = {};
    const optionalFields = ["title", "description", "category", "url", "repository", "repoUrl", "demoUrl", "status"] as const;
    for (const field of optionalFields) {
      if (req.body[field] !== undefined) parsed[field] = req.body[field];
    }
    if (req.body.displayOrder !== undefined) {
      parsed.displayOrder = parseInt(req.body.displayOrder as string, 10);
    }
    if (features !== undefined) {
      parsed.features = features;
    }

    if (Object.keys(parsed).length > 0) {
      const result = updateProjectSchema.safeParse(parsed);
      if (!result.success) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Datos de proyecto inválidos",
            details: result.error.errors.map((e) => ({ path: e.path.join("."), message: e.message })),
          },
        });
        return;
      }

      const data = result.data;

      if (req.file) {
        const publicUrl = await uploadService.uploadFile(
          "Images",
          `${p(req.params.id)}/image.webp`,
          req.file.buffer,
          "image/webp",
        );
        (data as any).imageUrl = publicUrl;
      }

      await projectService.update(p(req.params.id), data as any);
    }

    if (technologies) {
      const techIds = await resolveTechnologyIds(technologies);
      await projectService.replaceTechnologies(p(req.params.id), techIds);
    }

    const resultProject = await projectService.getById(p(req.params.id));
    res.json({ data: resultProject });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await projectService.remove(p(req.params.id));
    res.json({ data: { status: "deleted" } });
  } catch (err) {
    next(err);
  }
});

export default router;
