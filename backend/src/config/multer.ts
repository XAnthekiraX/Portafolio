import multer from "multer";

const ALLOWED_MIMES: Record<string, string[]> = {
  avatar: ["image/webp"],
  cv: ["application/pdf"],
  image: ["image/webp"],
};

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.avatar.includes(file.mimetype)) {
      cb(new Error("UNSUPPORTED_FORMAT"));
      return;
    }
    cb(null, true);
  },
});

export const uploadCv = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.cv.includes(file.mimetype)) {
      cb(new Error("UNSUPPORTED_FORMAT"));
      return;
    }
    cb(null, true);
  },
});

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIMES.image.includes(file.mimetype)) {
      cb(new Error("UNSUPPORTED_FORMAT"));
      return;
    }
    cb(null, true);
  },
});
