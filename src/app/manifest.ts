import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PT Baruna Jaya Plastik | Precision Mold Maker",
    short_name: "BJP Mold",
    description:
      "Pabrik dan bengkel spesialis perancangan, pembuatan, dan servis cetakan plastik presisi (Plastic Injection & Blowing Mold Maker) Jakarta.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0D0D",
    theme_color: "#F97316",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
