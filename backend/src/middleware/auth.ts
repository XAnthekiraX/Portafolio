import type { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import type { AuthenticatedUser } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.["sb-access-token"];

  if (!token) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token requerido" },
    });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token inválido o expirado" },
    });
    return;
  }

  req.user = {
    id: data.user.id,
    email: data.user.email ?? "",
  };

  next();
}
