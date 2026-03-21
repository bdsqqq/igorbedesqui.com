import { createFileRoute } from "@tanstack/react-router";
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
            <p className="mt-2 text-gray-11">Component experiments, primitives, and notes.</p>
          </div>

          <ul className="col-span-full md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-12 pointer-events-none flex flex-col focus-within:text-gray-10 hover:text-gray-10">
            {libraryEntries.map((entry) => (
              <li key={entry.href}>
                <UnstyledLink
                  className="group pointer-events-auto block py-4 transition-colors duration-fast-02 ease-productive-standard hover:text-gray-12 focus:text-gray-12"
                  href={entry.href}
                >
                  <h2 className="font-bold">{entry.name}</h2>
                  <p>{entry.description}</p>
                </UnstyledLink>
              </li>
            ))}
          </ul>
        </div>
      </Band>
    </Container>
  );
}
