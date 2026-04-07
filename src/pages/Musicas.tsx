import { useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import iconMusicas from "@/assets/icon-musicas.png";

export default function Musicas() {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageHeader title="Músicas" subtitle="Louvores para adorar" icon={iconMusicas} />

      <div className="flex-1 flex items-start justify-center p-4">
        <div className="w-full max-w-lg">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/p/DW1J99Tjh-Q/"
            data-instgrm-version="14"
            style={{
              background: "#FFF",
              border: 0,
              borderRadius: "12px",
              margin: "0 auto",
              maxWidth: "540px",
              width: "100%",
              padding: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
