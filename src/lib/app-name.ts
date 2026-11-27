const FALLBACK = "template-web";

function fromProductionUrl(value: string | undefined) {
  if (!value) return undefined;
  const host = value.replace(/^https?:\/\//, "").split("/")[0];
  const bare = host.replace(/\.vercel\.app$/, "");
  const stripped = bare.startsWith("jdnhlf-") ? bare.slice("jdnhlf-".length) : bare;
  return stripped || undefined;
}

export function appName() {
  const explicit = process.env.NEXT_PUBLIC_APP_NAME?.trim();
  if (explicit) return explicit;
  return fromProductionUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ?? FALLBACK;
}
