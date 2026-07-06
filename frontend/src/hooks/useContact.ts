import { useMutation } from "@tanstack/react-query";
import { sendContact } from "../services/api";
import { ApiError } from "../lib/http";
import type { ContactMessage } from "../types";

export function useContact() {
  const { mutateAsync: submit, isPending: sending, isSuccess: sent, error } = useMutation({
    mutationFn: (message: ContactMessage) => sendContact(message),
  });

  const serverError = error instanceof ApiError
    ? error.message
    : error
      ? "Error al enviar el mensaje. Intenta de nuevo."
      : null;

  return { submit, sending, sent, error: serverError };
}
