import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import Tooltip from "@/components/ui/Tooltip";
import type { Metadata } from "next";

import { psykipMeta, bebopMeta } from "../metas";
import { MDX } from "@/components/MDX";

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
  title: "The Manual",
  description: "",
  slug: "/work/the-manual",
  ogText: "",
});

export default async function WasmGif() {
  return (
    <ProjectContainer key="wasmGifProj" backMessage={psykipMeta.backMessage}>
      <HeroBand heroVideo="/videos/the-manual/cat">
        <span className="text-gray-12">
          The best way to read the Enchiridion.
        </span>
        <div className="mt-6">
          <CodeAndDemoButtons
            codeUrl="https://github.com/bdsqqq/psykip"
            demoUrl="https://psykip.vercel.app/"
          />
        </div>
      </HeroBand>
      <div className="mb-16" />

      <ProjectLayout projMeta={psykipMeta} nextProjMeta={bebopMeta}>
        <ProjectBand headline={{ bold: "01", thin: "Why?" }}>
          <MDX>
            {`
               The Enchiridion is a fascinating book, an easy read filled with valuable insights. Unfortunately—even with multiple public domain translations—reading it can often be a bad experience.

               Between old and sometimes confusing terms, hard to find and even harder to download files, and outdated websites, the barriers between an interested reader and this content are monumental. So, why not make a website that solves these problems?
            `}
          </MDX>
        </ProjectBand>
        <ProjectBand headline={{ bold: "02", thin: "How" }}>
          <MDX
            components={{
              ol: (props) => (
                <ol
                  className="list-decimal list-outside marker:text-gray-8 space-y-2"
                  {...props}
                />
              ),
            }}
          >
            {`
              1. I focused my efforts on design. While the content is the reason I built this site, it's user experience that solves the problems listed above. The way we allow you to interact with the Enchiridion is why this is the best way to read it.
              1. Even though some translations aren't the best for everyone, they might be my favorites, so instead of pushing for one or another, I made it easy to read the one that works for you.
              1. Books are hard to share, and with multiple file types that work for different devices with different applications, a project like this can grow out of control fast. That's why I took a step back and decided to serve the content from each translation in a way that's easy to read and share; nothing more, nothing less.
            `}
          </MDX>
        </ProjectBand>
        <div className="hidden">
          <ProjectBand headline={{ bold: "03", thin: "Design" }}>
            <MDX>
              {`
              ### Goals
              ### Content first
            `}
            </MDX>
          </ProjectBand>
          <ProjectBand headline={{ bold: "04", thin: "Development" }}>
            <MDX>
              {`
              ### Becoming glazingly fast

              Dealing manually with the hundreds of markdown files was out of the table as soon as I defined the project’s scope, but if I’m not cropping, formatting, and naming every file, how would they be ready for the app? Enter **automation**, it’s no secret developers love to automate mundane tasks so I felt this was the perfect opportunity to scratch an itch I had for months and learn a Blazingly fast™ general-purpose language. Of all of the options, one stood out as an easy yet powerful contestant: Golang has an easy typescript-like syntax and would chew through my use case as if it was nothing.

              With a poorly written first Go script, the Twitter thread that documents this project’s creation was born, and another one followed suit as I needed to bulk edit the files once more during the process. While using a new language was unnecessary and all the tasks could be done with Typescript, the feeling of learning something from scratch to solve problems is unmatched and honestly, a lot of fun!

              ### Incremental enhancement

              ### Responsive
              `}
            </MDX>
          </ProjectBand>
          <ProjectBand headline={{ bold: "05", thin: "Results" }}>
            <MDX>
              {`
               424 chapters,

               8 translations,
               
               490 pages,
               
               13200 dom elements in a page,
               
               straight 100s in Lighthouse,
               
               build times on vercel?

               ### Screenshots

               ### Testimonials

               https://clips.twitch.tv/PuzzledCredulousWerewolfDoubleRainbow-MMiwIWFES531KU-u
              `}
            </MDX>
          </ProjectBand>
        </div>
        <ProjectBand headline={{ bold: "03", thin: "Attributions" }}>
          <MDX
            components={{
              ul: (props) => (
                <ul
                  className="list-disc list-outside marker:text-gray-8"
                  {...props}
                />
              ),
            }}
          >
            {`
              - Epictetus Version from [el.wikisource.org](https://el.wikisource.org/wiki/%CE%95%CE%B3%CF%87%CE%B5%CE%B9%CF%81%CE%AF%CE%B4%CE%B9%CE%BF%CE%BD)
              - Elizabeth Carter Translation from [mit.edu](http://classics.mit.edu/Epictetus/epicench.html)
              - George Long Translation from [wikisource.org](http://en.wikisource.org/wiki/Enchiridion)
              - P.E. Matheson Translation from [letsreadgreek.com](http://www.letsreadgreek.com/epictetus/mattheson.htm)
              - Stephen Walton Translation from [ideonautics.net](http://www.ideonautics.net/manual2.htm)
              - T.W. Higginson Translation from [tufts.edu](http://www.perseus.tufts.edu/hopper/text?doc=urn:cts:greekLit:tlg0557.tlg002.perseus-eng2:1)
              - T.W. Rolleston Translation from [letsreadgreek.com](http://www.letsreadgreek.com/epictetus/rolleston.htm)
              - William Abbott Oldfather Translation from [en.wikisource.org](https://en.wikisource.org/wiki/Epictetus,_the_Discourses_as_reported_by_Arrian,_the_Manual,_and_Fragments/Manual)
              <br/>
              I took eight markdown files from [Tasuki's website](https://enchiridion.tasuki.org/), then updated their metadata and divided them into 424 files for the individual chapters. My versions of the files are available on [Github](https://github.com/bdsqqq/psykip/tree/master/src/data).
            `}
          </MDX>
        </ProjectBand>
      </ProjectLayout>
    </ProjectContainer>
  );
}
