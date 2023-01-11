import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

// Make sure the font exists in the specified path:
const font = fetch(
  new URL("../../public/fonts/IBMPlexSerif-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const fontData = await font;

  try {
    const { searchParams } = new URL(req.url);

    // ?title=<title>
    const hasText = searchParams.has("text");
    const text = hasText
      ? searchParams.get("text")?.slice(0, 100).split("/n")
      : ["My default title"];

    console.log(`text: ${text}`);

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "100%",
            height: "100%",
            fontFamily: "Plex",
          }}
        >
          <div
            style={{
              padding: "2rem",
              backgroundColor: "hsl(0 0% 4%)",
              backgroundSize: "150px 150px",
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexDirection: "column",
              flexWrap: "nowrap",
              color: "hsl(0 0% 62.8%)",
            }}
          >
            <h2
              style={{
                fontSize: 24,
              }}
            >
              Igor Bedesqui
            </h2>
            <h1
              style={{
                maxWidth: "66%",
                color: "hsl(0 0% 93.0%)",
                fontSize: 56,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {text?.map((t, i) => (
                <div key={i}>{t}</div>
              ))}
            </h1>
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              zIndex: "40",
              position: "absolute",
              inset: "0",
              opacity: "0.03",
              background:
                "url(https://www.igorbedesqui.com/images/framernoise.png)",
            }}
          ></div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Plex",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
