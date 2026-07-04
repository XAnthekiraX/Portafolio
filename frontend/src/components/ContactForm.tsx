import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useContact } from "../hooks/useContact";

export function ContactForm() {
  const { submit, sending, sent, error } = useContact();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="w-full rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-dark-100 placeholder-dark-700 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-dark-100 placeholder-dark-700 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
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
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Proyecto de rediseño"
          className="w-full rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-dark-100 placeholder-dark-700 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
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
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Cuéntame sobre tu proyecto..."
          className="w-full resize-none rounded-lg border border-dark-700 bg-dark-950 px-4 py-3 text-dark-100 placeholder-dark-700 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
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
