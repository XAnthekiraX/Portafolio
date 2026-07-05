import multer from "multer";
import path from "path";

function checkMime(mimetype: string, allowed: string[]): boolean {
  return allowed.some((m) => mimetype.toLowerCase() === m);
}

function checkExt(filename: string, exts: string[]): boolean {
  return exts.includes(path.extname(filename).toLowerCase());
}

function webpFilter(_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (checkMime(file.mimetype, ["image/webp"]) || checkExt(file.originalname, [".webp"])) {
    cb(null, true);
  } else {
    cb(new Error("UNSUPPORTED_FORMAT"));
  }
}

function pdfFilter(_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (checkMime(file.mimetype, ["application/pdf"]) || checkExt(file.originalname, [".pdf"])) {
    cb(null, true);
  } else {
    cb(new Error("UNSUPPORTED_FORMAT"));
  }
}

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: webpFilter,
});

export const uploadCv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: pdfFilter,
});

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: webpFilter,
});
