export default function Custom404() {
  const { t } = useTypeSafeTranslation("common");

  return (
    <Container backable>
      <HeroBand heroVideo={"/videos/404/zoro-lost"}>
        <Trans text={t("404")} />
      </HeroBand>
    </Container>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";

import Trans from "@/components/i18nStuff/TransWithComps";
import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
