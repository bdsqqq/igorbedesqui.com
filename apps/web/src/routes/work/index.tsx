import { createFileRoute } from "@tanstack/react-router";
import { ContentList, contentListRow } from "@/components/ContentList";
import Container from "@/components/Container";
import { grid } from "@/components/ui/Grid";
import Band from "@/components/Band";
import { UnstyledLink } from "@/components/ui/primitives";
import HeroBand from "@/components/HeroBand";
import { cn } from "@/lib/styling";

import { useSectionPages } from "@/lib/use-section-pages";
import { pageHead } from "@/lib/route-catalog";

const page = {
  name: "Work",
  description: "Selected work by Igor Bedesqui.",
};

function WorkIndexPage() {
  const projects = useSectionPages("/work");
  return (
    <Container backable>
      <HeroBand>
        <span className="font-semibold">Work</span>
      </HeroBand>
      <Band gridless id="01">
        <div className={grid()}>
          <div className="col-span-full">
            <ContentList className="-mx-4 grid grid-cols-4 md:grid-cols-8 lg:grid-cols-16">
              {projects.map((p) => {
                return (
                  <li className="col-span-4 lg:col-span-8" key={p.href}>
                    <UnstyledLink
                      className={cn(contentListRow, "px-4")}
                      href={p.href}
                    >
                      <div className="flex flex-col ">
                        <div>
                          <h2 className="inline-block font-bold">{p.name}</h2>{" "}
                          <span className="text-bold inline-block transform text-end text-xs tracking-tighter ak-ink-85 transition-all duration-moderate-01 ease-productive-standard group-hover:translate-x-0 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100 md:-translate-x-4 md:opacity-0">
                            {p.date}
                          </span>
                        </div>
                        <p>{p.description}</p>
                      </div>
                    </UnstyledLink>
                  </li>
                );
              })}
            </ContentList>
          </div>
        </div>
      </Band>
    </Container>
  );
}

export const Route = createFileRoute("/work/")({
  component: WorkIndexPage,
  staticData: { page },
  head: () => pageHead(page),
});
