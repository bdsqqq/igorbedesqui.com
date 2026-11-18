import { createFileRoute } from "@tanstack/react-router";
import { RoutePageList } from "@/components/RoutePageList";
import { useSectionPages } from "@/lib/use-section-pages";
import { pageHead } from "@/lib/route-catalog";
import Band from "@/components/Band";
import Container from "@/components/Container";
import { grid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";

const page = {
  name: "Library",
  description: "Component library and utilities.",
};

export const Route = createFileRoute("/library/")({
  component: LibraryPage,
  staticData: { page },
  head: () => pageHead(page),
});

function LibraryPage() {
  const libraryEntries = useSectionPages("/library");
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
            <RoutePageList pages={libraryEntries} />
          </div>
        </div>
      </Band>
    </Container>
  );
}
