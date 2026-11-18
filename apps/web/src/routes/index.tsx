import { createFileRoute } from "@tanstack/react-router";
import { ContentList, contentListRow } from "@/components/ContentList";
import Container from "@/components/Container";
import Band from "@/components/Band";
import { UnstyledLink } from "@/ui/primitives/";
import EmailLink from "@/components/ui/EmailLink";
import { grid, subGrid } from "@/components/ui/Grid";
import { Blur } from "@/components/ui/Blur";
import StyledLink from "@/components/ui/StyledLink";
import { cn } from "@/lib/styling";

import { useSectionPages } from "@/lib/use-section-pages";

export const Route = createFileRoute("/")({
  component: Home,
});

/**
 * Home page — MDX-heavy sections inlined as JSX (tanstack routes are client components).
 *
 * The Next.js version uses an async `MDX` server component to compile
 * inline mdx strings. TanStack Start routes are client components, so
 * the small prose blocks are rendered as equivalent JSX here instead.
 * When the MDX component gets a client-safe variant, these can converge.
 */
function Home() {
  const writingPieces = useSectionPages("/writing");
  const projects = useSectionPages("/work");
  return (
    <Container key="index">
      <div className="flex flex-col gap-20">
        <Band gridless id="">
          <div className={cn(grid({ mode: "narrow" }), "mt-32")}>
            <div className="col-span-full md:col-start-2 md:col-end-7 lg:col-start-5 lg:col-end-12">
              <br />
              <h1 className="text-2xl ak-ink-100">
                <span className="col-span-full text-base ak-ink-85">
                  Igor Bedesqui
                </span>
                <p>
                  Crafting web experiences with care. Exploring design, UX, and
                  interactivity.
                </p>
              </h1>

              <p>
                Get in touch via{" "}
                <StyledLink href="https://www.twitter.com/bedesqui">
                  Twitter
                </StyledLink>{" "}
                or <EmailLink>email</EmailLink>, see my code on{" "}
                <StyledLink href="https://www.github.com/bdsqqq/">
                  Github
                </StyledLink>
                ,{" "}
                <Blur focusable={false} className="ak-ink-60">
                  or find me on{" "}
                  <StyledLink href="https://www.linkedin.com/in/igor-bedesqui/">
                    platforms I don&apos;t like using
                  </StyledLink>
                  .
                </Blur>
              </p>
            </div>
          </div>
        </Band>

        <Band
          headline={{ bold: "01", thin: "Work" }}
          options={{
            narrow: true,
          }}
        >
          <div className={subGrid()({ mode: "narrow" })}>
            <div className="col-span-full md:col-span-5 lg:col-span-6">
              <ContentList className="-mx-2 -mt-4">
                {projects.map((projMeta) => {
                  return (
                    <li key={projMeta.href}>
                      <UnstyledLink
                        className={contentListRow}
                        href={projMeta.href}
                      >
                        <div className="flex flex-col ">
                          <div>
                            <h3 className="inline-block font-bold">
                              {projMeta.name}
                            </h3>{" "}
                            <span className="text-bold inline-block transform text-end text-xs tracking-tighter ak-ink-85 transition-all duration-moderate-01 ease-productive-standard group-hover:translate-x-0 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100 md:-translate-x-4 md:opacity-0">
                              {projMeta.date}
                            </span>
                          </div>
                          <p>{projMeta.description}</p>
                        </div>
                      </UnstyledLink>
                    </li>
                  );
                })}
              </ContentList>
              <StyledLink href="/work">More work</StyledLink>
            </div>

            <div className="col-span-full lg:col-start-8 lg:col-end-12">
              <h2 className="mt-6 font-bold md:mt-10 lg:mt-0">Writing</h2>
              <div className="mt-2">
                <ContentList className="-mx-2 gap-4">
                  {writingPieces.map((piece) => (
                    <li key={piece.href}>
                      <UnstyledLink
                        className={cn(contentListRow, "py-0 leading-none")}
                        href={piece.href}
                      >
                        <h3 className="inline">{piece.name}</h3>
                        {piece.description.length > 0 && (
                          <>
                            <span>{" — "}</span>
                            <p className="inline text-xs">
                              {piece.description}
                            </p>
                          </>
                        )}
                      </UnstyledLink>
                    </li>
                  ))}
                </ContentList>
              </div>
            </div>
          </div>
        </Band>

        <Band
          headline={{ bold: "02", thin: "Now" }}
          options={{
            narrow: true,
          }}
        >
          <div className={subGrid()({ mode: "narrow" })}>
            <div className="col-span-4 col-start-1 row-start-1 -mt-6">
              <span className="text-xs font-bold tracking-tighter ak-ink-50">
                Last updated on <time>06 Oct 2023</time>
              </span>
            </div>
            <div className="col-span-6 col-start-1 row-start-1 flex flex-col gap-y-4 lg:col-end-10">
              <p>
                <Blur className="[&_strong]:ak-ink-50 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  Trying my hardest to heal my declining mental health,{" "}
                  <strong className="font-normal ak-ink-100 group-hover/blur:ak-ink-100 group-focus/blur:ak-ink-100">
                    one
                  </strong>{" "}
                  <del>small</del>{" "}
                  <strong className="font-normal ak-ink-100 group-hover/blur:ak-ink-100 group-focus/blur:ak-ink-100">
                    win at a time
                  </strong>
                  ,{" "}
                  <strong className="font-normal ak-ink-100 group-hover/blur:ak-ink-100 group-focus/blur:ak-ink-100">
                    every single day
                  </strong>
                  .
                </Blur>{" "}
                Figuring out how to balance all the aspects of my life without
                neglecting any of them.{" "}
                <Blur className="[&_strong]:ak-ink-50 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  Instead of hyper-focusing on a single one and neglecting
                  everything else as I usually do...
                </Blur>
              </p>

              <p>
                Now,{" "}
                <strong className="font-bold ak-ink-100">
                  I&apos;m focusing on the basics of my craft. The fine and
                  detailed polish I strive for will come as I build{" "}
                  <UnstyledLink
                    className="underline"
                    href="/writing/not-just-the-basics"
                  >
                    &ldquo;Just&rdquo; the basics
                  </UnstyledLink>{" "}
                  with care
                </strong>
                .{" "}
                <Blur className="[&_strong]:ak-ink-50 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  I hope…
                </Blur>
              </p>

              <p>
                Collaborating with amazing people,{" "}
                <Blur className="[&_strong]:ak-ink-50 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  convincing myself I belong among them.{" "}
                </Blur>{" "}
                Trying to make something worth stealing.{" "}
                <Blur className="[&_strong]:ak-ink-50 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  Naively trying to raise the bar for an industry, knowing that
                  I myself am below the current one.{" "}
                  <strong className="font-normal ak-ink-100 group-hover/blur:ak-ink-100 group-focus/blur:ak-ink-100">
                    I&apos;ll get there.
                  </strong>
                </Blur>
              </p>
            </div>
          </div>
        </Band>
      </div>
    </Container>
  );
}
