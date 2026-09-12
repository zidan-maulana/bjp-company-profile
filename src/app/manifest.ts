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
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
