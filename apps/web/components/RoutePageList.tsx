import { ContentList, contentListRow } from "@/components/ContentList";
import { UnstyledLink } from "@/components/ui/primitives";
import type { CatalogPage } from "@/lib/route-catalog";

export function RoutePageList({ pages }: { pages: readonly CatalogPage[] }) {
  return (
    <ContentList className="-mx-2">
      {pages.map((page) => (
        <li key={page.href}>
          <UnstyledLink className={contentListRow} href={page.href}>
            <h2 className="font-bold">{page.name}</h2>
            {page.description && <p>{page.description}</p>}
            {page.date && (
              <span className="text-xs ak-ink-60">{page.date}</span>
            )}
          </UnstyledLink>
        </li>
      ))}
    </ContentList>
  );
}
