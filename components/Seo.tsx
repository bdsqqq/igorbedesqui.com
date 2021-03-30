import { Translate } from "next-translate";
interface Props {
  t: Translate;
  lang?: string;
}

const Seo: React.FC<Props> = ({ t, lang }) => {
  return (
    <NextSeo
      title={t("title")}
      description={t("description")}
      openGraph={{
        type: "website",
        url: "https://igorbedesquidotcom.vercel.app/",
        title: t("title"),
        description: t("description"),
        images: [
          {
            url: "https://igorbedesquidotcom.vercel.app/images/og/home.jpg",
            width: 800,
            height: 600,
            alt: "Street lit by neon sign of a restaurant",
          },
        ],
        site_name: "Igor Bedesqui",
      }}
      twitter={{
        handle: "@igorbdsq",
        site: "@site",
        cardType: "summary_large_image",
      }}
      languageAlternates={[
        {
          hrefLang: "pt",
          href: "https://igorbedesquidotcom.vercel.app/pt",
        },
        {
          hrefLang: "en",
          href: "https://igorbedesquidotcom.vercel.app/",
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
