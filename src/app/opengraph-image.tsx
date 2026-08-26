import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "AutoAfrique - Pièces Détachées Auto à Abidjan, Neuf & Occasion";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FF6B35 0%, #E85A20 50%, #C4450C 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "22px",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            <span
              style={{
                fontSize: "44px",
                fontWeight: "900",
                color: "#FF6B35",
              }}
            >
              AA
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: "68px",
            fontWeight: "900",
            color: "white",
            textAlign: "center",
            lineHeight: "1.1",
            marginBottom: "16px",
            textShadow: "0 4px 15px rgba(0, 0, 0, 0.25)",
            letterSpacing: "-1px",
          }}
        >
          AutoAfrique
        </div>

        <div
          style={{
            fontSize: "30px",
            fontWeight: "700",
            color: "rgba(255, 255, 255, 0.98)",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: "1.3",
          }}
        >
          Pièces Détachées Auto Neuves & Occasion Contrôlée
        </div>

        <div
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "rgba(255, 255, 255, 0.85)",
            textAlign: "center",
            marginTop: "12px",
          }}
        >
          Abidjan • Côte d&apos;Ivoire • Afrique de l&apos;Ouest
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "36px",
          }}
        >
          {["⚡ Livraison 24h Abidjan", "🛡️ Garantie 48h", "📱 Séquestre Mobile Money", "🔧 Occasion Contrôlée"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(255, 255, 255, 0.22)",
                borderRadius: "30px",
                color: "white",
                fontSize: "16px",
                fontWeight: "700",
                border: "1px solid rgba(255, 255, 255, 0.35)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
