import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>&subtitle=<subtitle>
    const title = searchParams.get("title") || "Aeronix Holidays";
    const subtitle = searchParams.get("subtitle") || "Experience Ultra-Luxury Travel";

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
            backgroundColor: "#0A0B10",
            backgroundImage: "radial-gradient(circle at 25% 25%, #6B1F2A 0%, transparent 50%), radial-gradient(circle at 75% 75%, #1A1B23 0%, transparent 50%)",
            padding: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(197, 165, 114, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "40px",
              padding: "60px 80px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 24,
                color: "#C5A572",
                fontWeight: "bold",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                marginBottom: "30px",
              }}
            >
              Aeronix Holidays
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.1,
                marginBottom: "20px",
                maxWidth: "800px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 28,
                color: "rgba(255, 255, 255, 0.6)",
                maxWidth: "600px",
              }}
            >
              {subtitle}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              fontSize: 16,
              color: "rgba(255, 255, 255, 0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Curated by Odin AI · aeronixholidays.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
