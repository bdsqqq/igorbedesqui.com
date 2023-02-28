import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import PopOver from "@/components/ui/Popover";

import {
  mutateSerializeMdx,
  type RecursiveSerialize,
} from "@/lib/mutateSerializeMdx";

import { MDXRemoteWrapper as MDXRemote } from "./MDXRemoteWrapper";

import { bebopMeta } from "../poor_mans_cms";
// import { meta as issMeta } from "./iss";

const makeSeo = ({
  title,
  description,
  url,
  ogText,
}: {
  title: string;
  description: string;
  url: string;
  ogText: string;
}) => {
  const ogImageUrl = new URL(
    `https://www.igorbedesqui.com/api/og?text=${ogText}`
  );

  const ogStuff = {
    "twitter:card": "summary_large_image",
    "twitter:site": "@bdsqqq",
    "twitter:creator": "@bdsqqq",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": ogImageUrl,
    "og:url": new URL(`https://www.igorbedesqui.com${url}`),
    "og:title": title,
    "og:description": description,
    "og:image": ogImageUrl,
    "og:type": "website",
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": ogText,
  };

  const thingy = {
    title,
    description,
    canonical: url,
    ...ogStuff,
  };

  return thingy;
};

export const metadata = makeSeo({
  title:
    "The work, which becomes a new genre itself, will be called... COWBOY BEBOP",
  description: `${bebopMeta.description} — made by Igor Bedesqui`,
  url: "/work/bebop",
  ogText: `*The work*, which *becomes a new genre itself*, will be called... *COWBOY BEBOP*`,
});

const MDs = {
  update: `
     <h2 className="text-xl font-bold text-gray-11 uppercase mb-2">
         Update
     </h2>
     On november 2nd 2021 I got a notification on my discord with the amazing news that this project had won the competition with the majority of votes. Now, I bask in the glory!! [I'll leave the screenshot of the announcement here because I'm very proud of this](https://raw.githubusercontent.com/bdsqqq/bebop-webjam/main/docs/img/winner.jpg).
   `,
  why: {
    paragraph: `
     I made this project as an entry for the second installment of the <Popover content={popoverContent}>WebJam</Popover>.
     <br/>
     The challenge for this WebJam was to create a single page/non-scrollable site for a movie of my choosing. The site should work on any screen size and illustrate the movie.
   `,
    popover: `The **WebJam** is a hackathon where the participants try to create a website following a prompt and some rules`,
  },
  design: `
     My choice of movie was Cowboy Bebop, it's one of my favorites and screams personality with its artwork. The mix between Jazz, Noir, Western, and Space is unique and serves as a great source of inspiration for a website. 
     <br/>
     The main constraint for this exercise was space. I took inspiration from types of media with the same limitation such as posters, cover arts, and the TV show itself. After spending an uncomfortable amount of time rewatching the opening of Cowboy Bebop, I figured that I needed to include the iconic shots of silhouettes against bright-colored backgrounds. I even found one of the pieces that inspired the show's artists: the cover art for the film "Tokyo Drifter".
     <br/>
     At this point, I knew that I wanted something that could be mistaken for a poster when showing it to someone. I made a quick sketch on a piece of paper from my desk and started working.
   `,
  development: `
     Trying to avoid unnecessary complexity, I approached this project from a minimalist perspective, I created a plain HTML file with tailwindcss and made a responsive design with two major blocks, one for the text content and the other for the silhouette; In the second one, I took inspiration from the show's opening where we can find bits of a paragraph overlayed on the solid color to tell a history ending with the ambitious phrase that gives title to the website: "The work, which becomes a new genre itself, will be called... COWBOY BEBOP".
     <br/>
     It became clear that I would need to create media for this piece. I downloaded Adobe Illustrator for the first time in a couple of years to make figures to layer on my scene. Even though my initial plan to use the silhouette as a "mask" that contained the animated spaceship didn't work, I got the vibe I wanted by using a clip-path element to clip an image of stars I modified into the silhouette. Adding a simple animation to the smoke SVG and a trail to the otherwise boring spaceship gave life to this otherwise static poster.
     <br/>
     For the final touches, I allowed the title to break its box and overlap with the silhouette container creating that bit of spice the piece was missing. To add to the poster-like feeling I was going for, I added an image of wrinkled paper as an overlay with a CSS filter to make the entire thing look like something you would find glued to a wall and voilá.
   `,
  results: {
    intro: `
       You can see the website [clicking here](https://bebop-webjam.vercel.app/).
       or looking at some screenshots:
     `,
    conclusion: `
       After working on this project I'm more confident in my ability to create a cool design and translate it to code. As well as working with design tools such as Adobe Illustrator and Photoshop when needed. I also had a chance to learn a new animation library called motion one and enjoyed every second of it.
       <br/>
       I liked the WebJam experience and will be looking forward to its future installments.
     `,
  },
};

const issMeta = bebopMeta;

export default async function Bebop() {
  const mdx = await mutateSerializeMdx(MDs);

  return (
    <>
      {/* <Seo
        title="The work, which becomes a new genre itself, will be called... COWBOY BEBOP"
        description="My entry for, and winner of, the second installment of the WebJam — made by Igor Bedesqui"
        url="work/bebop"
        ogText="*The work*, which *becomes a new genre itself*, will be called... *COWBOY BEBOP*"
      /> */}

      <ProjectContainer key="bebopProj" backMessage={bebopMeta.backMessage}>
        <HeroBand heroVideo={"/videos/bebop/noodles"}>
          <span>
            <strong className="text-gray-12">The work</strong>, which{" "}
            <strong className="text-gray-12">becomes a new genre itself</strong>
            , will be called...{" "}
            <strong className="text-gray-12">COWBOY BEBOP</strong>
          </span>
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/bebop-webjam"
              demoUrl="https://bebop-webjam.vercel.app/"
            />
          </div>
        </HeroBand>
        <div className="mb-16" />

        <ProjectLayout projMeta={bebopMeta} nextProjMeta={issMeta}>
          <ProjectBand options={{ padding: "none" }} gridless id="update">
            <MDXRemote {...mdx.update} />
          </ProjectBand>
          <ProjectBand headline={{ bold: "01", thin: "Why?" }}>
            <MDXRemote
              {...mdx.why.paragraph}
              scope={{ popoverContent: <MDXRemote {...mdx.why.popover} /> }}
            />
          </ProjectBand>
          <ProjectBand headline={{ bold: "02", thin: "Design" }}>
            <MDXRemote {...mdx.design} />
          </ProjectBand>
          <ProjectBand headline={{ bold: "03", thin: "Development" }}>
            <MDXRemote {...mdx.development} />
          </ProjectBand>
          <ProjectBand headline={{ bold: "04", thin: "Results" }}>
            <MDXRemote {...mdx.results.intro} />

            <MDXRemote {...mdx.results.conclusion} />
          </ProjectBand>
        </ProjectLayout>
      </ProjectContainer>
    </>
  );
}
