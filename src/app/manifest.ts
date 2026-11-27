import type { MetadataRoute } from "next";
import { appName } from "@/lib/app-name";

export default function manifest(): MetadataRoute.Manifest {
  const name = appName();

  return {
    name,
    short_name: name,
    description: "Next.js and Supabase starter",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#18181b",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
