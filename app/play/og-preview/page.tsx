"use client";

import Container from "@/components/Container";
import Band from "@/components/Band";
import { Suspense, useState, useDeferredValue, use } from "react";

const imageCache = new Map<string, Promise<string>>();

function loadImage(src: string): Promise<string> {
  if (typeof window === "undefined") {
    return Promise.resolve(src);
  }
  if (!imageCache.has(src)) {
    imageCache.set(
      src,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = reject;
      })
    );
  }
  return imageCache.get(src)!;
}

function OgImage({ src }: { src: string }) {
  use(loadImage(src));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="OG image preview"
      className="aspect-[1200/630] w-full object-cover"
    />
  );
}

export default function Page() {
  const [text, setText] = useState("hello, *world*");
  const deferredText = useDeferredValue(text);
  const isStale = text !== deferredText;

  const ogUrl = `/api/og?text=${encodeURIComponent(deferredText)}`;
  const displayUrl = `/api/og?text=${encodeURIComponent(text)}`;
  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${displayUrl}`
      : displayUrl;

  return (
    <Container>
      <div className="flex flex-col gap-16">
        <Band headline={{ bold: "OG", thin: "Preview" }}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="og-text" className="text-sm text-gray-11">
                text parameter (use /n for newlines, *text* for bold)
              </label>
              <input
                id="og-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="hello, *world*/nthis is a new line"
                className="w-full rounded border border-gray-A04 bg-gray-A02 px-3 py-2 text-gray-12 placeholder:text-gray-08 focus:border-gray-A08 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-11">generated url</span>
              <code className="block overflow-x-auto rounded border border-gray-A04 bg-gray-A02 px-3 py-2 text-sm text-gray-11">
                {fullUrl}
              </code>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm text-gray-11">preview (1200×630)</span>
              <div
                className="overflow-hidden rounded border border-gray-A04 transition-opacity duration-200"
                style={{ opacity: isStale ? 0.7 : 1 }}
              >
                <Suspense
                  fallback={
                    <div className="aspect-[1200/630] w-full animate-pulse bg-gray-A04" />
                  }
                >
                  <OgImage src={ogUrl} />
                </Suspense>
              </div>
            </div>
          </div>
        </Band>
      </div>
    </Container>
  );
}
