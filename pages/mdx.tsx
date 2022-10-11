import Container from "@/components/Container";
import Tooltip from "@/components/ui/Tooltip";
import useTranslation from "next-translate/useTranslation";

export default function Mdx() {
  console.log(enMeta);
  const { lang } = useTranslation();

  return (
    <Container>
      <Band headline={{ bold: "00", thin: "MDX" }}>
        {mdStuff[lang as "pt" | "en"].text}
      </Band>
    </Container>
  );
}

import { meta as enMeta, default as EnText } from "data/en/text.mdx";
import { meta as ptMeta, default as PtText } from "data/pt/text.mdx";
import Band from "@/components/Band";

const mdStuff = {
  en: {
    meta: enMeta,
    text: <EnText />,
  },
  pt: {
    meta: ptMeta,
    text: <PtText />,
  },
};
