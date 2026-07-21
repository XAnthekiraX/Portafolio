import { Router } from "express";
import { notificationService } from "../../services/notification.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const notifications = await notificationService.getUnread();
    res.json({ data: notifications });
  } catch (err) {
    next(err);
  }
});

export default router;
