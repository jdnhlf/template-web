import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">template-web</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Next.js and Supabase starter with email and password auth, row level
          security and CI deploys.
        </p>
      </div>

      {user ? (
        <p className="text-sm">
          Signed in as <span className="font-medium">{user.email}</span>.{" "}
          <Link className="underline" href="/dashboard">
            Go to the dashboard
          </Link>
        </p>
      ) : (
        <p className="text-sm">
          Not signed in.{" "}
          <Link className="underline" href="/login">
            Sign in
          </Link>
        </p>
      )}
    </main>
  );
}
