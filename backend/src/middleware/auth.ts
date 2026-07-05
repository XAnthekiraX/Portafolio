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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token requerido" },
    });
    return;
  }

  const token = authHeader.split(" ")[1];

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
