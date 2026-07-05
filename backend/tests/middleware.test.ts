import { describe, it, expect, vi } from "vitest";
import { validate } from "../src/middleware/validate";
import { rateLimitContact } from "../src/middleware/rate-limit";
import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

function mockReqRes(body?: unknown) {
  const req = { body, ip: "127.0.0.1", socket: { remoteAddress: "127.0.0.1" } } as unknown as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as NextFunction;
  return { req, res, next };
}

describe("validate middleware", () => {
  const schema = z.object({
    name: z.string().min(1),
  });

  it("llama next si los datos son válidos", () => {
    const { req, res, next } = mockReqRes({ name: "Juan" });
    validate(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("devuelve 400 si los datos son inválidos", () => {
    const { req, res, next } = mockReqRes({ name: "" });
    validate(schema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ code: "VALIDATION_ERROR" }),
      })
    );
  });
});

describe("rateLimitContact middleware", () => {
  it("permite la primera solicitud", () => {
    const { req, res, next } = mockReqRes();
    rateLimitContact(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
