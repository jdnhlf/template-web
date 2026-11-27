"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function LoginForm({
  next,
  initialMessage,
}: {
  next: string;
  initialMessage: string | null;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(initialMessage);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const supabase = createClient();
    const { data, error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          });

    if (error) {
      setMessage(error.message);
      setPending(false);
      return;
    }

    if (!data.session) {
      setMessage("Check your email to confirm your account.");
      setPending(false);
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="block space-y-1 text-sm">
        <span className="font-medium">Email</span>
        <input
          className="w-full rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Password</span>
        <input
          className="w-full rounded border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          type="password"
          name="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          minLength={6}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {message ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {message}
        </p>
      ) : null}

      <button
        className="w-full rounded bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        {pending
          ? "Working..."
          : mode === "signin"
            ? "Sign in"
            : "Create account"}
      </button>

      <button
        className="w-full text-sm text-zinc-600 underline dark:text-zinc-400"
        type="button"
        disabled={pending}
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setMessage(null);
        }}
      >
        {mode === "signin"
          ? "No account? Sign up"
          : "Already have an account? Sign in"}
      </button>
    </form>
  );
}
