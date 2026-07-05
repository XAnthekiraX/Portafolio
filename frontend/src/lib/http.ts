const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

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

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json();

  if (!res.ok) {
    const err = json?.error;
    throw new ApiError(
      res.status,
      err?.code || "UNKNOWN_ERROR",
      err?.message || "Error de conexión con el servidor",
    );
  }

  return json.data as T;
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  putForm: <T>(path: string, body: FormData) =>
    request<T>(path, { method: "PUT", body, headers: {} }),
  postForm: <T>(path: string, body: FormData) =>
    request<T>(path, { method: "POST", body, headers: {} }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  patchForm: <T>(path: string, body: FormData) =>
    request<T>(path, { method: "PATCH", body, headers: {} }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
