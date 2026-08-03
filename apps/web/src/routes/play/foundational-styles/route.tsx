import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";
import Band from "@/components/Band";
import Container from "@/components/Container";
import { Blur } from "@/components/ui/Blur";
import { grid, subGrid } from "@/components/ui/Grid";
import StyledLink from "@/components/ui/StyledLink";
import { cn } from "@/lib/styling";

const foundationGrid = grid();
const showcaseColumns =
  "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15";
const patternGrid = subGrid({ sm: 4, md: 6, lg: 12 })();

const solidColors = Array.from({ length: 13 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const alphaColors = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);

const typeScale = [
  { name: "xs", size: "0.75rem", lineHeight: "1rem" },
  { name: "sm", size: "0.875rem", lineHeight: "1.25rem" },
  { name: "base", size: "1rem", lineHeight: "1.5rem" },
  { name: "lg", size: "1.125rem", lineHeight: "1.75rem" },
  { name: "xl", size: "1.25rem", lineHeight: "1.75rem" },
  { name: "2xl", size: "1.5rem", lineHeight: "2rem" },
];

const spacing = [
  { name: "0.5", value: "0.125rem", pixels: "2px" },
  { name: "1", value: "0.25rem", pixels: "4px" },
  { name: "1.5", value: "0.375rem", pixels: "6px" },
  { name: "2", value: "0.5rem", pixels: "8px" },
  { name: "3", value: "0.75rem", pixels: "12px" },
  { name: "4", value: "1rem", pixels: "16px" },
  { name: "6", value: "1.5rem", pixels: "24px" },
  { name: "8", value: "2rem", pixels: "32px" },
  { name: "10", value: "2.5rem", pixels: "40px" },
  { name: "12", value: "3rem", pixels: "48px" },
  { name: "16", value: "4rem", pixels: "64px" },
  { name: "20", value: "5rem", pixels: "80px" },
  { name: "24", value: "6rem", pixels: "96px" },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header
      className={cn(
        foundationGrid,
        "col-span-full gap-y-3 border-t border-gray-A04 pt-4",
      )}
    >
      <p className="col-span-full font-mono text-xs text-gray-09 md:col-span-2 lg:col-span-4">
        {eyebrow}
      </p>
      <div className="col-span-full md:col-start-3 md:col-end-9 lg:col-start-5 lg:col-end-17">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 max-w-xl text-sm text-gray-10">{description}</p>
      </div>
    </header>
  );
}

function PatternEntry({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        showcaseColumns,
        patternGrid,
        "gap-y-6 border-t border-gray-A04 pt-4",
      )}
    >
      <div className="col-span-full md:col-span-2 lg:col-span-4">
        <p className="font-mono text-xs text-gray-09">{number}</p>
        <h3 className="mt-2 font-semibold text-gray-12">{title}</h3>
        <p className="mt-2 max-w-xs text-sm text-gray-10">{description}</p>
      </div>
      <div className="col-span-full min-w-0 md:col-span-4 lg:col-span-8">
        {children}
      </div>
    </article>
  );
}

export function FoundationalStylesPage() {
  return (
    <Container>
      <Band gridless id="foundational-styles">
        <main className="pb-24 pt-12 md:pt-20">
        <header
          className={cn(foundationGrid, "gap-y-8 pb-20 md:pb-28")}
        >
          <p className="col-span-full font-mono text-xs uppercase tracking-wider text-gray-09 md:col-span-2 lg:col-span-4">
            Foundations / 01
          </p>
          <div className="col-span-full md:col-start-3 md:col-end-9 lg:col-start-5 lg:col-end-17">
            <h1 className="max-w-2xl text-2xl font-semibold tracking-tight md:text-4xl">
              The quiet system beneath the site.
            </h1>
            <p className="mt-5 max-w-xl text-gray-10">
              Type, color, and space—the small set of primitives used to build
              hierarchy and rhythm across every page.
            </p>
          </div>
        </header>

        <section className={cn(foundationGrid, "gap-y-10")}>
          <SectionHeading
            eyebrow="01 / Typography"
            title="A serif voice, with mono for notation."
            description="IBM Plex Serif carries the interface and editorial voice. Geist Mono labels tokens, values, and technical details."
          />

          <div
            className={cn(
              showcaseColumns,
              "grid gap-px overflow-hidden rounded-sm border border-gray-A04 bg-gray-A04 md:grid-cols-2",
            )}
          >
            <article className="flex min-h-72 flex-col bg-gray-01 p-6 md:p-8">
              <p className="font-mono text-xs text-gray-09">font-serif</p>
              <p className="mt-12 text-2xl leading-tight md:text-4xl">
                Almost before we knew it, we had left the ground.
              </p>
              <p className="mt-auto pt-8 text-sm text-gray-10">
                IBM Plex Serif · Regular 400
              </p>
            </article>
            <article className="flex min-h-72 flex-col bg-gray-01 p-6 font-mono md:p-8">
              <p className="text-xs text-gray-09">font-mono</p>
              <p className="mt-12 text-xl leading-snug md:text-2xl">
                Almost before we knew it,
                <br />
                we had left the ground.
              </p>
              <p className="mt-auto pt-8 text-xs text-gray-10">
                Geist Mono Variable · Regular 400
              </p>
            </article>
          </div>

          <div
            className={cn(
              showcaseColumns,
              "grid min-h-48 gap-8 py-6 md:grid-cols-3",
            )}
          >
            <div>
              <p className="font-mono text-xs text-gray-09">Weights</p>
            </div>
            <div className="space-y-5 md:col-span-2">
              <p className="text-xl font-normal">
                Regular <span className="text-gray-09">400</span>
              </p>
              <p className="text-xl font-semibold">
                Semibold <span className="text-gray-09">600</span>
              </p>
              <p className="text-xl font-bold">
                Bold <span className="text-gray-09">700</span>
              </p>
            </div>
          </div>

          <div
            className={cn(
              showcaseColumns,
              "overflow-hidden rounded-sm border border-gray-A04",
            )}
          >
            {typeScale.map((type) => (
              <div
                key={type.name}
                className="grid min-h-20 items-center gap-4 border-b border-gray-A04 px-4 py-5 last:border-b-0 md:grid-cols-3 md:px-6"
              >
                <p className="font-mono text-xs text-gray-09">
                  text-{type.name} · {type.size} / {type.lineHeight}
                </p>
                <p
                  className="md:col-span-2"
                  style={{ fontSize: type.size, lineHeight: type.lineHeight }}
                >
                  Pack my box with five dozen liquor jugs.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={cn(foundationGrid, "mt-24 gap-y-10 md:mt-32")}
        >
          <SectionHeading
            eyebrow="02 / Color"
            title="Warm, neutral, and intentionally restrained."
            description="A thirteen-step solid gray scale handles surfaces and text. Its alpha companion builds borders, overlays, and states that adapt to their background."
          />

          <div className={showcaseColumns}>
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-semibold">Solid scale</h3>
              <p className="font-mono text-xs text-gray-09">gray-00—12</p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-gray-A04 bg-gray-A04 sm:grid-cols-4 lg:grid-cols-7">
              {solidColors.map((step) => (
                <div key={step} className="bg-gray-01">
                  <div
                    className="min-h-24 sm:min-h-28"
                    style={{ backgroundColor: `var(--gray-${step})` }}
                  />
                  <div className="flex items-center justify-between px-3 py-2 font-mono text-[11px]">
                    <span>gray-{step}</span>
                    <span className="text-gray-09">{step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={showcaseColumns}>
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-semibold">Alpha scale</h3>
              <p className="font-mono text-xs text-gray-09">gray-A01—A12</p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-gray-A04 bg-gray-04 sm:grid-cols-4 lg:grid-cols-6">
              {alphaColors.map((step) => (
                <div key={step} className="bg-gray-02 p-3">
                  <div
                    className="min-h-20 rounded-sm"
                    style={{ backgroundColor: `var(--gray-A${step})` }}
                  />
                  <p className="mt-3 font-mono text-[11px] text-gray-11">
                    gray-A{step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn(
              showcaseColumns,
              "grid gap-px overflow-hidden rounded-sm border border-gray-A04 bg-gray-A04 md:grid-cols-3",
            )}
          >
            <div className="flex min-h-48 flex-col bg-gray-01 p-6">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gray-12" />
              <p className="mt-auto pt-8 font-semibold">High emphasis</p>
              <p className="mt-1 font-mono text-xs text-gray-09">gray-12</p>
            </div>
            <div className="flex min-h-48 flex-col bg-gray-01 p-6">
              <div className="h-10 w-10 shrink-0 rounded-full bg-gray-10" />
              <p className="mt-auto pt-8 text-gray-10">Secondary content</p>
              <p className="mt-1 font-mono text-xs text-gray-09">gray-10</p>
            </div>
            <div className="flex min-h-48 flex-col bg-gray-01 p-6">
              <div className="h-10 w-10 shrink-0 rounded-full border border-gray-A04 bg-gray-02" />
              <p className="mt-auto pt-8">Subtle surface</p>
              <p className="mt-1 font-mono text-xs text-gray-09">
                gray-02 + gray-A04
              </p>
            </div>
          </div>
        </section>

        <section
          className={cn(foundationGrid, "mt-24 gap-y-10 md:mt-32")}
        >
          <SectionHeading
            eyebrow="03 / Spacing"
            title="A four-pixel rhythm, with room to breathe."
            description="Most layouts use a compact subset of Tailwind’s spacing scale. Small steps tune controls; larger steps establish section rhythm."
          />

          <div
            className={cn(
              showcaseColumns,
              "overflow-hidden rounded-sm border border-gray-A04",
            )}
          >
            {spacing.map((space) => (
              <div
                key={space.name}
                className="grid min-h-14 grid-cols-[4rem_1fr_3rem] items-center gap-4 border-b border-gray-A04 px-4 py-3 last:border-b-0 md:grid-cols-[8rem_1fr_5rem] md:px-6"
              >
                <p className="font-mono text-xs text-gray-10">space-{space.name}</p>
                <div className="flex min-h-4 items-center">
                  <div
                    className="h-4 max-w-full rounded-[1px] bg-gray-11"
                    style={{ width: space.value }}
                  />
                </div>
                <p className="text-right font-mono text-xs text-gray-09">
                  {space.pixels}
                </p>
              </div>
            ))}
          </div>

          <div
            className={cn(showcaseColumns, "grid gap-6 md:grid-cols-3")}
          >
            {[
              { label: "Compact", gap: "0.5rem", token: "gap-2" },
              { label: "Default", gap: "1rem", token: "gap-4" },
              { label: "Relaxed", gap: "2rem", token: "gap-8" },
            ].map((example) => (
              <article
                key={example.label}
                className="flex min-h-72 flex-col rounded-sm border border-gray-A04 p-5"
              >
                <div
                  className="flex min-h-48 flex-col justify-center"
                  style={{ gap: example.gap }}
                >
                  <div className="h-8 shrink-0 rounded-sm bg-gray-03" />
                  <div className="h-8 shrink-0 rounded-sm bg-gray-03" />
                  <div className="h-8 shrink-0 rounded-sm bg-gray-03" />
                </div>
                <div className="mt-auto flex items-baseline justify-between pt-6">
                  <p className="font-semibold">{example.label}</p>
                  <p className="font-mono text-xs text-gray-09">
                    {example.token}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        </main>
      </Band>
    </Container>
  );
}

function SiteLanguageSection() {
  return (
        <section className={cn(foundationGrid, "gap-y-16")}>
          <aside
            className={cn(
              showcaseColumns,
              "rounded-sm border border-gray-A06 bg-gray-A02 p-6 md:p-10",
            )}
          >
            <p className="font-mono text-xs uppercase tracking-wider text-gray-09">
              Disclaimer
            </p>
            <p className="mt-4 max-w-3xl text-2xl leading-tight text-gray-12 md:text-4xl">
              This is agent slop, but Igor found it cool and wanted to share it
              with friends.
            </p>
          </aside>

          <SectionHeading
            eyebrow="04 / Site language"
            title="The recurring moves that make it Igor."
            description="These are not isolated components. They are habits repeated across the index, writing, work, and playground pages: editorial hierarchy, selective disclosure, quiet metadata, and a grid that lets details break the rhythm without abandoning it."
          />

          <PatternEntry
            number="04.01"
            title="Bands become chapters"
            description="Sections are announced with an enormous, low-contrast index and a lighter title. The label behaves as atmosphere before it behaves as text."
          >
            <div className="min-h-64 overflow-hidden rounded-sm border border-gray-A04 bg-gray-01 py-8">
              <Band headline={{ bold: "01", thin: "Work" }} options={{ narrow: true }}>
                <p className="max-w-sm text-gray-11">
                  Content sits beside the sticky chapter marker, borrowing its
                  rhythm without competing with it.
                </p>
              </Band>
            </div>
          </PatternEntry>

          <PatternEntry
            number="04.02"
            title="Contrast carries meaning"
            description="Weight is rarely enough on its own. High, normal, and low contrast let a paragraph expose its essential reading path."
          >
            <div className="flex min-h-56 items-center rounded-sm border border-gray-A04 p-6">
              <p className="text-xl leading-relaxed text-gray-11">
                <strong className="font-normal text-gray-12">
                  Start with the thought that must survive a skim.
                </strong>{" "}
                Let the supporting sentence sit at the site&apos;s natural reading
                contrast. <span className="text-gray-08">Then allow context to recede without removing it.</span>
              </p>
            </div>
          </PatternEntry>

          <PatternEntry
            number="04.03"
            title="Disclosure is part of the voice"
            description="Blurred asides hold doubt, jokes, and extra honesty. Hover or focus turns a private aside into an optional second reading."
          >
            <div className="flex min-h-48 items-center rounded-sm border border-gray-A04 p-6 text-lg leading-relaxed">
              <p>
                The direct version stays readable.{" "}
                <Blur>
                  The messier version is still here for anyone curious enough
                  to reach for it.
                </Blur>{" "}
                <strong className="font-normal text-gray-12">
                  Important words can remain clear inside the aside.
                </strong>
              </p>
            </div>
          </PatternEntry>

          <PatternEntry
            number="04.04"
            title="A list reacts as one object"
            description="Project and writing indexes dim together. The item under attention returns to full contrast while its date slides quietly into view."
          >
            <ul className="pointer-events-none flex min-h-56 flex-col justify-center rounded-sm border border-gray-A04 px-6 focus-within:text-gray-10 hover:text-gray-10">
              {[
                ["Axiom", "UI & engineering for observability.", "2023 ~ 2026"],
                ["The Manual", "A careful reading experience.", "2022"],
                ["Cowboy Bebop", "A web poster built for motion.", "2021"],
              ].map(([name, summary, date]) => (
                <li
                  key={name}
                  tabIndex={0}
                  className="group pointer-events-auto py-3 transition-colors duration-fast-02 ease-productive-standard hover:text-gray-12 focus:text-gray-12 focus:outline-none"
                >
                  <p>
                    <strong className="font-bold">{name}</strong>{" "}
                    <span className="inline-block text-xs tracking-tighter text-gray-11 transition-all duration-moderate-01 ease-productive-standard group-focus:translate-x-0 group-focus:opacity-100 group-hover:translate-x-0 group-hover:opacity-100 md:-translate-x-4 md:opacity-0">
                      {date}
                    </span>
                  </p>
                  <p>{summary}</p>
                </li>
              ))}
            </ul>
          </PatternEntry>

          <PatternEntry
            number="04.05"
            title="Quotes escape the measure"
            description="Writing remains compact until a sentence deserves the room. Large blockquotes use negative indentation to hang punctuation outside the prose edge."
          >
            <div className="flex min-h-64 items-center rounded-sm border border-gray-A04 px-8 py-10 md:px-12">
              <blockquote className="-indent-4 text-3xl leading-tight text-gray-12 sm:-indent-6 sm:text-5xl">
                “Elevating content through presentation.”
              </blockquote>
            </div>
          </PatternEntry>

          <PatternEntry
            number="04.06"
            title="Metadata whispers"
            description="Dates, periods, captions, and counts are small and close-set. Uppercase labels orient; italic captions step away from the main narrative."
          >
            <div className="grid min-h-56 gap-px overflow-hidden rounded-sm border border-gray-A04 bg-gray-A04 sm:grid-cols-2">
              <div className="flex flex-col justify-between bg-gray-01 p-6">
                <p className="text-xs font-bold tracking-tighter text-gray-08">
                  Last updated on <time>06 Oct 2023</time>
                </p>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-09">
                    2022 — Direction
                  </p>
                  <p className="mt-1 text-xl font-semibold">Designing the reading flow</p>
                </div>
              </div>
              <figure className="flex flex-col bg-gray-02 p-4">
                <div className="min-h-28 flex-1 rounded-sm border border-gray-A04 bg-gray-03" />
                <figcaption className="mt-2 text-end text-sm italic tracking-wide text-gray-10">
                  The detail should reward a closer look.
                </figcaption>
              </figure>
            </div>
          </PatternEntry>

          <PatternEntry
            number="04.07"
            title="Links declare their destination"
            description="Links stay inside the sentence and share a quiet underline. Internal navigation can carry a directional cue; external destinations receive the northeast arrow."
          >
            <div className="flex min-h-48 flex-col justify-center gap-5 rounded-sm border border-gray-A04 p-6 text-lg">
              <p>
                Read more about the{" "}
                <a className="underline decoration-gray-A08 underline-offset-2" href="/writing/schrodinger-minimalism">
                  writing system
                </a>
                .
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <StyledLink href="/work" icon={<ArrowRightIcon />}>
                  Selected work
                </StyledLink>
                <StyledLink href="https://github.com/bdsqqq">
                  Github
                </StyledLink>
              </div>
            </div>
          </PatternEntry>

          <PatternEntry
            number="04.08"
            title="Atmosphere stays at the edge"
            description="Warm grays do the real work. Alpha borders, faint gradients, grain, and top-and-bottom fades add tactility without becoming the subject."
          >
            <div className="relative min-h-64 overflow-hidden rounded-sm border border-gray-A04 bg-gray-01">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,var(--gray-A05),transparent_45%)]" />
              <div className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-gray-00 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-gray-00 to-transparent" />
              <div className="relative grid min-h-64 place-items-center p-8">
                <div className="rounded-sm border border-gray-A05 bg-gray-A02 p-6 shadow-highlight shadow-gray-A03">
                  <p className="font-semibold text-gray-12">Texture, not decoration.</p>
                  <p className="mt-1 text-sm text-gray-10">The content keeps the highest contrast.</p>
                </div>
              </div>
            </div>
          </PatternEntry>

          <PatternEntry
            number="04.09"
            title="The grid permits asymmetry"
            description="Four, eight, then sixteen columns provide the shared skeleton. Content can narrow, offset, bleed, or leave a column empty while remaining visibly related."
          >
            <div className="overflow-hidden rounded-sm border border-gray-A04 p-4">
              <div className={cn(foundationGrid, "min-h-48 gap-y-2")}>
                {Array.from({ length: 16 }, (_, index) => (
                  <div
                    key={index}
                    className="min-h-48 rounded-[1px] bg-gray-A03"
                  />
                ))}
              </div>
              <p className="mt-3 font-mono text-xs text-gray-09">
                4 columns / 8 columns / 16 columns
              </p>
            </div>
          </PatternEntry>
        </section>
  );
}

export function SiteLanguagePage() {
  return (
    <Container>
      <Band gridless id="site-language">
        <main className="pb-24 pt-12 md:pt-20">
          <SiteLanguageSection />
        </main>
      </Band>
    </Container>
  );
}

export const Route = createFileRoute("/play/foundational-styles")({
  component: FoundationalStylesPage,
  head: () => ({
    meta: [
      { title: "Foundational styles — Play — Igor Bedesqui" },
      {
        name: "description",
        content: "Typography, color, and spacing primitives used across the site.",
      },
    ],
  }),
});
