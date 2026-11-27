import { beforeEach, describe, expect, it, vi } from "vitest";

describe("appName", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("prefers NEXT_PUBLIC_APP_NAME", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_NAME", "family-tree");
    vi.stubEnv("VERCEL_PROJECT_NAME", "jdnhlf-other");

    const { appName } = await import("./app-name");

    expect(appName()).toBe("family-tree");
  });

  it("strips the project prefix from the Vercel project name", async () => {
    vi.stubEnv("VERCEL_PROJECT_NAME", "jdnhlf-family-tree");

    const { appName } = await import("./app-name");

    expect(appName()).toBe("family-tree");
  });

  it("falls back to the template name", async () => {
    const { appName } = await import("./app-name");

    expect(appName()).toBe("template-web");
  });
});
