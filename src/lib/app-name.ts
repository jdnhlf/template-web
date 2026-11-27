const FALLBACK = "template-web";

export function appName() {
  const explicit = process.env.NEXT_PUBLIC_APP_NAME?.trim();
  if (explicit) return explicit;

  const project = process.env.VERCEL_PROJECT_NAME?.trim();
  if (project) {
    return project.startsWith("jdnhlf-")
      ? project.slice("jdnhlf-".length)
      : project;
  }

  return FALLBACK;
}
