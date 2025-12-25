import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

const font = fetch(
  new URL("../../../public/fonts/IBMPlexSerif-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());
const fontBold = fetch(
  new URL("../../../public/fonts/IBMPlexSerif-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(request: Request) {
  const fontData = await font;
  const fontDataBold = await fontBold;

  try {
    const { searchParams } = new URL(request.url);

    const hasText = searchParams.has("text");
    const text = hasText
      ? searchParams.get("text")?.slice(0, 125).split("/n")
      : ["My default title"];

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
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
                color: "hsl(0 0% 62.8%)",
                fontSize: 56,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {text?.map((line, i) => {
                const styledText = line.split("*").map((text, i) => {
                  if (text == "") return null;
                  return (
                    <span
                      key={i}
                      style={{
                        fontFamily: i % 2 === 1 ? "Bold" : "inherit",
                        fontWeight: i % 2 === 1 ? 600 : 400,
                        color:
                          i % 2 === 1 ? "hsl(0 0% 93.0%)" : "hsl(0 0% 62.8%)",
                        flexShrink: 0,
                        display: "flex",
                        marginLeft:
                          text.startsWith(".") ||
                          text.startsWith(",") ||
                          text.startsWith(";")
                            ? "-1rem"
                            : "0",
                      }}
                    >
                      {text}
                    </span>
                  );
                });

                return (
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                    }}
                    key={i}
                  >
                    {styledText}
                  </div>
                );
              })}
            </h1>
          </div>
          <div
            style={{
              width: "100%",
              height: "100%",
              zIndex: 40,
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
            weight: 400,
          },
          {
            name: "Bold",
            data: fontDataBold,
            style: "normal",
            weight: 600,
          },
        ],
      }
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : String(e)}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
