import type { Request, Response, NextFunction } from "express";

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 3;

export function rateLimitContact(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? req.socket?.remoteAddress ?? "unknown";
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (entry.count >= MAX_REQUESTS) {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later.",
      },
    });
    return;
  }

  entry.count++;
  next();
}
