import { meta as bebopMeta } from "data/work/bebop.mdx";
import { meta as issMeta } from "data/work/iss.mdx";
import { meta as wasmGifMeta } from "data/work/wasmgif.mdx";

import { meta as onWrittingMeta } from "./writing/on-writing";

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
        <div className="max-w-5xl mx-auto">
          <Band gridless id="hero">
            <div className="sm:grid grid-cols-4 flex flex-col gap-2">
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
            <div className="grid grid-cols-3">
              <div className="col-start-1 col-end-3">
                <Projects projectsMeta={projsMeta} />
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
                      <UnstyledLink href={`/writing/${onWrittingMeta.urlSlug}`}>
                        <h3>{onWrittingMeta.name}</h3>
                        <p>{onWrittingMeta.description}</p>
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
        </div>
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
