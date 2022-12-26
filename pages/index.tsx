import { meta as bebopMeta } from "data/work/bebop.mdx";
import { meta as issMeta } from "data/work/iss.mdx";
import { meta as wasmGifMeta } from "data/work/wasmgif.mdx";

import { meta as onWrittingMeta } from "./writing/on-writing";
import { meta as justBasicsMeta } from "./writing/not-just-the-basics";

const writingPieces = [onWrittingMeta, justBasicsMeta];

export default function Home() {
  const projsMeta = [bebopMeta, issMeta, wasmGifMeta];

  // Me, What I've done
  // Work
  // Writing
  // Now / connect

  return (
    <>
      <Seo
        title="Igor Bedesqui — Web Developer"
        description="front-end Web Developer based in Lisbon"
      />

      <Container key="index">
        <Band gridless id="hero">
          <div className={cx(grid({ mode: "narrow" }), "mt-16")}>
            <div className="col-span-full md:col-start-2 lg:col-end-13">
              <h1 className="col-span-full">Igor Bedesqui</h1>
              <br />
              <p className="text-2xl">
                Crafting solutions. Building web experiences with care.
                Exploring design, UX, and interactivity.
              </p>
              {/* <p className="text-2xl group">
                Previously delivering one of a kind experiences at IBM
                <span className="inline-block ml-2 text-xs text-gray-9 font-bold tracking-tighter opacity-0 transform -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  This goes out when I add IBM to the work section
                </span>
              </p> */}
            </div>
          </div>
        </Band>
        <Band headline={{ bold: "01", thin: "Work" }}>
          <div className={subGrid()({ mode: "narrow" })}>
            <ul className="col-span-full md:col-span-5 lg:col-span-8 flex flex-col -mt-4 hover:text-gray-10 pointer-events-none">
              {projsMeta.map((projMeta) => {
                return (
                  <li key={projMeta.shortName}>
                    <UnstyledLink
                      className="block py-4 pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard group"
                      href={`/p/${projMeta.urlSlug}`}
                    >
                      <div className="flex flex-col ">
                        <div>
                          <h3 className="inline-block text-xl font-bold">
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
              <h2 className="text-xl mt-6 md:mt-10 lg:-mt-9 font-bold">
                Writing
              </h2>
              <div className="mt-2">
                <ul className="flex flex-col gap-4">
                  {writingPieces.map((piece) => (
                    <li key={piece.urlSlug}>
                      <UnstyledLink
                        className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard leading-none w-fit"
                        href={`/writing/${piece.urlSlug}`}
                      >
                        <h3 className="inline">{piece.name}</h3>
                        <span>{" — "}</span>
                        <p className="inline text-xs">{piece.description}</p>
                      </UnstyledLink>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 leading-none">
                  <StyledLink href="/writing">All writing</StyledLink>{" "}
                  <span>{" — "}</span>
                  <span className="text-xs">{` Infrenquent thoughts on design and code.`}</span>
                </div>
              </div>
            </div>
          </div>
        </Band>
        <Band headline={{ bold: "02", thin: "Now" }}>
          <div className={subGrid()({ mode: "narrow" })}>
            <div className="lg:col-start-12 col-span-3">
              <span className="text-xs font-bold tracking-tighter">
                Last updated in <time>22 Dec 2022</time>
              </span>
            </div>
            <div className="col-span-10 lg:row-start-1 flex flex-col gap-y-4">
              <p>
                {`Now, `}
                <span className="text-gray-12">
                  {`I'm focusing on the basics of my craft. The fine and detailed polish I strive for will come as I build `}
                  <StyledLink
                    href={`/writing/${justBasicsMeta.urlSlug}`}
                  >{`“Just” the basics`}</StyledLink>{" "}
                  {`with care.`}{" "}
                </span>
                <span aria-hidden="true" className="text-transparent">
                  I hope...
                </span>
              </p>
              <p>
                {`Getting used to life in a new contient, missing my partner, and
                trying to find a new home.`}
              </p>
              <p>
                {`Going through my past notes, `}
                <span className="text-gray-12">{`giving a new life to old projects`}</span>
                {`.`}
              </p>
            </div>
          </div>
        </Band>
        {/* <Band headline={{ bold: "!!!", thin: "Grid" }}>
          <div className={cx(subGrid()({ mode: "narrow" }), "h-full")}>
            {[...Array(14)].map((_, i) => {
              return (
                <div
                  key={i}
                  className="bg-crimson9 bg-opacity-20 border-x border-gray-A6"
                >
                  <div className="bg-crimson9 bg-opacity-20 h-full w-full" />
                </div>
              );
            })}
          </div>
        </Band> */}
        <Band headline={{ bold: "Hey!", thin: "Let's connect" }}>
          {`Get in touch via `}
          <StyledLink href="twitter.com/bedesqui">{`Twitter`}</StyledLink>
          {` or `}
          <EmailLink>{`email`}</EmailLink>
          {`, see my code on `}
          <StyledLink href="github.com/bdsqqq/">{`Github`}</StyledLink>
          {`, or find me on `}
          <StyledLink href="https://www.linkedin.com/in/igor-bedesqui/">
            {`platforms I don’t like using`}
          </StyledLink>
          {`.`}
        </Band>
      </Container>
    </>
  );
}

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
import Projects from "@/components/ProjectStuff/Projects";
import { FABContainer, UnstyledLink } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";
import EmailLink from "@/components/ui/EmailLink";
import { grid, subGrid } from "@/components/ui/Grid";
import { cx } from "class-variance-authority";
