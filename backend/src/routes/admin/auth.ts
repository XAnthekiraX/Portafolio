import { Router } from "express";
import { supabase } from "../../config/supabase";
import { validate } from "../../middleware/validate";
import { loginSchema } from "../../validators/auth.validator";

const router = Router();

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Email o contraseña incorrectos" },
      });
      return;
    }

    res.json({ data });
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

    res.json({ data: { message: "Sesión cerrada" } });
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

    res.json({ data: { id: data.user.id, email: data.user.email } });
  } catch (err) {
    next(err);
  }
});

export default router;
