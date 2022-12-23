import { meta as bebopMeta } from "data/work/bebop.mdx";
import { meta as issMeta } from "data/work/iss.mdx";
import { meta as wasmGifMeta } from "data/work/wasmgif.mdx";

import { meta as onWrittingMeta } from "./writing/on-writing";
import { meta as justBasicsMeta } from "./writing/not-just-the-basics";

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
          <div className="sm:grid grid-cols-4 flex flex-col gap-2 md:gap-8">
            <h1>Igor Bedesqui</h1>
            <div className="md:col-span-2 col-span-3">
              <p>
                Crafting solutions. Building web experiences with care.
                Exploring design, UX, and interactivity.
              </p>
              <p>Previously at IBM</p>
            </div>
          </div>
        </Band>
        <Band headline={{ bold: "01", thin: "Work" }}>
          <div className="flex flex-col gap-2 md:grid grid-cols-3 md:gap-8">
            <div className="col-start-1 col-end-3">
              <ul className="flex flex-col -mt-4 hover:text-gray-10 pointer-events-none">
                {projsMeta.map((projMeta) => {
                  return (
                    <li key={projMeta.shortName}>
                      <UnstyledLink
                        className="block py-4 pointer-events-auto hover:text-gray-12 transition-colors duration-fast-02 ease-productive-standard group"
                        href={`/work/${projMeta.urlSlug}`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex gap-2 items-baseline">
                            <h3 className="inline text-2xl">{projMeta.name}</h3>
                            <span className="text-xs text-bold text-gray-11 md:opacity-0 group-hover:opacity-100 transform md:-translate-x-4 group-hover:translate-x-0 transition-all duration-moderate-01">
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
            </div>
            <div>
              <h2>Writing</h2>
              <div>
                <ul>
                  <li>
                    <UnstyledLink href={`/writing/${onWrittingMeta.urlSlug}`}>
                      <h3>{onWrittingMeta.name}</h3>
                      <p>{onWrittingMeta.description}</p>
                    </UnstyledLink>
                  </li>
                  <li>
                    <UnstyledLink href={`/writing/${justBasicsMeta.urlSlug}`}>
                      <h3>{justBasicsMeta.name}</h3>
                      <p>{justBasicsMeta.description}</p>
                    </UnstyledLink>
                  </li>
                </ul>

                <span>
                  <StyledLink href="/writing">All writing</StyledLink>
                  {` Infrenquent thoughts on design and code.`}
                </span>
              </div>
            </div>
          </div>
        </Band>
        <Band headline={{ bold: "02", thin: "Now" }}>
          <div className="flex flex-col gap-2 md:grid grid-cols-3 md:gap-8">
            <div className="col-start-3 col-end-4">
              <span className="text-xs font-bold">
                Last updated in <time>22 Dec 2022</time>
              </span>
            </div>
            <div className="col-start-1 col-end-3 row-start-1 flex flex-col gap-y-4">
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
