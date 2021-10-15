export default function About() {
  return (
    <>
      <NextSeo />
      <SocialProfileJsonLd
        type="Person"
        name="Igor Bedesqui"
        url="https://www.igorbedesqui.com"
        sameAs={["https://www.linkedin.com/in/igor-bedesqui/"]}
      />

      <Container key="index"></Container>
    </>
  );
}

import { NextSeo, SocialProfileJsonLd } from "next-seo";

import Container from "@/components/Container";
