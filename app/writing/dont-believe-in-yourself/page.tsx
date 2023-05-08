import Container from "@/components/Container";
import Band from "@/components/Band";

import { dontBelieveMeta } from "app/writing/metas";

import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import type { Metadata } from "next";
import { grid } from "@/components/ui/Grid";

const makeSeo = ({
  title,
  description,
  slug,
  ogText,
}: {
  title: string;
  description: string;
  slug: string;
  ogText: string;
}): Metadata => {
  const ogImageUrl = new URL(
    `https://www.igorbedesqui.com/api/og?text=${ogText}`
  ).href;

  return {
    title,
    description,
    twitter: {
      site: "@bdsqqq",
      creator: "@bdsqqq",
      // @ts-ignore
      card: "summary_large_image",
      title: title,
      description: description,
      image: ogImageUrl,
      imageAlt: ogText.replace("*", ""),
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://www.igorbedesqui.com${slug}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogText.replace("*", "").replace("/n", ""),
        },
      ],
    },
  };
};

export const metadata: Metadata = makeSeo({
  title: `${dontBelieveMeta.name} - Igor Bedesqui`,
  description: dontBelieveMeta.description,
  slug: `/writing/${dontBelieveMeta.urlSlug}`,
  ogText: `*${dontBelieveMeta.name}*;/n ${dontBelieveMeta.description}`,
});

export default async function Basics() {
  return (
    <Container key="basics" backable backAnchor="/writing">
      <Band id="01" gridless>
        <div className={grid()}>
          <div className="col-start-1 col-end-5 space-y-4 md:col-start-2 md:col-end-8 lg:col-start-5 lg:col-end-13">
            <MDX
              components={{
                Blur,
                blockquote: (props) => (
                  <blockquote
                    className="-indent-4 text-3xl text-gray-12 sm:-indent-6 sm:text-5xl"
                    {...props}
                  />
                ),
                strong: (props) => <span className="text-gray-12" {...props} />,
                em: (props) => (
                  <em className="italic text-gray-10" {...props} />
                ),
              }}
            >
              {`
               > “Don’t believe in yourself. Believe in the me that believes in you”
               
               Is a cheesy quote from an over the top animation that had way too much of an impact on me recently. 
               
               <br />
               Throughout my development, I had the privilege to consider a few people “mentors” and even if we didn’t talk frequently, their sheer existence made me grow. Of course, their direct input played a big role, but something maybe more important is the fact that **I can ignore my own limits by acknowledging that they trust me; Who the f<Blur>uck</Blur> am I to say that I can’t do something if THEY think I can?**
               
               Taking this idea further, I often find myself adding my own thoughts on top of things people I admire say or giving my own meaning to their words, somehow this makes me more confident in ideas that were my own to begin with. 
               
               _The people who make others grow the most didn’t master being meaningful, but presenting the opportunity for meaning._
               
               <br />
               I’ll eventually outgrow this, but right now, I’m happy to use such amazing people as facades that enable trust in myself, even if indirectly.
            `}
            </MDX>
          </div>
        </div>
      </Band>
    </Container>
  );
}
