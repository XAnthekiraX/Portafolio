export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function mapKeys<T>(obj: T, mapper: (key: string) => string): Record<string, unknown> {
  if (obj === null || obj === undefined) return obj as unknown as Record<string, unknown>;
  if (Array.isArray(obj)) return obj.map((item) => mapKeys(item, mapper)) as unknown as Record<string, unknown>;
  if (typeof obj !== "object") return obj as unknown as Record<string, unknown>;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const newKey = mapper(key);
    if (Array.isArray(value)) {
      result[newKey] = value.map((item) =>
        typeof item === "object" && item !== null ? mapKeys(item, mapper) : item,
      );
    } else if (typeof value === "object" && value !== null) {
      result[newKey] = mapKeys(value, mapper);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

export function toCamelCaseKeys<T>(obj: T): Record<string, unknown> {
  return mapKeys(obj, toCamelCase);
}
