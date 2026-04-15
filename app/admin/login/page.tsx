"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Wrong password");
        return;
      }
      router.push("/admin/proposals");
      router.refresh();
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-obsidian">
      <div className="w-full max-w-sm bg-carbon border border-wire rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold text-cloud mb-2">Admin</h1>
        <p className="text-sm text-slate mb-6">
          Saul&apos;s inbox. Enter the admin password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-lg bg-graphite border border-wire text-cloud placeholder:text-dim focus:outline-none focus:ring-2 focus:ring-cyan/40 focus:border-cyan/60"
          />
          {error && <p className="text-xs text-error">{error}</p>}
          <button
            type="submit"
            disabled={isPending || !password}
            className="px-4 py-3 rounded-lg bg-cyan text-obsidian font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan/90 transition-colors"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
