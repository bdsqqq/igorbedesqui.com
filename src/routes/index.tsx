import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/Container";
import Band from "@/components/Band";
import { UnstyledLink } from "@/ui/primitives/";
import EmailLink from "@/components/ui/EmailLink";
import { grid, subGrid } from "@/components/ui/Grid";
import { Blur } from "@/components/ui/Blur";
import StyledLink from "@/components/ui/StyledLink";
import { cn } from "@/lib/styling";

import { bebopMeta, psykipMeta, ibmMeta } from "app/work/metas";
import { dontBelieveMeta } from "./writing/dont-believe-in-yourself";
import { macosRice } from "./writing/macos-rice/route";
import { basicsMeta } from "./writing/not-just-the-basics";
import { onWritingMeta } from "./writing/on-writing";
import { schrodingerMinimalism } from "./writing/schrodinger-minimalism/route";

const writingPieces = [
  macosRice,
  schrodingerMinimalism,
  onWritingMeta,
  basicsMeta,
  dontBelieveMeta,
];
const projsMeta = [ibmMeta, psykipMeta, bebopMeta];

export const Route = createFileRoute("/")({
  component: Home,
});

/**
 * Home page — mirrors `app/page.tsx` with MDX content inlined as JSX.
 *
 * The Next.js version uses an async `MDX` server component to compile
 * inline mdx strings. TanStack Start routes are client components, so
 * the small prose blocks are rendered as equivalent JSX here instead.
 * When the MDX component gets a client-safe variant, these can converge.
 */
function Home() {
  return (
    <Container key="index">
      <div className="flex flex-col gap-20">
        <Band gridless id="">
          <div className={cn(grid({ mode: "narrow" }), "mt-32")}>
            <div className="col-span-full md:col-start-2 md:col-end-7 lg:col-start-5 lg:col-end-12">
              <br />
              <h1 className="text-2xl text-gray-12">
                <span className="col-span-full text-base text-gray-11">
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
                <Blur focusable={false} className="text-gray-09">
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
              <ul className=" pointer-events-none -mt-4 flex flex-col focus-within:text-gray-10 hover:text-gray-10">
                <li>
                  <div className="group pointer-events-auto block py-4 transition-colors duration-fast-02 ease-productive-standard focus-within:text-gray-12 hover:text-gray-12">
                    <div className="flex flex-col ">
                      <div>
                        <h3 className="inline-block font-bold">
                          <StyledLink href="https://axiom.co">Axiom</StyledLink>
                        </h3>{" "}
                        <span className="text-bold inline-block transform text-end text-xs tracking-tighter text-gray-11 transition-all duration-moderate-01 ease-productive-standard group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:translate-x-0 group-hover:opacity-100 md:-translate-x-4 md:opacity-0">
                          2023 ~ now
                        </span>
                      </div>
                      <p>
                        Raising the bar for observability, security, and
                        analytics.
                      </p>
                    </div>
                  </div>
                </li>

                {projsMeta.map((projMeta) => {
                  return (
                    <li key={projMeta.shortName}>
                      <UnstyledLink
                        className="group pointer-events-auto block py-4 transition-colors duration-fast-02 ease-productive-standard hover:text-gray-12 focus:text-gray-12"
                        href={`/work/${projMeta.urlSlug}`}
                      >
                        <div className="flex flex-col ">
                          <div>
                            <h3 className="inline-block font-bold">
                              {projMeta.name}
                            </h3>{" "}
                            <span className="text-bold inline-block transform text-end text-xs tracking-tighter text-gray-11 transition-all duration-moderate-01 ease-productive-standard group-hover:translate-x-0 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100 md:-translate-x-4 md:opacity-0">
                              {projMeta.date}
                            </span>
                          </div>
                          <p>{projMeta.description}</p>
                        </div>
                      </UnstyledLink>
                    </li>
                  );
                })}
              </ul>
              <StyledLink href="/work">More work</StyledLink>
            </div>

            <div className="col-span-full lg:col-start-8 lg:col-end-12">
              <h2 className="mt-6 font-bold md:mt-10 lg:mt-0">Writing</h2>
              <div className="mt-2">
                <ul className="pointer-events-none flex flex-col gap-4 focus-within:text-gray-10 hover:text-gray-10">
                  {writingPieces.map((piece) => (
                    <li key={piece.urlSlug}>
                      <UnstyledLink
                        className="pointer-events-auto block w-fit leading-none transition-colors duration-fast-02 ease-productive-standard hover:text-gray-12 focus:text-gray-12"
                        href={`/writing/${piece.urlSlug}`}
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
                </ul>
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
              <span className="text-xs font-bold tracking-tighter text-gray-08">
                Last updated on <time>06 Oct 2023</time>
              </span>
            </div>
            <div className="col-span-6 col-start-1 row-start-1 flex flex-col gap-y-4 lg:col-end-10">
              <p>
                <Blur className="[&_strong]:text-gray-08 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  Trying my hardest to heal my declining mental health,{" "}
                  <strong className="font-normal text-gray-12 group-hover/blur:text-gray-12 group-focus/blur:text-gray-12">
                    one
                  </strong>{" "}
                  <del>small</del>{" "}
                  <strong className="font-normal text-gray-12 group-hover/blur:text-gray-12 group-focus/blur:text-gray-12">
                    win at a time
                  </strong>
                  ,{" "}
                  <strong className="font-normal text-gray-12 group-hover/blur:text-gray-12 group-focus/blur:text-gray-12">
                    every single day
                  </strong>
                  .
                </Blur>{" "}
                Figuring out how to balance all the aspects of my life without
                neglecting any of them.{" "}
                <Blur className="[&_strong]:text-gray-08 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  Instead of hyper-focusing on a single one and neglecting
                  everything else as I usually do...
                </Blur>
              </p>

              <p>
                Now,{" "}
                <strong className="font-bold text-gray-12">
                  I&apos;m focusing on the basics of my craft. The fine and
                  detailed polish I strive for will come as I build{" "}
                  <UnstyledLink href={`/writing/${basicsMeta.urlSlug}`}>
                    &ldquo;Just&rdquo; the basics
                  </UnstyledLink>{" "}
                  with care
                </strong>
                .{" "}
                <Blur className="[&_strong]:text-gray-08 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  I hope…
                </Blur>
              </p>

              <p>
                Collaborating with amazing people, convincing myself I belong
                among them. Trying to make something worth stealing at{" "}
                <StyledLink href="https://www.axiom.co/">axiom</StyledLink>.{" "}
                <Blur className="[&_strong]:text-gray-08 [&_strong]:transition-colors [&_strong]:duration-moderate-02 [&_strong]:ease-productive-standard">
                  Naively trying to raise the bar for an industry, knowing that
                  I myself am below the current one.{" "}
                  <strong className="font-normal text-gray-12 group-hover/blur:text-gray-12 group-focus/blur:text-gray-12">
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
