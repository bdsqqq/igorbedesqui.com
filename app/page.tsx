import Container from "@/components/Container";
import Band from "@/components/Band";
import { UnstyledLink } from "@/ui/primitives/";
import EmailLink from "@/components/ui/EmailLink";
import { grid, subGrid } from "@/components/ui/Grid";
import { cx } from "class-variance-authority";

import { bebopMeta, issMeta, wasmGifMeta, ibmMeta } from "app/work/metas";

import { meta as onWrittingMeta } from "pages/writing/on-writing";
import { meta as justBasicsMeta } from "pages/writing/not-just-the-basics";
import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import type { Metadata } from "next";

const writingPieces = [onWrittingMeta, justBasicsMeta];
const projsMeta = [ibmMeta, bebopMeta, issMeta, wasmGifMeta];

const makeSeo = ({
  title,
  description,
  slug,
  ogText,
}: {
  title: string;
  description: string;
  slug: string;
  ogText: string;
}): Metadata => {
  const ogImageUrl = new URL(
    `https://www.igorbedesqui.com/api/og?text=${ogText}`
  ).href;

  return {
    title,
    description,
    twitter: {
      site: "@bdsqqq",
      creator: "@bdsqqq",
      // @ts-ignore
      card: "summary_large_image",
      title: title,
      description: description,
      image: ogImageUrl,
      imageAlt: ogText.replace("*", ""),
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://www.igorbedesqui.com${slug}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogText.replace("*", "").replace("/n", ""),
        },
      ],
    },
  };
};

export const metadata: Metadata = makeSeo({
  title: "Igor Bedesqui",
  description:
    "Developer Based in Lisbon. Crafting solutions. Building web experiences with care. Exploring design, UX, and interactivity.",
  slug: "/",
  ogText:
    "*Crafting solutions*./n*Building web experiences*/n*with care*. *Exploring design*,/n*UX*, and *interactivity*.",
});

export default async function Home() {
  return (
    <Container key="index">
      <div className="flex flex-col gap-20">
        <Band gridless id="">
          <div className={cx(grid({ mode: "narrow" }), "mt-32")}>
            <div className="col-span-full md:col-end-8 lg:col-start-2 lg:col-end-13">
              <br />
              <h1 className="text-2xl text-gray-12">
                <span className="col-span-full text-base text-gray-11">
                  Igor Bedesqui
                </span>
                <p>
                  Crafting solutions. Building web experiences with care.
                  Exploring design, UX, and interactivity.
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

        <Band headline={{ bold: "01", thin: "Work" }}>
          <div className={subGrid()({ mode: "narrow" })}>
            <ul className="col-span-full md:col-span-5 lg:col-span-8 flex flex-col -mt-4 hover:text-gray-10 focus-within:text-gray-10 pointer-events-none">
              {projsMeta.map((projMeta) => {
                return (
                  <li key={projMeta.shortName}>
                    <UnstyledLink
                      className="block py-4 pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard group"
                      href={`/work/${projMeta.urlSlug}`}
                    >
                      <div className="flex flex-col ">
                        <div>
                          <h3 className="inline-block font-bold">
                            {projMeta.name}
                          </h3>{" "}
                          <span className="inline-block text-xs text-bold tracking-tighter text-gray-11 text-end md:opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform md:-translate-x-4 group-hover:translate-x-0 group-focus:translate-x-0 transition-all duration-moderate-01 ease-productive-standard">
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
            <div className="col-span-full lg:col-start-10 lg:col-end-15">
              <h2 className="mt-6 md:mt-10 lg:mt-0 font-bold">Writing</h2>
              <div className="mt-2">
                <ul className="flex flex-col gap-4 hover:text-gray-10 focus-within:text-gray-10 pointer-events-none">
                  {writingPieces.map((piece) => (
                    <li key={piece.urlSlug}>
                      <UnstyledLink
                        className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard leading-none w-fit"
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

                {/* <div className="mt-8 leading-none">
                    <StyledLink href="/writing">All writing</StyledLink>{" "}
                    <span>{" — "}</span>
                    <span className="text-xs">{` Infrenquent thoughts on design and code.`}</span>
                  </div> */}
              </div>
            </div>
          </div>
        </Band>

        <Band headline={{ bold: "02", thin: "Now" }}>
          <div className={subGrid()({ mode: "narrow" })}>
            <div className="col-start-1 row-start-1 col-span-4 -mt-6">
              <span className="text-xs font-bold tracking-tighter text-gray-8">
                Last updated in <time>22 Dec 2022</time>
              </span>
            </div>
            <div className="col-start-1 col-span-6 lg:col-end-13 row-start-1 flex flex-col gap-y-4">
              <MDX
                components={{
                  Blur,
                  strong: (props) => (
                    <span className="text-gray-12" {...props} />
                  ),
                }}
              >
                {`
                  Now, **I'm focusing on the basics of my craft. The fine and detailed polish I strive for will come as I build [“Just” the basics](/writing/${justBasicsMeta.urlSlug}) with care**. <Blur>I hope…</Blur>

                  Getting used to life in a new continent, missing my partner, and trying to find a new home.
                  
                  Going through my past notes, **giving a new life to old projects**.
                `}
              </MDX>
            </div>
          </div>
        </Band>
      </div>
    </Container>
  );
}
