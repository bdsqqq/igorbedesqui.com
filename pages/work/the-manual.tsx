import { bebopMeta } from "app/work/metas";

export default function TheManual({
  mdx,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Seo title="The Manual" description="" url="work/the-manual" ogText="" />

      <ProjectContainer key="the-manual">
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

        <ProjectLayout projMeta={meta} nextProjMeta={bebopMeta}>
          <ProjectBand headline={{ bold: "01", thin: "Why?" }}>
            <MDXRemote {...mdx.why} />
          </ProjectBand>
          <ProjectBand headline={{ bold: "02", thin: "How" }}>
            <MDXRemote
              {...mdx.how}
              components={{
                ol: (props) => (
                  <ol
                    className="list-decimal list-outside marker:text-gray-8 space-y-2"
                    {...props}
                  />
                ),
              }}
            />
          </ProjectBand>
          <ProjectBand headline={{ bold: "03", thin: "Attributions" }}>
            <MDXRemote
              {...mdx.attributions}
              components={{
                ul: (props) => (
                  <ul
                    className="list-disc list-outside marker:text-gray-8"
                    {...props}
                  />
                ),
              }}
            />
          </ProjectBand>
          <div className="hidden">
            <ProjectBand headline={{ bold: "03", thin: "Design" }}>
              <h3>Goals</h3>
              <h3>Content first</h3>
            </ProjectBand>
            <ProjectBand headline={{ bold: "04", thin: "Development" }}>
              <h3>Becoming blazingly fast(?)</h3>
              {`
              Dealing manually with the hundreds of markdown files was out of the table as soon as I defined the project’s scope, but if I’m not cropping, formatting, and naming every file, how would they be ready for the app? Enter **automation**, it’s no secret developers love to automate mundane tasks so I felt this was the perfect opportunity to scratch an itch I had for months and learn a Blazingly fast™ general-purpose language. Of all of the options, one stood out as an easy yet powerful contestant: Golang has an easy typescript-like syntax and would chew through my use case as if it was nothing.
            `}

              {`With a poorly written first Go script, the Twitter thread that documents this project’s creation was born, and another one followed suit as I needed to bulk edit the files once more during the process. While using a new language was unnecessary and all the tasks could be done with Typescript, the feeling of learning something from scratch to solve problems is unmatched and honestly, a lot of fun!`}
              <h3>Incremental enhancement</h3>
              <h3>Responsive</h3>
            </ProjectBand>
            <ProjectBand headline={{ bold: "05", thin: "Results" }}>
              {`
               424 chapters,

               8 translations,
               
               490 pages,
               
               13200 dom elements in a page,
               
               straight 100s in Lighthouse,
               
               build times on vercel?
            `}
              <br />
              <br />
              <h3>Screenshots</h3>
              <br />
              <h3>Testimonials(? What should I actually call this?)</h3>
              <StyledLink href="https://clips.twitch.tv/PuzzledCredulousWerewolfDoubleRainbow-MMiwIWFES531KU-u">
                https://clips.twitch.tv/PuzzledCredulousWerewolfDoubleRainbow-MMiwIWFES531KU-u
              </StyledLink>
            </ProjectBand>
          </div>
        </ProjectLayout>
      </ProjectContainer>
    </>
  );
}

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import HeroBand from "@/components/HeroBand";
import {
  ProjectLayout,
  ProjectBand,
} from "@/components/ProjectStuff/ProjectLayout";

import {
  mutateSerializeMdx,
  RecursiveSerialize,
} from "@/lib/mutateSerializeMdx";

import { MDXRemote } from "next-mdx-remote";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import StyledLink from "@/components/ui/StyledLink";

export const meta = {
  shortName: "the-manual",
  name: "The manual",
  description: "The best way to read The Enchiridion from Epictetus",
  roles: ["FrontEnd Developer", "UX/UI Designer"],
  type: "Personal",
  tools: [
    "Typescript",
    "Astro",
    "SolidJS",
    "TailwindCSS",
    "Partytown",
    "Golang",
    "Vercel",
  ],
  date: "2022",
  urlSlug: "the-manual",
  backMessage: "Back",
};

const MDs = {
  update: `
    <h2 className="text-xl font-bold text-gray-11 uppercase mb-2">
        Update
    </h2>
    On november 2nd 2021 I got a notification on my discord with the amazing news that this project had won the competition with the majority of votes. Now, I bask in the glory!! [I'll leave the screenshot of the announcement here because I'm very proud of this](https://raw.githubusercontent.com/bdsqqq/bebop-webjam/main/docs/img/winner.jpg).
  `,
  why: `
    The Enchiridion is a fascinating book, an easy read filled with valuable insights. Unfortunately—even with multiple public domain translations—reading it can often be a bad experience.
    <br/>
    Between old and sometimes confusing terms, hard to find and even harder to download files, and outdated websites, the barriers between an interested reader and this content are monumental. So, why not make a website that solves these problems?
  `,
  how: `
    1. I focused my efforts on design. While the content is the reason I built this site, it's user experience that solves the problems listed above. The way we allow you to interact with the Enchiridion is why this is the best way to read it.
    1. Even though some translations aren't the best for everyone, they might be my favorites, so instead of pushing for one or another, I made it easy to read the one that works for you.
    1. Books are hard to share, and with multiple file types that work for different devices with different applications, a project like this can grow out of control fast. That's why I took a step back and decided to serve the content from each translation in a way that's easy to read and share; nothing more, nothing less.
  `,
  attributions: `
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
  `,
  conclusion: `
      After working on this project I'm more confident in my ability to create a cool design and translate it to code. As well as working with design tools such as Adobe Illustrator and Photoshop when needed. I also had a chance to learn a new animation library called motion one and enjoyed every second of it.
      <br/>
      I liked the WebJam experience and will be looking forward to its future installments.
    `,
};

export const getStaticProps: GetStaticProps<{
  mdx: RecursiveSerialize<typeof MDs>;
}> = async () => {
  const mdx = await mutateSerializeMdx(MDs);
  return { props: { mdx } };
};
