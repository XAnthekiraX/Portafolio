import { Router } from "express";
import { supabase } from "../../config/supabase.js";
import { db } from "../../db/index.js";
import { profiles } from "../../db/schema/profiles.js";
import { eq } from "drizzle-orm";
import { validate } from "../../middleware/validate.js";
import { loginSchema } from "../../validators/auth.validator.js";

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

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

    if (!profile) {
      await db.insert(profiles).values({
        id: userId,
        firstName: data.user.user_metadata?.first_name ?? data.user.email?.split("@")[0] ?? "",
        lastName: data.user.user_metadata?.last_name ?? "",
        title: "Desarrollador",
        email: data.user.email ?? email,
      }).onConflictDoNothing();
    }

    const firstName = profile?.firstName ?? data.user.user_metadata?.first_name ?? data.user.email?.split("@")[0] ?? "";
    const lastName = profile?.lastName ?? data.user.user_metadata?.last_name ?? "";

    res.cookie("sb-access-token", data.session.access_token, COOKIE_OPTIONS);

    res.json({
      data: {
        admin: {
          id: userId,
          firstName,
          lastName,
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
    const token = req.cookies?.["sb-access-token"];

    if (token) {
      await supabase.auth.admin.signOut(token);
    }

    res.clearCookie("sb-access-token", { path: "/" });
    res.json({ data: { status: "logged_out" } });
  } catch (err) {
    next(err);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const token = req.cookies?.["sb-access-token"];
    if (!token) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Token requerido" } });
      return;
    }

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

    if (!profile) {
      await db.insert(profiles).values({
        id: userId,
        firstName: data.user.user_metadata?.first_name ?? data.user.email?.split("@")[0] ?? "",
        lastName: data.user.user_metadata?.last_name ?? "",
        title: "Desarrollador",
        email: data.user.email ?? "",
      }).onConflictDoNothing();
    }

    res.json({
      data: {
        id: userId,
        firstName: profile?.firstName ?? data.user.user_metadata?.first_name ?? data.user.email?.split("@")[0] ?? "",
        lastName: profile?.lastName ?? data.user.user_metadata?.last_name ?? "",
        email: data.user.email ?? "",
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
