"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Anmeldung fehlgeschlagen.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-brand-white rounded-2xl p-8 shadow-sm border border-brand-cream-deep"
      >
        <h1 className="font-heading text-2xl text-brand-text mb-1">
          Beauty Palast
        </h1>
        <p className="text-sm text-brand-text-light mb-6">
          Admin-Zugang
        </p>

        <label className="block text-xs uppercase tracking-wide text-brand-text-mid mb-2">
          Passwort
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          className="w-full rounded-full border border-brand-cream-deep px-4 py-2.5 text-sm text-brand-text outline-none focus:border-brand-sand mb-4"
        />

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-brand-dark text-brand-white py-2.5 text-sm tracking-wide hover:bg-brand-brown transition-colors disabled:opacity-50"
        >
          {loading ? "Anmelden…" : "Anmelden"}
        </button>
      </form>
    </main>
  );
}
