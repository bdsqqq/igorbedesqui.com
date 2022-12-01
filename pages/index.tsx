import { meta as bebopMeta } from "data/work/bebop.mdx";
import { meta as issMeta } from "data/work/iss.mdx";
import { meta as wasmGifMeta } from "data/work/wasmgif.mdx";

export default function Home() {
  const projsMeta = [bebopMeta, issMeta, wasmGifMeta];

  return (
    <>
      <Seo
        title="Igor Bedesqui — Web Developer"
        description="front-end Web Developer based in Lisbon"
      />

      <Container key="index">
        <HeroBand>
          <span className="font-light text-xl md:text-2xl">Hello — </span>
          <br />
          <br />
          My name is <strong>Igor Bedesqui</strong>, I’m a web developer based
          in Lisbon
        </HeroBand>
        <Band headline={{ bold: "01", thin: "Who am I?" }}>
          <p className="text-xl md:text-2xl">
            In a few words:
            <br />
            <br />
            I’m passionate about design, UX and interactivity. Professionally I
            create <strong>simple</strong>, <strong>functional</strong>, and{" "}
            <strong>beautiful</strong> solutions.
            <br />
            <br />
            For kinda up to date info you can see what I’m doing{" "}
            <StyledLink href="/now">now</StyledLink>.
          </p>
        </Band>
        <Band headline={{ bold: "02", thin: "Work" }}>
          <Projects projectsMeta={projsMeta} />
        </Band>
        <Band headline={{ bold: "hey", thin: "Let's connect!" }}>
          <p className="text-xl md:text-2xl">
            You can find me on various platforms that I don’t really like using,
            see my code at{" "}
            <StyledLink href="https://github.com/bdsqqq">Github</StyledLink> or
            get in touch via{" "}
            <StyledLink href="https://twitter.com/bedesqui">twitter</StyledLink>
            .
          </p>
        </Band>
      </Container>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
import Projects from "@/components/ProjectStuff/Projects";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";
