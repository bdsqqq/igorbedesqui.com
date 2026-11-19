import { createFileRoute } from "@tanstack/react-router";
import { RoutePageList } from "@/components/RoutePageList";
import { pageHead } from "@/lib/route-catalog";
import { useSectionPages } from "@/lib/use-section-pages";

const page = {
  name: "Writing",
  description: "Notes on design, development, and the things in between.",
};

export const Route = createFileRoute("/writing/")({
  component: WritingIndex,
  staticData: { page },
  head: () => pageHead(page),
});

function WritingIndex() {
  const pages = useSectionPages("/writing");
  return (
    <>
      <h1 className="font-semibold">Writing</h1>
      <p>{page.description}</p>
      <RoutePageList pages={pages} />
    </>
  );
}
