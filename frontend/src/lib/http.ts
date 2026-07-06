import ky, { HTTPError } from "ky";

export const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
  throw new Error("VITE_API_URL environment variable is required");
}

function getToken(): string | null {
  return localStorage.getItem("folio-cms-token");
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const api = ky.create({
  prefix: BASE_URL,
  hooks: {
    beforeRequest: [
      (state) => {
        const token = getToken();
        if (token) {
          state.request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  try {
    const isFormData = options.body instanceof FormData;
    const method = (options.method ?? "GET").toUpperCase();

    const response = await api(path, {
      method,
      signal: options.signal,
      ...(isFormData
        ? { body: options.body as FormData }
        : method !== "GET" && options.body !== undefined
          ? { json: options.body }
          : {}),
    });

    if (response.status === 204) {
      return undefined as T;
    }

    const json: { data: T } = await response.json();
    return json.data;
  } catch (error: unknown) {
    if (error instanceof HTTPError) {
      try {
        const json: { error?: { code: string; message: string } } =
          await error.response.json();
        throw new ApiError(
          error.response.status,
          json?.error?.code || "UNKNOWN_ERROR",
          json?.error?.message || "Error de conexión con el servidor",
        );
      } catch (parseError: unknown) {
        if (parseError instanceof ApiError) throw parseError;
        throw new ApiError(
          error.response.status,
          "UNKNOWN_ERROR",
          "Error de conexión con el servidor",
        );
      }
    }
    throw error;
  }
}

export const http = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "POST", body, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "PUT", body, signal }),
  putForm: <T>(path: string, body: FormData, signal?: AbortSignal) =>
    request<T>(path, { method: "PUT", body, signal }),
  postForm: <T>(path: string, body: FormData, signal?: AbortSignal) =>
    request<T>(path, { method: "POST", body, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: "PATCH", body, signal }),
  patchForm: <T>(path: string, body: FormData, signal?: AbortSignal) =>
    request<T>(path, { method: "PATCH", body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) => request<T>(path, { method: "DELETE", signal }),
};
