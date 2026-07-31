import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Insurance Tools: Free Coverage & Claim Calculators",
    short_name: "Insurance Tools",
    description:
      "Free, instant insurance calculators for auto, home, life, health, and business coverage. No sign-up required.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
