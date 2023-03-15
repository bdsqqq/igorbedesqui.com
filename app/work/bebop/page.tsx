import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import PopOver from "@/components/ui/Popover";
import type { Metadata } from "next";

import { bebopMeta, issMeta } from "../metas";
import Popover from "@/components/ui/Popover";
import { MDX } from "@/components/MDX";
import Image from "next/image";

import desktopScreenshot from "@/public/images/projs/bebop/desktop-screenshot.png";
import smartphoneScreenshot from "@/public/images/projs/bebop/smartphone-screenshot.png";

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
      title: "Cowboy Bebop web poster",
      description: description,
      image: ogImageUrl,
      imageAlt: ogText.replace("*", ""),
    },
    openGraph: {
      title: "Cowboy Bebop web poster",
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
  title: "Cowboy Bebop web poster",
  description:
    "My entry for, and winner of, the second installment of the WebJam.",
  slug: "/work/bebop",
  ogText:
    "*The work*, which *becomes* /n*a new genre itself*, will be /ncalled... *COWBOY BEBOP*",
});

export default async function Bebop() {
  return (
    <ProjectContainer key="bebopProj" backMessage={bebopMeta.backMessage}>
      <HeroBand heroVideo={"/videos/bebop/noodles"}>
        <MDX>
          {`
            **The work** which **becomes a new genre itself** will be called... **COWBOY BEBOP**
          `}
        </MDX>
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
          <h2 className="text-xl font-bold text-gray-11 uppercase mb-2">
            Update
          </h2>
          <MDX>
            {`
              On november 2nd 2021 I got a notification on my discord with the amazing news that this project had won the competition with the majority of votes. Now, I bask in the glory!! [I'll leave the screenshot of the announcement here because I'm very proud of this](https://raw.githubusercontent.com/bdsqqq/bebop-webjam/main/docs/img/winner.jpg).
            `}
          </MDX>
        </ProjectBand>
        <ProjectBand headline={{ bold: "01", thin: "Why?" }}>
          <MDX
            components={{
              Popover: (props) => (
                <PopOver
                  content={
                    <MDX>
                      {`The **WebJam** is a hackathon where the participants try to create a website following a prompt and some rules`}
                    </MDX>
                  }
                >
                  {props.children}
                </PopOver>
              ),
            }}
          >
            {`
              I made this project as an entry for the second installment of the <Popover>WebJam</Popover>.
              <br/>
              The challenge for this WebJam was to create a single page/non-scrollable site for a movie of my choosing. The site should work on any screen size and illustrate the movie.
            `}
          </MDX>
        </ProjectBand>
        <ProjectBand headline={{ bold: "02", thin: "Design" }}>
          <MDX>
            {`
              My choice of movie was Cowboy Bebop, it's one of my favorites and screams personality with its artwork. The mix between Jazz, Noir, Western, and Space is unique and serves as a great source of inspiration for a website. 
              <br/>
              The main constraint for this exercise was space. I took inspiration from types of media with the same limitation such as posters, cover arts, and the TV show itself. After spending an uncomfortable amount of time rewatching the opening of Cowboy Bebop, I figured that I needed to include the iconic shots of silhouettes against bright-colored backgrounds. I even found one of the pieces that inspired the show's artists: the cover art for the film "Tokyo Drifter".
              <br/>
              At this point, I knew that I wanted something that could be mistaken for a poster when showing it to someone. I made a quick sketch on a piece of paper from my desk and started working.
            `}
          </MDX>
        </ProjectBand>
        <ProjectBand headline={{ bold: "03", thin: "Development" }}>
          <MDX>
            {`
              Trying to avoid unnecessary complexity, I approached this project from a minimalist perspective, I created a plain HTML file with tailwindcss and made a responsive design with two major blocks, one for the text content and the other for the silhouette; In the second one, I took inspiration from the show's opening where we can find bits of a paragraph overlayed on the solid color to tell a history ending with the ambitious phrase that gives title to the website: "The work, which becomes a new genre itself, will be called... COWBOY BEBOP".
              <br/>
              It became clear that I would need to create media for this piece. I downloaded Adobe Illustrator for the first time in a couple of years to make figures to layer on my scene. Even though my initial plan to use the silhouette as a "mask" that contained the animated spaceship didn't work, I got the vibe I wanted by using a clip-path element to clip an image of stars I modified into the silhouette. Adding a simple animation to the smoke SVG and a trail to the otherwise boring spaceship gave life to this otherwise static poster.
              <br/>
              For the final touches, I allowed the title to break its box and overlap with the silhouette container creating that bit of spice the piece was missing. To add to the poster-like feeling I was going for, I added an image of wrinkled paper as an overlay with a CSS filter to make the entire thing look like something you would find glued to a wall and voilá.
            `}
          </MDX>
        </ProjectBand>
        <ProjectBand headline={{ bold: "04", thin: "Results" }}>
          <MDX>
            {`
              [Visit the website](https://bebop-webjam.vercel.app/). or take a peek with some screenshots:
            `}
          </MDX>
          <div className="grid grid-cols-4 items-center min-h-0 gap-2 my-1">
            <div className="col-start-1 col-end-2">
              <Image
                className="z-[31] relative border overflow-hidden border-gray-3 rounded-sm"
                src={smartphoneScreenshot}
                width="1440"
                height="3040"
                // fill
                alt=""
              />
            </div>
            <div className="col-start-2 col-end-5">
              <Image
                className="z-[31] relative border overflow-hidden border-gray-3 rounded-sm"
                src={desktopScreenshot}
                width="1200"
                height="800"
                // fill
                alt=""
              />
            </div>
          </div>
          <MDX>
            {`
              After working on this project I'm more confident in my ability to create a cool design and translate it to code. As well as working with design tools such as Adobe Illustrator and Photoshop when needed. I also had a chance to learn a new animation library called motion one and enjoyed every second of it.
              <br/>
              I liked the WebJam experience and will be looking forward to its future installments.
            `}
          </MDX>
        </ProjectBand>
      </ProjectLayout>
    </ProjectContainer>
  );
}