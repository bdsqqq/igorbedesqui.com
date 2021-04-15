interface withoutImage {
  t: Translate;
  url?: string;
  lang?: never;
  image?: never;
}
interface withImage {
  t: Translate;
  url?: string;
  lang?: string;
  image: string;
}

const Seo: React.FC<withoutImage | withImage> = ({ t, url, lang, image }) => {
  const og: OpenGraph = {
    type: "website",
    url: url ? url : "https://www.igorbedesqui.com",
    title: t("title"),
    description: t("description"),
    site_name: "Igor Bedesqui",
  };

  image &&
    Object.assign(og, {
      images: [
        {
          url: `https://www.igorbedesqui.com/images/og/${image}${
            lang ? lang : ""
          }.jpg`,
          width: 1200,
          height: 630,
          alt: t("ogAlt"),
        },
      ],
    });
  console.table(og);
  return (
    <NextSeo
      title={t("title")}
      description={t("description")}
      openGraph={og}
      twitter={{
        handle: "@igorbdsq",
        site: "@site",
        cardType: "summary_large_image",
      }}
      languageAlternates={[
        {
          hrefLang: "pt",
          href: "https://www.igorbedesqui.com/pt",
        },
        {
          hrefLang: "en",
          href: "https://www.igorbedesqui.com/",
        },
      ]}
      additionalMetaTags={[
        {
          property: "viewport",
          content: "initial-scale=1.0, width=device-width",
        },
        {
          httpEquiv: "x-ua-compatible",
          content: "IE=edge; chrome=1",
        },
      ]}
    />
  );
};

export default Seo;

import { NextSeo } from "next-seo";
import { OpenGraph } from "next-seo/lib/types";
import { Translate } from "next-translate";
