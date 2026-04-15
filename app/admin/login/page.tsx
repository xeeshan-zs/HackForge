"use client";

import { signInAdmin } from "@/lib/auth";
import { canInitializeFirebase } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    params.get("error") === "unauthorized" ? "Unauthorized account." : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!canInitializeFirebase()) {
      setError("Firebase is not configured yet.");
      return;
    }
    setLoading(true);
    try {
      const user = await signInAdmin(email, password);
      if (!user.email) {
        setError("Login failed.");
        return;
      }
      const allowed = await isAdminEmail(user.email);
      if (!allowed) {
        setError("Unauthorized account.");
        return;
      }
      router.replace("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-container flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="card-surface w-full max-w-md rounded-lg p-6">
        <h1 className="font-display text-3xl">Admin Login</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Enter your admin credentials to access dashboard.
        </p>

        <label className="mt-5 block text-sm">
          <span className="mb-1 block text-[var(--color-muted)]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm">
          <span className="mb-1 block text-[var(--color-muted)]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
          />
        </label>

        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

        <button type="submit" className="primary-btn mt-5 w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <section className="section-container flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </section>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
