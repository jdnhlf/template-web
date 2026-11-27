"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm({
  next,
  initialMessage,
}: {
  next: string;
  initialMessage: string | null;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(initialMessage);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
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
          autoComplete="current-password"
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
        {pending ? "Working..." : "Sign in"}
      </button>
    </form>
  );
}
