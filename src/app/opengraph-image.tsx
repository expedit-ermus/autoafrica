import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "AutoAfrique - Marketplace Pièces Détachées Auto";
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
          background: "linear-gradient(135deg, #FF6B35 0%, #FF8F5E 50%, #FFB088 100%)",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <span
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#FF6B35",
              }}
            >
              AA
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
            lineHeight: "1.1",
            marginBottom: "20px",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          AutoAfrique
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "rgba(255, 255, 255, 0.95)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
          }}
        >
          Pièces Détachées Auto & Marketplace
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "rgba(255, 255, 255, 0.8)",
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          Afrique de l&apos;Ouest
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          {["Mobile Money", "ERP", "Marketplace"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                borderRadius: "30px",
                color: "white",
                fontSize: "18px",
                fontWeight: "500",
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
