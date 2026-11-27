import { LoginForm } from "./login-form";

export default async function Login({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const nextParam = params.next;
  const next =
    typeof nextParam === "string" &&
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Sign in with the email and password of an account created in the
          Supabase dashboard. Self-service sign up is disabled.
        </p>
      </div>
      <LoginForm
        next={next}
        initialMessage={
          params.error === "confirmation"
            ? "That confirmation link could not be used. Try signing in again."
            : null
        }
      />
    </main>
  );
}
