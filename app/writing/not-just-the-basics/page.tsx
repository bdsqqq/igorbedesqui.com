import Container from "@/components/Container";
import Band from "@/components/Band";

import { basicsMeta } from "app/writing/metas";

import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import type { Metadata } from "next";

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
  title: `${basicsMeta.name} - Igor Bedesqui`,
  description: basicsMeta.description,
  slug: `/writing/${basicsMeta.urlSlug}`,
  ogText: `*${basicsMeta.name}*;/n ${basicsMeta.description}`,
});

export default async function Basics() {
  return (
    <Container key="basics" backable backAnchor="/writing">
      <Band id="01" gridless>
        <div className="max-w-prose mx-auto space-y-4">
          <MDX
            components={{
              Blur,
              strong: (props) => <span className="text-gray-12" {...props} />,
              h1: (props) => (
                <h1 className="text-2xl text-gray-12 mb-8" {...props} />
              ),
              del: (props) => (
                <span aria-hidden className="hidden" {...props} />
              ),
            }}
          >
            {`
               # ${basicsMeta.name}

               **Being smart, creative, and innovative is important, but ignoring the risks that come with it is irresponsible; Allowing yourself to make big mistakes is an inherent part of the creative process.**

               But I digress, I’m not here to talk about innovation, **this is about the often undervalued simple approach**. Despite the popularity of minimalism and the general idea that "[perfection is achieved when there is nothing left to take away](https://www.goodreads.com/quotes/19905-perfection-is-achieved-not-when-there-is-nothing-more-to)", **we often downplay the value of the basics in various disciplines by using the word "just"**.

               In one of my favorite books, "Zen and the Art of Motorcycle Maintenance", the author discusses this concept, arguing that **by removing “just” from our language, we can better understand and accept the true meaning of sentences**; “Just the basics” becomes “the fundamentals”.

               **The consistent execution of fundamentals builds the foundation that serves as a safety net to allow innovation in the long term.**

               Now, **I'm focusing on the basics of my craft. The fine and detailed polish I strive for will come as I build “Just” the basics with care.** <Blur>I hope...</Blur>

               ~~Why are you looking here?? well, With the important concept out of the way, it's time to talk about silly games.~~

               ~~For a long time I played League with my friends, and this year, despite not being good at the game, we tried to climb the competitive ranks less than a month before the end of the season. The strategy I chose and forced my friends to adopt was repeating the phrase “Just the basic” every couple of seconds as a meme and actually executing just the basics in the game, nothing fancy other than trying to not make mistakes. In the 10 games I played, we won 9; In an incredibly scientific effort, I stopped playing with them and saw the win streak end, it seems like there was a direct relation between playing a simple game of fundamentals and the statistical anomaly of a 90% win rate. If you came here for League tips: don’t die, farm well, and focus on objectives; Getting enough of an advantage will allow you to risk making mistakes.~~
            `}
          </MDX>
        </div>
      </Band>
    </Container>
  );
}