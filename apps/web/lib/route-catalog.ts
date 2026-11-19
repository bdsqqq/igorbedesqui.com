import type {} from "@tanstack/react-router";

export interface PageMetadata {
  name: string;
  description?: string;
  date?: string;
  /** Lower values appear first; ties and unranked pages sort by name, then URL. */
  order?: number;
}

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    page?: PageMetadata;
  }
}

export interface CatalogPage extends PageMetadata {
  href: string;
  description: string;
}

// Structural input keeps discovery testable without importing the generated route
// tree (and its server functions, RSC entry points, and demo implementations).
interface CatalogRoute {
  id: string;
  fullPath: string;
  children?: readonly unknown[];
  lazyFn?: () => Promise<unknown>;
  options: {
    component?: unknown;
    staticData?: { page?: PageMetadata };
  };
}

const canonicalPath = (path: string) => path.replace(/\/+$/, "") || "/";

function humanize(path: string) {
  const segment = path.split("/").filter(Boolean).at(-1) ?? "";
  return segment
    .replace(/[-_]+/g, " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

/** Read initialized router routes, not modules; split components are never loaded. */
export function sectionPages(
  routes: Iterable<CatalogRoute>,
  section: string,
): CatalogPage[] {
  const prefix = canonicalPath(section);
  const pages = new Map<string, CatalogPage>();
  // Resolve duplicate URLs independently of route traversal/insertion order.
  const candidates = [...routes].sort((a, b) => a.id.localeCompare(b.id));
  for (const route of candidates) {
    const href = canonicalPath(route.fullPath);
    if (
      !href.startsWith(prefix + "/") ||
      href.includes("$") ||
      /^\/api(?:\/|$)/.test(href) ||
      route.children?.length ||
      (!route.options.component && !route.lazyFn) ||
      pages.has(href)
    )
      continue;

    const page = route.options.staticData?.page;
    pages.set(href, {
      href,
      name: page?.name ?? humanize(href),
      description: page?.description ?? "",
      date: page?.date,
      order: page?.order,
    });
  }
  return [...pages.values()].sort(
    (a, b) =>
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      a.name.localeCompare(b.name, "en") ||
      a.href.localeCompare(b.href),
  );
}

/** Listings and the document head consume the same page-owned copy. */
export function pageHead(page: PageMetadata, section?: string) {
  return {
    meta: [
      {
        title: [page.name, section, "Igor Bedesqui"]
          .filter(Boolean)
          .join(" — "),
      },
      ...(page.description
        ? [{ name: "description", content: page.description }]
        : []),
    ],
  };
}
