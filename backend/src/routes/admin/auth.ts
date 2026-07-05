import { Router } from "express";
import { supabase } from "../../config/supabase";
import { db } from "../../db";
import { profiles } from "../../db/schema";
import { eq } from "drizzle-orm";
import { validate } from "../../middleware/validate";
import { loginSchema } from "../../validators/auth.validator";

const router = Router();

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Email o contraseña incorrectos" },
      });
      return;
    }

    const userId = data.user.id;
    const [profile] = await db
      .select({ firstName: profiles.firstName, lastName: profiles.lastName })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    res.json({
      data: {
        token: data.session.access_token,
        expiresAt: new Date(data.session.expires_at! * 1000).toISOString(),
        admin: {
          id: userId,
          firstName: profile?.firstName ?? "",
          lastName: profile?.lastName ?? "",
          email: data.user.email ?? email,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

    if (token) {
      await supabase.auth.admin.signOut(token);
    }

    res.json({ data: { status: "logged_out" } });
  } catch (err) {
    next(err);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Token requerido" } });
      return;
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Token inválido" } });
      return;
    }

    const userId = data.user.id;
    const [profile] = await db
      .select({ firstName: profiles.firstName, lastName: profiles.lastName })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    res.json({
      data: {
        id: userId,
        firstName: profile?.firstName ?? "",
        lastName: profile?.lastName ?? "",
        email: data.user.email ?? "",
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
