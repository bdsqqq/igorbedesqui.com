import { createFileRoute } from "@tanstack/react-router";
import { ContentList, contentListRow } from "@/components/ContentList";
import Band from "@/components/Band";
import Container from "@/components/Container";
import { grid } from "@/components/ui/Grid";
import { UnstyledLink } from "@/components/ui/primitives";
import { cn } from "@/lib/styling";

const libraryEntries = [
  {
    href: "/library/button",
    name: "Button",
    description: "Button primitive permutations, composition, and source.",
  },
  {
    href: "/library/portals",
    name: "Portals",
    description: "Portal helpers, examples, and source.",
  },
];

export const Route = createFileRoute("/library/")({
  component: LibraryPage,
  head: () => ({
    meta: [
      { title: "Library — Igor Bedesqui" },
      {
        name: "description",
        content: "Component library and utilities.",
      },
    ],
  }),
});

function LibraryPage() {
  return (
    <Container backable>
      <Band gridless id="">
        <div className={cn(grid(), "gap-y-6")}>
          <div className="col-span-full md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-10">
            <h1 className="font-semibold">Library</h1>
            <p className="mt-2 ak-ink-80">
              Component experiments, primitives, and notes.
            </p>
          </div>

          <div className="col-span-full md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-12">
            <ContentList className="-mx-2">
              {libraryEntries.map((entry) => (
                <li key={entry.href}>
                  <UnstyledLink className={contentListRow} href={entry.href}>
                    <h2 className="font-bold">{entry.name}</h2>
                    <p>{entry.description}</p>
                  </UnstyledLink>
                </li>
              ))}
            </ContentList>
          </div>
        </div>
      </Band>
    </Container>
  );
}
