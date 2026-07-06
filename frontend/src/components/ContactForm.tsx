import { useState, useEffect, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useContact } from "../hooks/useContact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validate(name: string, email: string, subject: string, message: string): FieldErrors {
  const errors: FieldErrors = {};
  if (name.trim().length < 2 || name.length > 100) {
    errors.name = "El nombre debe tener entre 2 y 100 caracteres.";
  }
  if (!EMAIL_REGEX.test(email)) {
    errors.email = "Ingresá un correo electrónico válido.";
  }
  if (subject.trim().length < 3 || subject.length > 200) {
    errors.subject = "El asunto debe tener entre 3 y 200 caracteres.";
  }
  if (message.trim().length < 10 || message.length > 5000) {
    errors.message = "El mensaje debe tener entre 10 y 5000 caracteres.";
  }
  return errors;
}

export function ContactForm() {
  const { submit, sending, sent, error } = useContact();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (sent) {
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }
  }, [sent]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = validate(name, email, subject, message);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    submit({ name, email, subject, message });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dark-800 bg-dark-900 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <Send className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="mb-2 text-2xl font-bold">Mensaje enviado</h3>
        <p className="text-dark-400">
          Gracias por contactarme. Te responderé lo antes posible.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-dark-800 bg-dark-900 p-8"
    >
      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-mono text-sm font-medium text-dark-400"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => { setName(e.target.value); setFieldErrors((prev) => ({ ...prev, name: undefined })); }}
            placeholder="John Doe"
            className={`w-full rounded-lg border bg-dark-950 px-4 py-3 text-dark-100 placeholder-dark-700 transition-colors focus:outline-none focus:ring-1 ${fieldErrors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-dark-700 focus:border-accent focus:ring-accent"}`}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-mono text-sm font-medium text-dark-400"
          >
            Correo
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: undefined })); }}
            placeholder="john@example.com"
            className={`w-full rounded-lg border bg-dark-950 px-4 py-3 text-dark-100 placeholder-dark-700 transition-colors focus:outline-none focus:ring-1 ${fieldErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-dark-700 focus:border-accent focus:ring-accent"}`}
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
        </div>

        <div>
          <label
            htmlFor="subject"
            className="mb-2 block font-mono text-sm font-medium text-dark-400"
          >
            Asunto
          </label>
          <input
            type="text"
            id="subject"
            required
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setFieldErrors((prev) => ({ ...prev, subject: undefined })); }}
            placeholder="Proyecto de rediseño"
            className={`w-full rounded-lg border bg-dark-950 px-4 py-3 text-dark-100 placeholder-dark-700 transition-colors focus:outline-none focus:ring-1 ${fieldErrors.subject ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-dark-700 focus:border-accent focus:ring-accent"}`}
          />
          {fieldErrors.subject && <p className="mt-1 text-xs text-red-500">{fieldErrors.subject}</p>}
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block font-mono text-sm font-medium text-dark-400"
          >
            Mensaje
          </label>
          <textarea
            id="message"
            required
            rows={5}
            value={message}
            onChange={(e) => { setMessage(e.target.value); setFieldErrors((prev) => ({ ...prev, message: undefined })); }}
            placeholder="Cuéntame sobre tu proyecto..."
            className={`w-full resize-none rounded-lg border bg-dark-950 px-4 py-3 text-dark-100 placeholder-dark-700 transition-colors focus:outline-none focus:ring-1 ${fieldErrors.message ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-dark-700 focus:border-accent focus:ring-accent"}`}
          />
          {fieldErrors.message && <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>}
        </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 disabled:opacity-50"
      >
        {sending ? "Enviando..." : "Enviar Mensaje"}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
