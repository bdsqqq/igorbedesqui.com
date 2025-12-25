"use client";

import Container from "@/components/Container";
import Band from "@/components/Band";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [text, setText] = useState("hello, *world*");
  const [displayedUrl, setDisplayedUrl] = useState(
    `/api/og?text=${encodeURIComponent(text)}`
  );
  const pendingUrlRef = useRef<string | null>(null);

  const targetUrl = `/api/og?text=${encodeURIComponent(text)}`;
  const isLoading = targetUrl !== displayedUrl;

  useEffect(() => {
    if (targetUrl === displayedUrl) return;

    pendingUrlRef.current = targetUrl;

    const img = new window.Image();
    img.src = targetUrl;
    img.onload = () => {
      if (pendingUrlRef.current === targetUrl) {
        setDisplayedUrl(targetUrl);
      }
    };
    img.onerror = () => {
      if (pendingUrlRef.current === targetUrl) {
        setDisplayedUrl(targetUrl);
      }
    };
  }, [targetUrl, displayedUrl]);

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${targetUrl}`
      : targetUrl;

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
              <div className="overflow-hidden rounded border border-gray-A04">
                <Image
                  src={displayedUrl}
                  alt="OG image preview"
                  width={1200}
                  height={630}
                  className="w-full"
                  style={
                    isLoading
                      ? {
                          animation: "pulse 1s linear infinite",
                        }
                      : undefined
                  }
                  unoptimized
                />
              </div>
            </div>
          </div>
        </Band>
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }
      `}</style>
    </Container>
  );
}
