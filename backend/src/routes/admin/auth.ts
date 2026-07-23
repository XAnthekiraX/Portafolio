import { Router } from "express";
import { supabaseAdmin } from "../../config/supabase.js";
import { validate } from "../../middleware/validate.js";
import { loginSchema } from "../../validators/auth.validator.js";

const router = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Email o contraseña incorrectos" },
      });
      return;
    }

    const userId = data.user.id;
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", userId)
      .limit(1)
      .single();

    if (!profile) {
      await supabaseAdmin.from("profiles").insert({
        id: userId,
        first_name: data.user.user_metadata?.first_name ?? data.user.email?.split("@")[0] ?? "",
        last_name: data.user.user_metadata?.last_name ?? "",
        title: "Desarrollador",
        email: data.user.email ?? email,
      }).select().maybeSingle();
    }

    const firstName = profile?.first_name ?? data.user.user_metadata?.first_name ?? data.user.email?.split("@")[0] ?? "";
    const lastName = profile?.last_name ?? data.user.user_metadata?.last_name ?? "";

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
      await supabaseAdmin.auth.admin.signOut(token);
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

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Token inválido" } });
      return;
    }

    const userId = data.user.id;
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", userId)
      .limit(1)
      .single();

    if (!profile) {
      await supabaseAdmin.from("profiles").insert({
        id: userId,
        first_name: data.user.user_metadata?.first_name ?? data.user.email?.split("@")[0] ?? "",
        last_name: data.user.user_metadata?.last_name ?? "",
        title: "Desarrollador",
        email: data.user.email ?? "",
      }).select().maybeSingle();
    }

    res.json({
      data: {
        id: userId,
        firstName: profile?.first_name ?? data.user.user_metadata?.first_name ?? data.user.email?.split("@")[0] ?? "",
        lastName: profile?.last_name ?? data.user.user_metadata?.last_name ?? "",
        email: data.user.email ?? "",
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
