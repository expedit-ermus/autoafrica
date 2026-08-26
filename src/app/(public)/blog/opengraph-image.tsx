import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Blog & Guides Pièces Auto Abidjan — AutoAfrique";
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
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              backgroundColor: "#FF6B35",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(255, 107, 53, 0.4)",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: "white",
              }}
            >
              AA
            </span>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            Auto<span style={{ color: "#FF6B35" }}>Afrique</span>
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#FF8F5E",
              backgroundColor: "rgba(255, 107, 53, 0.15)",
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 107, 53, 0.3)",
            }}
          >
            LE BLOG
          </span>
        </div>

        <div
          style={{
            fontSize: "56px",
            fontWeight: "900",
            color: "white",
            textAlign: "center",
            lineHeight: "1.15",
            marginBottom: "20px",
            maxWidth: "960px",
          }}
        >
          Guides & Conseils Pièces Auto à Abidjan
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
          }}
        >
          Entretien, Occasion Contrôlée, Casse Auto, Logistique & Mobile Money
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            marginTop: "40px",
          }}
        >
          {["📖 Guides d'achat", "🔧 Entretien Véhicules", "📱 Paiement Séquestre", "🚚 Livraison 24h"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderRadius: "30px",
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                border: "1px solid rgba(255, 255, 255, 0.15)",
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
