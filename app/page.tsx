import Container from "@/components/Container";
import Band from "@/components/Band";
import { UnstyledLink } from "@/ui/primitives/";
import EmailLink from "@/components/ui/EmailLink";
import { grid, subGrid } from "@/components/ui/Grid";

import { bebopMeta, psykipMeta, ibmMeta } from "app/work/metas";
import { basicsMeta, onWritingMeta, dontBelieveMeta } from "app/writing/metas";

import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import type { Metadata } from "next";
import StyledLink from "@/components/ui/StyledLink";
import { cn } from "@/lib/styling";

const writingPieces = [onWritingMeta, basicsMeta, dontBelieveMeta];
const projsMeta = [ibmMeta, psykipMeta, bebopMeta];

import { makeSeo } from "@/lib/makeSeo";

export const metadata: Metadata = makeSeo({
  title: "Igor Bedesqui",
  description:
    "Crafting web experiences with care. Exploring design, UX, and interactivity.",
  slug: "/",
  ogText:
    "*Crafting web experiences*/n*with care*. *Exploring design*,/n*UX*, and *interactivity*.",
});

export default async function Home() {
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

              <MDX
                components={{
                  EmailLink,
                  del: (props) => (
                    <Blur
                      focusable={false}
                      className="text-gray-9"
                      {...props}
                    />
                  ),
                }}
              >
                {`
                Get in touch via [Twitter](https://www.twitter.com/bedesqui) or <EmailLink>email</EmailLink>, see my code on [Github](https://www.github.com/bdsqqq/), ~~or find me on [platforms I don’t like using](https://www.linkedin.com/in/igor-bedesqui/).~~
                `}
              </MDX>
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
                            <span>{" — "}</span>
                            <p className="inline text-xs">
                              {piece.description}
                            </p>
                          </>
                        )}
                      </UnstyledLink>
                    </li>
                  ))}
                </ul>

                {/* <div className="mt-8 leading-none">
                    <StyledLink href="/writing">All writing</StyledLink>{" "}
                    <span>{" — "}</span>
                    <span className="text-xs">{` Infrenquent thoughts on design and code.`}</span>
                  </div> */}
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
              <span className="text-xs font-bold tracking-tighter text-gray-8">
                Last updated on <time>03 Mar 2023</time>
              </span>
            </div>
            <div className="col-span-6 col-start-1 row-start-1 flex flex-col gap-y-4 lg:col-end-10">
              <MDX
                components={{
                  Blur,
                  strong: (props) => (
                    <span className="text-gray-12" {...props} />
                  ),
                }}
              >
                {`
                  Now, **I'm focusing on the basics of my craft. The fine and detailed polish I strive for will come as I build [“Just” the basics](/writing/${basicsMeta.urlSlug}) with care**. <Blur>I hope…</Blur>

                  Collaborating with amazing people, convincing myself I belong among them.
                `}
              </MDX>
              <MDX
                components={{
                  Blur,
                  strong: (props) => (
                    <span
                      className="text-gray-8 transition-colors duration-moderate-02 ease-productive-standard group-hover/blur:text-gray-12 group-focus/blur:text-gray-12"
                      {...props}
                    />
                  ),
                }}
              >
                {`
                  Going insane over immigration stuff, missing my partner a lot. <Blur>Trying my hardest to heal my declining mental health, **one** ~~small~~ **win at a time**, **every single day**.</Blur>
                `}
              </MDX>
            </div>
          </div>
        </Band>
      </div>
    </Container>
  );
}
