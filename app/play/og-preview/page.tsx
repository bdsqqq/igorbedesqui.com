"use client";

import Container from "@/components/Container";
import Band from "@/components/Band";
import { useState, useMemo } from "react";

export default function Page() {
  const [text, setText] = useState("hello, *world*");

  const encodedText = useMemo(() => encodeURIComponent(text), [text]);
  const ogUrl = `/api/og?text=${encodedText}`;
  const fullUrl = `https://www.igorbedesqui.com${ogUrl}`;

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogUrl}
                  alt="OG image preview"
                  className="aspect-[1200/630] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </Band>
      </div>
    </Container>
  );
}
