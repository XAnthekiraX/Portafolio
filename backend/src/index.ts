import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { authMiddleware } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";

import publicProfileRouter from "./routes/public/profile";
import publicSkillsRouter from "./routes/public/skills";
import publicTechnologiesRouter from "./routes/public/technologies";
import publicProjectsRouter from "./routes/public/projects";
import publicEducationRouter from "./routes/public/education";
import publicServicesRouter from "./routes/public/services";
import publicCvRouter from "./routes/public/cv";
import publicContactRouter from "./routes/public/contact";

import adminAuthRouter from "./routes/admin/auth";
import adminProfileRouter from "./routes/admin/profile";
import adminSkillsRouter from "./routes/admin/skills";
import adminCvRouter from "./routes/admin/cv";
import adminEducationRouter from "./routes/admin/education";
import adminTechnologiesRouter from "./routes/admin/technologies";
import adminProjectsRouter from "./routes/admin/projects";
import adminServicesRouter from "./routes/admin/services";
import adminContactRouter from "./routes/admin/contact";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ data: { status: "ok" } });
});

app.use("/api/profile", publicProfileRouter);
app.use("/api/skills", publicSkillsRouter);
app.use("/api/technologies", publicTechnologiesRouter);
app.use("/api/projects", publicProjectsRouter);
app.use("/api/education", publicEducationRouter);
app.use("/api/services", publicServicesRouter);
app.use("/api/cv", publicCvRouter);
app.use("/api/contact", publicContactRouter);

app.use("/api/admin/auth", adminAuthRouter);
app.use("/api/admin/profile", authMiddleware, adminProfileRouter);
app.use("/api/admin/skills", authMiddleware, adminSkillsRouter);
app.use("/api/admin/cv", authMiddleware, adminCvRouter);
app.use("/api/admin/education", authMiddleware, adminEducationRouter);
app.use("/api/admin/technologies", authMiddleware, adminTechnologiesRouter);
app.use("/api/admin/projects", authMiddleware, adminProjectsRouter);
app.use("/api/admin/services", authMiddleware, adminServicesRouter);
app.use("/api/admin/contact", authMiddleware, adminContactRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
});

export default app;
