export default function ComponentsPage() {
  const { t, lang } = useTranslation("comps/common");
  const MasonryTranslation = useTranslation("comps/masonry");

  return (
    <>
      <Seo t={t} lang={lang} url="c" />
      <Container key="compsHome" backable>
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
import Band from "../../components/Band";
import Container from "../../components/Container";

import MasonryShell from "../../components/MasonryStuff/Shell";
