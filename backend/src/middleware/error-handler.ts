import type { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err.message === "UNSUPPORTED_FORMAT") {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Formato de archivo no soportado. Solo se acepta webp (imágenes) o PDF.",
      },
    });
    return;
  }

  if (err instanceof MulterError) {
    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE: "El archivo excede el tamaño máximo permitido (5MB).",
      LIMIT_UNEXPECTED_FILE: "Campo de archivo inesperado.",
    };

    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: messages[err.code] || "Error al procesar el archivo.",
      },
    });
    return;
  }

  console.error("[Error]", err);

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Error interno del servidor",
    },
  });
}
