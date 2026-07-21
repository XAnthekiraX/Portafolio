import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/error-handler.js";

import publicProfileRouter from "./routes/public/profile.js";
import publicSkillsRouter from "./routes/public/skills.js";
import publicTechnologiesRouter from "./routes/public/technologies.js";
import publicProjectsRouter from "./routes/public/projects.js";
import publicEducationRouter from "./routes/public/education.js";
import publicServicesRouter from "./routes/public/services.js";
import publicCvRouter from "./routes/public/cv.js";
import publicContactRouter from "./routes/public/contact.js";

import adminAuthRouter from "./routes/admin/auth.js";
import adminProfileRouter from "./routes/admin/profile.js";
import adminSkillsRouter from "./routes/admin/skills.js";
import adminCvRouter from "./routes/admin/cv.js";
import adminEducationRouter from "./routes/admin/education.js";
import adminTechnologiesRouter from "./routes/admin/technologies.js";
import adminProjectsRouter from "./routes/admin/projects.js";
import adminServicesRouter from "./routes/admin/services.js";
import adminContactRouter from "./routes/admin/contact.js";
import adminDashboardRouter from "./routes/admin/dashboard.js";
import adminNotificationsRouter from "./routes/admin/notifications.js";

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
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
app.use("/api/admin/dashboard", authMiddleware, adminDashboardRouter);
app.use("/api/admin/notifications", authMiddleware, adminNotificationsRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
});

export default app;
