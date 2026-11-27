import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This page is protected by the proxy and re-checks the session on the
          server.
        </p>
      </div>

      <dl className="space-y-1 text-sm">
        <dt className="font-medium">Email</dt>
        <dd className="text-zinc-600 dark:text-zinc-400">{user.email}</dd>
      </dl>

      <div className="flex items-center gap-4 text-sm">
        <form action={signOut}>
          <button
            className="bg-foreground text-background rounded px-3 py-2 font-medium"
            type="submit"
          >
            Sign out
          </button>
        </form>
        <Link className="underline" href="/">
          Home
        </Link>
      </div>
    </main>
  );
}
