import { describe, expect, it, vi } from "vitest";

vi.stubEnv("NEXT_PUBLIC_APP_NAME", "family-tree");

describe("manifest", () => {
  it("describes an installable app with both icon sizes", async () => {
    const { default: manifest } = await import("./manifest");

    expect(manifest()).toMatchObject({
      name: "family-tree",
      short_name: "family-tree",
      start_url: "/",
      display: "standalone",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    });
  });
});
