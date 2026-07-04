import { useState } from "react";
import { sendContact } from "../services/api";
import type { ContactMessage } from "../types";

export function useContact() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(message: ContactMessage) {
    setSending(true);
    setError(null);
    try {
      await sendContact(message);
      setSent(true);
    } catch {
      setError("Error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  return { submit, sending, sent, error };
}
