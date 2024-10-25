import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Monfuse",
    short_name: "Monfuse",
    description: "Your Ultimate Financial Management App",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#177981",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
