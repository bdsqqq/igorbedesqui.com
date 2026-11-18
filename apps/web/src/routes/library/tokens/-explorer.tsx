import { Role } from "@ariakit/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import catalog from "virtual:design-tokens";
import Container from "@/components/Container";
import { ContentList, contentListRow } from "@/components/ContentList";
import { grid } from "@/components/ui/Grid";
import { Button } from "../button/-button";
import { cn } from "@/lib/styling";
import type { Offset, Token } from "./-catalog";

const tokensByName = new Map(
  catalog.tokens.map((token) => [token.name, token]),
);
function isColor(token: Token, seen = new Set<string>()): boolean {
  if (seen.has(token.name)) return false;
  seen.add(token.name);
  if (token.name.startsWith("--color-")) return true;
  return token.definitions.some(({ value }) => {
    if (
      /^(?:#[\da-f]{3,8}\b|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(|currentcolor$|transparent$)/i.test(
        value,
      )
    )
      return true;
    const reference = value.match(/^var\((--[\w-]+)\)$/)?.[1];
    const target = reference ? tokensByName.get(reference) : undefined;
    return target ? isColor(target, new Set(seen)) : false;
  });
}

function category(token: Token) {
  if (isColor(token)) return "Color";
  if (/^--(?:font-|text-|leading-|tracking-)/.test(token.name))
    return "Typography";
  if (/^--(?:spacing|container-|breakpoint-)/.test(token.name)) return "Layout";
  if (
    /^--(?:radius-|shadow-|inset-shadow-|drop-shadow-|blur-|aspect-|perspective-)/.test(
      token.name,
    )
  )
    return "Shape & effects";
  if (/^--(?:ease-|duration-|animate-)/.test(token.name)) return "Motion";
  return "Ariakit & component aliases";
}

function Definitions({ token }: { token: Token }) {
  return (
    <details className="mt-2 text-xs">
      <summary className="cursor-pointer ak-ink-70">
        Source · {token.definitions.length} definition
        {token.definitions.length === 1 ? "" : "s"}
      </summary>
      <ol className="mt-3 space-y-4">
        {token.definitions.map((definition, index) => (
          <li key={index} className="space-y-1 [overflow-wrap:anywhere]">
            <code className="block ak-ink-100">{definition.value}</code>
            <p className="font-mono ak-ink-60">
              {definition.file}:{definition.line}
            </p>
            <p className="ak-ink-60">{definition.context.join(" → ")}</p>
          </li>
        ))}
      </ol>
    </details>
  );
}

const colorTokens = catalog.tokens.filter(
  (token) =>
    category(token) === "Color" &&
    !token.name.startsWith("--color-gray-") &&
    token.definitions.some((definition) => definition.scope !== "component"),
);

function Palette({
  theme,
  tokens,
}: {
  theme: "dark" | "light";
  tokens: Token[];
}) {
  const root = useRef<HTMLElement>(null);
  const [resolved, setResolved] = useState<Record<string, string>>({});
  useEffect(() => {
    const measure = () =>
      setResolved(
        Object.fromEntries(
          [
            ...(root.current?.querySelectorAll<HTMLElement>(
              "[data-color-token]",
            ) ?? []),
          ].map((element) => [
            element.dataset.colorToken!,
            getComputedStyle(element).backgroundColor,
          ]),
        ),
      );
    measure();
    const gamut = matchMedia("(color-gamut: p3)");
    gamut.addEventListener("change", measure);
    return () => gamut.removeEventListener("change", measure);
  }, [tokens]);
  return (
    <section
      ref={root}
      data-token-theme={theme}
      aria-label={`${theme} palette`}
      className="min-w-0 ak-layer ak-layer-canvas ak-frame ak-frame-card/4 ak-frame-border -ak-frame-m-px"
    >
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-bold capitalize">{theme}</h3>
        <span className="font-mono text-xs ak-ink-60">
          real CSS · live gamut
        </span>
      </header>
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {tokens.map((token) => (
          <figure key={token.name} className="min-w-0" data-swatch={token.name}>
            <div
              className="ak-layer ak-layer-transparent ak-edge-10 ak-frame ak-frame-field/0 ak-frame-border -ak-frame-m-px overflow-hidden"
              style={{
                backgroundImage:
                  "conic-gradient(var(--gray-A04) 25%, transparent 0 50%, var(--gray-A04) 0 75%, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            >
              <div
                data-color-token={token.name}
                className="h-20"
                style={{ backgroundColor: `var(${token.name})` }}
              />
            </div>
            <figcaption className="mt-2 min-w-0">
              <code className="text-xs font-semibold [overflow-wrap:anywhere]">
                {token.name}
              </code>
              <p
                className="mt-1 font-mono text-[10px] ak-ink-60 [overflow-wrap:anywhere]"
                data-resolved={token.name}
              >
                {resolved[token.name] ?? "resolving…"}
              </p>
              <Definitions token={token} />
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const offsetClasses = {
  layer: {
    auto: "ak-layer-(--token-offset)",
    lighten: "ak-layer-lighten-(--token-offset)",
    darken: "ak-layer-darken-(--token-offset)",
  },
  state: {
    auto: "ak-state-(--token-offset)",
    lighten: "ak-state-lighten-(--token-offset)",
    darken: "ak-state-darken-(--token-offset)",
  },
};

function OffsetSample({ offset }: { offset: Offset }) {
  return (
    <details className="min-w-0">
      <summary className="cursor-pointer list-none">
        <div
          data-offset={offset.utility}
          className={cn(
            "h-14 ak-layer ak-frame ak-frame-field/2",
            offsetClasses[offset.kind][offset.direction],
          )}
          style={{ "--token-offset": offset.amount / 100 } as CSSProperties}
        />
        <code className="mt-2 block text-[11px] [overflow-wrap:anywhere]">
          {offset.utility}
        </code>
      </summary>
      <ul className="mt-2 space-y-1 font-mono text-[10px] ak-ink-60 [overflow-wrap:anywhere]">
        {offset.references.map((reference) => (
          <li key={`${reference.file}:${reference.line}`}>
            {reference.file}:{reference.line}
          </li>
        ))}
      </ul>
    </details>
  );
}

const rowState =
  contentListRow
    .split(/\s+/)
    .find((utility) => utility.startsWith("hover:ak-state-")) ?? "";

function Interactions({ theme }: { theme: "dark" | "light" }) {
  const [depth, setDepth] = useState(() =>
    Number(rowState.match(/\d+$/)?.[0] ?? 0),
  );
  return (
    <section
      data-token-theme={theme}
      aria-label={`${theme} interactions`}
      className="min-w-0 ak-layer ak-layer-canvas ak-frame ak-frame-card/4 ak-frame-border -ak-frame-m-px"
    >
      <h3 className="mb-5 text-xl font-bold capitalize">{theme}</h3>
      <p className="mb-3 text-sm ak-ink-70">
        The actual list-row recipe and Button component:
      </p>
      <ContentList>
        <li>
          <Role.button className={cn(contentListRow, "text-left")}>
            Hover or focus this row{" "}
            <span className="text-xs ak-ink-60">{rowState}</span>
          </Role.button>
        </li>
      </ContentList>
      <Button className="mt-3">Hover, focus, press</Button>
      <label className="mt-8 block text-sm" htmlFor={`depth-${theme}`}>
        Try a state offset <output className="font-mono">{depth}</output>
      </label>
      <Role.input
        id={`depth-${theme}`}
        type="range"
        min={0}
        max={24}
        value={depth}
        onChange={(event) => setDepth(Number(event.target.value))}
        className="my-4 w-full"
      />
      <Role.button
        className="w-full ak-layer ak-layer-transparent ak-frame ak-frame-field/4 text-left hover:ak-state-(--token-offset) focus-visible:ak-state-(--token-offset)"
        style={{ "--token-offset": depth / 100 } as CSSProperties}
      >
        Hover / focus · {depth} lightness points
      </Role.button>
      <p className="mt-8 mb-4 text-sm ak-ink-70">
        Numeric layer/state modifiers found in site source. These show the
        settled fill, not a simulated pointer state. Open one for its callers.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {catalog.offsets.map((offset) => (
          <OffsetSample key={offset.utility} offset={offset} />
        ))}
      </div>
    </section>
  );
}

function TokenSample({ token }: { token: Token }) {
  const value = `var(${token.name})`;
  if (token.name.startsWith("--radius-"))
    return (
      <span
        aria-hidden="true"
        className="block h-10 w-16 ak-layer ak-layer-10"
        style={{ borderRadius: value }}
      />
    );
  if (/^--font-(?:serif|sans|mono)$/.test(token.name))
    return (
      <span
        aria-hidden="true"
        className="text-2xl"
        style={{ fontFamily: value }}
      >
        Ag 0123
      </span>
    );
  if (/^--text-[^-]+$/.test(token.name))
    return (
      <span
        aria-hidden="true"
        className="block max-h-24 overflow-hidden"
        style={{ fontSize: value }}
      >
        Ag
      </span>
    );
  if (/^--spacing(?:-|$)/.test(token.name))
    return (
      <span
        aria-hidden="true"
        className="block h-3 max-w-full ak-layer ak-layer-10"
        style={{ width: value }}
      />
    );
  return null;
}

export function TokenExplorer() {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const tokens = catalog.tokens.filter(
    (token) =>
      !search ||
      [
        token.name,
        ...token.definitions.flatMap((definition) => [
          definition.value,
          definition.file,
          ...definition.context,
        ]),
      ].some((value) => value.toLowerCase().includes(search)),
  );
  const swatches = colorTokens.filter((token) => tokens.includes(token));
  const groups = [...new Set(tokens.map(category))];
  return (
    <Container>
      <style>{catalog.previewCss}</style>
      <div className={cn(grid(), "py-12 md:py-20")}>
        <div className="col-span-full min-w-0 space-y-14 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15">
          <header className="max-w-3xl space-y-5">
            <p className="font-mono text-xs uppercase tracking-wider ak-ink-60">
              Library / live definitions
            </p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Color, without guesswork.
            </h1>
            <p className="text-lg ak-ink-80">
              Warm grays, a blue accent, and colors that change with the
              material beneath them. This is an inventory of the definitions—not
              another palette to keep in sync.
            </p>
            <details className="text-sm">
              <summary className="cursor-pointer font-semibold">
                What dictates our colors?
              </summary>
              <ol className="mt-4 space-y-3 ak-ink-70">
                <li>
                  <strong className="ak-ink-100">01 · Authored colors.</strong>{" "}
                  <code>src/routes/-main.css</code> defines both schemes, alpha
                  colors, Display P3 overrides, and semantic aliases such as
                  canvas and primary.
                </li>
                <li>
                  <strong className="ak-ink-100">02 · Inherited tokens.</strong>{" "}
                  Tailwind supplies type, spacing, radii, and effects. The site
                  resets its default color namespace:{" "}
                  {catalog.resets.map((reset) => (
                    <code key={`${reset.file}:${reset.line}`}>
                      {reset.name}: {reset.value}
                    </code>
                  ))}
                  .
                </li>
                <li>
                  <strong className="ak-ink-100">03 · Derived colors.</strong>{" "}
                  Ariakit computes layers, ink, edges, and state responses
                  relative to their parent. A state number is a lightness
                  offset—not an opacity or a gray-scale index.
                </li>
              </ol>
            </details>
            <p className="text-xs ak-ink-60">
              Extracted from the installed CSS files and literal numeric
              modifiers in production TS/TSX at build time; refreshed by Vite in
              development. Feature-local literal colors and dynamically
              assembled classes are outside this token inventory. No global
              theme overrides.
            </p>
          </header>
          <section aria-label="Token search" className="space-y-2">
            <label
              htmlFor="token-search"
              className="block text-sm font-semibold"
            >
              Find a token, value, condition, or source
            </label>
            <Role.input
              id="token-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try gray-A, radius, P3, or primary…"
              className="w-full ak-layer ak-layer-darken-3 ak-frame ak-frame-field/3"
            />
            <p
              role="status"
              aria-label="Token results"
              className="font-mono text-xs ak-ink-60"
            >
              {tokens.length} / {catalog.tokens.length} tokens ·{" "}
              {catalog.offsets.length} source-derived offsets
            </p>
          </section>
          <section aria-labelledby="palette-heading" className="space-y-6">
            <div>
              <h2 id="palette-heading" className="text-2xl font-semibold">
                The palette, in both schemes.
              </h2>
              <p className="mt-2 text-sm ak-ink-70">
                All base colors and semantic color roles. Alpha swatches sit
                over a checkerboard. Gray utility aliases share these values;
                every alias and conditional definition is listed below.
              </p>
            </div>
            {swatches.length ? (
              <div className="grid items-start gap-6 lg:grid-cols-2">
                {(["dark", "light"] as const).map((theme) => (
                  <Palette key={theme} theme={theme} tokens={swatches} />
                ))}
              </div>
            ) : (
              <p>No matching color swatches.</p>
            )}
          </section>
          <section aria-labelledby="states-heading" className="space-y-6">
            <div>
              <h2 id="states-heading" className="text-2xl font-semibold">
                Why a hover can disappear.
              </h2>
              <p className="mt-2 max-w-3xl text-sm ak-ink-70">
                A small lightness shift near black can be real but hard to see.
                Compare the same native recipes on dark and light canvases, then
                try a larger offset. This page does not change the site’s
                interaction colors.
              </p>
            </div>
            <div className="grid items-start gap-6 lg:grid-cols-2">
              {(["dark", "light"] as const).map((theme) => (
                <Interactions key={theme} theme={theme} />
              ))}
            </div>
          </section>
          <section
            data-token-reference=""
            aria-labelledby="definitions-heading"
            className="space-y-6"
          >
            <div>
              <h2 id="definitions-heading" className="text-2xl font-semibold">
                Every definition, including the other thingies.
              </h2>
              <p className="mt-2 text-sm ak-ink-70">
                The active namespace after resets, including unused definitions.
                Open a token for its original values, selectors, conditions, and
                source lines. Component-scoped aliases are identified by their
                selectors, not treated as global colors.
              </p>
            </div>
            {!tokens.length && <p>No matching definitions.</p>}
            {groups.map((group) => (
              <details
                key={group}
                open={search ? true : undefined}
                className="py-3"
              >
                <summary className="cursor-pointer text-lg font-semibold">
                  {group}{" "}
                  <span className="font-mono text-xs ak-ink-60">
                    {tokens.filter((token) => category(token) === group).length}
                  </span>
                </summary>
                <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {tokens
                    .filter((token) => category(token) === group)
                    .map((token) => (
                      <div
                        key={token.name}
                        data-definition={token.name}
                        className="min-w-0 space-y-2"
                      >
                        <dt className="font-mono text-xs font-semibold [overflow-wrap:anywhere]">
                          {token.name}
                        </dt>
                        <dd className="space-y-2">
                          <TokenSample token={token} />
                          <code className="block text-xs ak-ink-70 [overflow-wrap:anywhere]">
                            {token.definitions.at(-1)?.value}
                          </code>
                          <Definitions token={token} />
                        </dd>
                      </div>
                    ))}
                </dl>
              </details>
            ))}
          </section>
        </div>
      </div>
    </Container>
  );
}
