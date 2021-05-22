export default function ComponentsPage() {
  const { t, lang } = useTranslation("comps/common");
  const MasonryTranslation = useTranslation("comps/masonry");

  return (
    <>
      <Seo t={t} lang={lang} url="c" />
      <Container key="compsHome" backable>
        <HeroBand>
          <TransWithComps i18nKey={"comps/common:heroTitle"} />
        </HeroBand>
        <Band headline={{ bold: "01", thin: t("masonryThin") }}>
          <MasonryShell
            t={MasonryTranslation.t}
            cardNumberControls
            columnNumberControls
            initialColumnNumber={3}
            initialCardAmount={7}
          />
        </Band>
      </Container>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";

import Seo from "../../components/Seo";
import HeroBand from "../../components/HeroBand";
import TransWithComps from "../../components/i18nStuff/TransWithComps";
import Band from "../../components/Band";
import Container from "../../components/Container";

import MasonryShell from "../../components/MasonryStuff/Shell";
