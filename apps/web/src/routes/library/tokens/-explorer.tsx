import { Role } from "@ariakit/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import catalog from "virtual:design-tokens";
import Band from "@/components/Band";
import Container from "@/components/Container";
import { ContentList, contentListRow } from "@/components/ContentList";
import { grid, subGrid } from "@/components/ui/Grid";
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
  if (token.definitions.every((definition) => definition.scope === "component"))
    return "Other";
  if (isColor(token)) return "Colors";
  if (/^--(?:font-|text-|leading-|tracking-)/.test(token.name)) return "Type";
  if (/^--(?:spacing|container-|breakpoint-)/.test(token.name)) return "Space";
  if (
    /^--(?:radius-|shadow-|inset-shadow-|drop-shadow-|blur-|aspect-|perspective-)/.test(
      token.name,
    )
  )
    return "Shape";
  if (/^--(?:ease-|duration-|animate-)/.test(token.name)) return "Motion";
  return "Other";
}

const tokenGrid = subGrid({ sm: 4, md: 7, lg: 15 })();
const nameColumn = "col-span-full md:col-span-3 lg:col-span-7";
const sampleColumn = "col-span-2 md:col-span-2 lg:col-span-4";
const themes = ["dark", "light"] as const;

function Definitions({ token }: { token: Token }) {
  return (
    <ul className="mt-2 space-y-2 text-xs ak-ink-60 [overflow-wrap:anywhere]">
      {token.definitions.map((definition, index) => (
        <li key={index}>
          <code className="ak-ink-85">{definition.value}</code>
          <p>{definition.context.join(" → ")}</p>
          <code>
            {definition.file}:{definition.line}
          </code>
        </li>
      ))}
    </ul>
  );
}

function ColorSample({
  theme,
  token,
  resolved,
}: {
  theme: "dark" | "light";
  token: Token;
  resolved?: string;
}) {
  return (
    <div className={sampleColumn}>
      <figure
        data-token-theme={theme}
        data-swatch={token.name}
        aria-label={`${token.name} ${theme}`}
        className="ak-layer ak-layer-canvas"
        style={{
          backgroundImage:
            "conic-gradient(var(--gray-A04) 25%, transparent 0 50%, var(--gray-A04) 0 75%, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      >
        <div
          data-color-token={token.name}
          data-color-theme={theme}
          className="h-16"
          style={{ backgroundColor: `var(${token.name})` }}
        />
      </figure>
      <code
        data-resolved={token.name}
        data-resolved-theme={theme}
        className="mt-2 block text-xs ak-ink-60 [overflow-wrap:anywhere]"
      >
        {resolved ?? "…"}
      </code>
    </div>
  );
}

function ThemeColumns() {
  return (
    <div className={cn(tokenGrid, "mb-4 text-xs ak-ink-60")}>
      <span className={nameColumn} />
      {themes.map((theme) => (
        <span key={theme} className={cn(sampleColumn, "capitalize")}>
          {theme}
        </span>
      ))}
    </div>
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

function OffsetSamples({ offset }: { offset: Offset }) {
  return (
    <li className={cn(tokenGrid, "gap-y-2")}>
      <div className={nameColumn}>
        <code className="text-sm">{offset.utility}</code>
        <ul className="mt-2 space-y-1 font-mono text-xs ak-ink-60 [overflow-wrap:anywhere]">
          {offset.references.map((reference) => (
            <li key={`${reference.file}:${reference.line}`}>
              {reference.file}:{reference.line}
            </li>
          ))}
        </ul>
      </div>
      {themes.map((theme) => (
        <div key={theme} className={sampleColumn}>
          <div data-token-theme={theme} className="ak-layer ak-layer-canvas">
            <div
              data-offset={offset.utility}
              data-offset-theme={theme}
              className={cn(
                "h-16 ak-layer",
                offsetClasses[offset.kind][offset.direction],
              )}
              style={{ "--token-offset": offset.amount / 100 } as CSSProperties}
            />
          </div>
        </div>
      ))}
    </li>
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
      className="min-w-0 ak-layer ak-layer-canvas p-2"
    >
      <ContentList>
        <li>
          <Role.button className={cn(contentListRow, "text-left")}>
            List row <span className="text-xs ak-ink-60">{rowState}</span>
          </Role.button>
        </li>
      </ContentList>
      <Button>Button</Button>
      <label
        className="mt-6 block font-mono text-xs"
        htmlFor={`depth-${theme}`}
      >
        ak-state-<output>{depth}</output>
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
        hover:ak-state-{depth}
      </Role.button>
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
  const root = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState<Record<string, string>>({});
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
  useEffect(() => {
    const measure = () =>
      setResolved(
        Object.fromEntries(
          [
            ...(root.current?.querySelectorAll<HTMLElement>(
              "[data-color-token]",
            ) ?? []),
          ].map((element) => [
            `${element.dataset.colorTheme}/${element.dataset.colorToken}`,
            getComputedStyle(element).backgroundColor,
          ]),
        ),
      );
    measure();
    const gamut = matchMedia("(color-gamut: p3)");
    gamut.addEventListener("change", measure);
    return () => gamut.removeEventListener("change", measure);
  }, [search]);
  const groups = ["Colors", "Type", "Space", "Shape", "Motion", "Other"];
  return (
    <Container backable backAnchor="library">
      <style>{catalog.previewCss}</style>
      <div ref={root} data-token-reference="" className="flex flex-col gap-16">
        <Band gridless id="tokens">
          <div className={grid()}>
            <div className="col-span-full md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-10">
              <h1 className="font-semibold">Tokens</h1>
              <Role.input
                aria-label="Filter tokens"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter"
                className="mt-4 -mx-2 w-[calc(100%+1rem)] ak-layer ak-layer-transparent ak-frame ak-frame-field/2"
              />
              <p
                role="status"
                aria-label="Token results"
                className="mt-2 text-xs tracking-tighter ak-ink-60"
              >
                {tokens.length} / {catalog.tokens.length}
              </p>
            </div>
          </div>
        </Band>
        {groups.map((group, index) => {
          const entries = tokens.filter((token) => category(token) === group);
          if (!entries.length) return null;
          return (
            <Band
              key={group}
              headline={{
                bold: String(index + 1).padStart(2, "0"),
                thin: group,
              }}
            >
              {group === "Colors" && <ThemeColumns />}
              <ul className="space-y-8">
                {entries.map((token) => (
                  <li
                    key={token.name}
                    data-definition={token.name}
                    className={cn(tokenGrid, "gap-y-3")}
                  >
                    <div className={nameColumn}>
                      <code className="text-sm">{token.name}</code>
                      <Definitions token={token} />
                    </div>
                    {group === "Colors" &&
                    token.definitions.some(
                      (definition) => definition.scope !== "component",
                    ) ? (
                      themes.map((theme) => (
                        <ColorSample
                          key={theme}
                          theme={theme}
                          token={token}
                          resolved={resolved[`${theme}/${token.name}`]}
                        />
                      ))
                    ) : (
                      <div className="col-span-full md:col-span-4 lg:col-span-8">
                        <TokenSample token={token} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </Band>
          );
        })}
        {!tokens.length && (
          <Band gridless id="empty">
            <div className={grid()}>
              <p className="col-span-full md:col-start-2 lg:col-start-2">
                No matches.
              </p>
            </div>
          </Band>
        )}
        <Band headline={{ bold: "07", thin: "Layers" }}>
          <ThemeColumns />
          <ul className="space-y-6">
            {catalog.offsets.map((offset) => (
              <OffsetSamples key={offset.utility} offset={offset} />
            ))}
          </ul>
        </Band>
        <Band headline={{ bold: "08", thin: "States" }}>
          <div className={tokenGrid}>
            <div className={nameColumn} />
            {themes.map((theme) => (
              <div key={theme} className={sampleColumn}>
                <p className="mb-2 text-xs capitalize ak-ink-60">{theme}</p>
                <Interactions theme={theme} />
              </div>
            ))}
          </div>
        </Band>
      </div>
    </Container>
  );
}
