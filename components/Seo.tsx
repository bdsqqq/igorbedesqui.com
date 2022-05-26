type withoutImage = {
  t: any;
  url?: string;
  lang?: string;
  imglang?: never;
  image?: never;
};
type withImage = {
  t: any;
  url?: string;
  lang?: string;
  imglang?: string;
  image: string;
};

const Seo: React.FC<withoutImage | withImage> = ({
  t,
  url,
  lang,
  image,
  imglang,
}) => {
  const og: OpenGraph = {
    type: "website",
    url: `https://www.igorbedesqui.com${lang != "en" ? "/" + lang : ""}${
      url ? "/" + url : ""
    }`,
    title: t("title"),
    description: t("description"),
    site_name: "Igor Bedesqui",
  };

  image &&
    Object.assign(og, {
      images: [
        {
          url: `https://www.igorbedesqui.com/images/og/${image}${
            imglang ? imglang : ""
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
      robotsProps={{
        notranslate: true,
      }}
      twitter={{
        handle: "@igorbdsq",
        site: "@site",
        cardType: "summary_large_image",
      }}
      languageAlternates={[
        {
          hrefLang: "pt",
          href: `https://www.igorbedesqui.com/pt${url ? "/" + url : ""}`,
        },
        {
          hrefLang: "en",
          href: `https://www.igorbedesqui.com${url ? "/" + url : ""}`,
        },
        {
          hrefLang: "x-default",
          href: `https://www.igorbedesqui.com${url ? "/" + url : ""}`,
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
