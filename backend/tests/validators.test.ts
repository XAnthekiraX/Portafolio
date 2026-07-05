import { describe, it, expect } from "vitest";
import { createContactMessageSchema } from "../src/validators/contact.validator";
import { createProjectSchema } from "../src/validators/project.validator";
import { loginSchema } from "../src/validators/auth.validator";

describe("createContactMessageSchema", () => {
  it("acepta datos válidos", () => {
    const result = createContactMessageSchema.safeParse({
      name: "Juan",
      email: "juan@example.com",
      subject: "Consulta",
      message: "Hola, me interesa tu trabajo",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = createContactMessageSchema.safeParse({
      name: "Juan",
      email: "no-email",
      subject: "Consulta",
      message: "Mensaje",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza campos vacíos", () => {
    const result = createContactMessageSchema.safeParse({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("rechaza mensaje muy largo", () => {
    const result = createContactMessageSchema.safeParse({
      name: "Juan",
      email: "juan@example.com",
      subject: "Consulta",
      message: "x".repeat(5001),
    });
    expect(result.success).toBe(false);
  });
});

describe("createProjectSchema", () => {
  it("acepta datos mínimos", () => {
    const result = createProjectSchema.safeParse({
      title: "Mi Proyecto",
    });
    expect(result.success).toBe(true);
  });

  it("acepta datos completos", () => {
    const result = createProjectSchema.safeParse({
      title: "Mi Proyecto",
      description: "Descripción",
      category: "web",
      status: "published",
      features: ["feature 1"],
      technologyIds: ["550e8400-e29b-41d4-a716-446655440000"],
    });
    expect(result.success).toBe(true);
  });

  it("rechaza status inválido", () => {
    const result = createProjectSchema.safeParse({
      title: "Proyecto",
      status: "invalid",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("acepta credenciales válidas", () => {
    const result = loginSchema.safeParse({
      email: "admin@example.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rechaza email inválido", () => {
    const result = loginSchema.safeParse({
      email: "no-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });
});
