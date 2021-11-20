export default function Home() {
  const { t, lang } = useTranslation("now");

  return (
    <>
      <Seo t={t} lang={lang} />

      <Container backable key="index">
        {
          // Look into https://github.com/vinissimus/next-translate#7-nested-translations to loop through the entries
        }
      </Container>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
import HeroBand from "@/components/HeroBand";
import Projects from "@/components/ProjectStuff/Projects";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";
