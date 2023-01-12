const Seo: React.FC<{
  title: string;
  description: string;
  url?: string;
  ogText: string;
}> = ({ title, description, url, ogText }) => {
  const og: OpenGraph = {
    type: "website",
    url: `https://www.igorbedesqui.com${url ? "/" + url : ""}`,
    title: title,
    description: description,
    site_name: "Igor Bedesqui",
  };

  Object.assign(og, {
    images: [
      {
        url: new URL(`https://www.igorbedesqui.com/api/og?text=${ogText}`),
        width: 1200,
        height: 630,
        alt: ogText,
      },
    ],
  });

  console.table(og);
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={og}
      robotsProps={{
        notranslate: true,
      }}
      twitter={{
        handle: "@igorbdsq",
        site: "@site",
        cardType: "summary_large_image",
      }}
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
