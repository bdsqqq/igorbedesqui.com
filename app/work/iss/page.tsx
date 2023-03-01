import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import Tooltip from "@/components/ui/Tooltip";
import type { Metadata } from "next";

import { issMeta, wasmGifMeta } from "../poor_mans_cms";
import { MDX } from "@/components/MDX";
import Image from "next/image";

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
  title: "Where's the ISS?",
  description:
    "A simple webapp that tells you where is the International Space Station — made by Igor Bedesqui",
  slug: "/work/iss",
  ogText: "Realtime tracking of/nthe *International Space Station*",
});

export default async function Bebop() {
  return (
    <ProjectContainer key="issProj" backMessage={issMeta.backMessage}>
      <HeroBand heroVideo="/videos/iss/space">
        <span>
          Where’s the{" "}
          <Tooltip content="International Space Station">
            <strong className="text-gray-12">ISS</strong>
          </Tooltip>
          ?
        </span>
        <p className="text-gray-A1" aria-hidden="true">
          (In space, probably, don’t tell anyone)
        </p>
        <div className="mt-6">
          <CodeAndDemoButtons
            codeUrl="https://github.com/bdsqqq/iss-asset"
            demoUrl="https://iss.igorbedesqui.com/"
          />
        </div>
      </HeroBand>
      <div className="mb-16" />

      <ProjectLayout projMeta={issMeta} nextProjMeta={wasmGifMeta}>
        <ProjectBand headline={{ bold: "01", thin: "Why?" }}>
          <MDX>
            {`
              A few years ago, I fell in love with coding by watching [Daniel Shiffman's youtube channel](https://www.youtube.com/c/TheCodingTrain). Following [his series about Data and APIs](https://www.youtube.com/watch?v=DbcLg8nRWEg&list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X) I created the website that got me my first job interview. This project is an update for that website and a lesson on prioritizing. What started as me trying to replicate the complex layout and features of an asset I helped deploy on ibm.com but quickly transformed into a side project that reflects the quality of the work I strive to do. Instead of adding as many animations, features, and info as possible, I focused on delivering the content in a simple and beautiful way.
            `}
          </MDX>
        </ProjectBand>
        <ProjectBand headline={{ bold: "02", thin: "challenges" }}>
          <MDX
            components={{
              h4: ({ children }) => (
                <h4 className="text-xl mb-4 font-bold">{children}</h4>
              ),
              del: ({ children }) => (
                <del className="text-gray-8">{children}</del>
              ),
            }}
          >
            {`
              #### Request limitations

              Using data from a third-party API, I had a couple of limitations; especifically, I could only make one request per second across all clients. Without a caching layer of some sort, a few concurrent users, would quickly exceed my quota. This called for an interesting solution;
              <br />
              
              ~~creating a serverless cache layer to store fresh data and distribute it or refresh it when appropriate is something I never did before but had fun implementing. Using a blazing fast cache like Redis on [Upstash](https://upstash.com/) allowed me to deliver an almost instant experience to users while keeping the number of requests to an external API in check.~~
              <br />
        
              ~~While server-side challenges are something I don't deal with that much, this one proved to be a valuable learning experience and taught me a pattern that I'm sure I'll use in the future.~~
              <br />
        
              So, about the paragraphs above, what the fuck was I thinking??? I spun up a full-on
              Redis service to cache a REQUEST THAT DOESN'T CHANGE BETWEEN USERS.
              <br />
        
              The current solution is a SMALLER serverless function that runs faster and is cached on Vercel's EDGE. Supported by a better fetching logic on the frontend, this site should be able to handle any load and update the ISS location as fast as the API allows.
              <br />

              #### Incremental enhacement
      
              A frosted-glass look was a constant during my experiments, though some browsers didn't support the properties needed for it.
              <br />

              To keep the experience I wanted for users with cutting-edge browsers without sacrificing the experience for anyone, I leveraged the "@supports" media query to make the blur effect an incremental enhancement.
            `}
          </MDX>
          <div className="grid grid-cols-2 gap-2 my-2">
            <figure className="col-start-1">
              <Image
                className="z-[31] relative border overflow-hidden border-gray-3 rounded-sm"
                layout="responsive"
                width="310"
                height="310"
                objectFit="contain"
                src="/images/projs/iss/blur.png"
                alt=""
              />
              <figcaption>
                <span className="text-sm italic tracking-wide text-gray-10 inline-block text-center mt-1">
                  <MDX>
                    {`The UI in browsers that support filter properties blurs elements behind it.`}
                  </MDX>
                </span>
              </figcaption>
            </figure>
            <figure className="col-start-2">
              <Image
                className="z-[31] relative border overflow-hidden border-gray-3 rounded-sm"
                layout="responsive"
                width="310"
                height="310"
                objectFit="contain"
                src="/images/projs/iss/no_blur.png"
                alt=""
              />

              <figcaption>
                <span className="text-sm italic tracking-wide text-gray-10 inline-block text-center mt-1">
                  <MDX>
                    {`While the UI in browsers that don’t support filters, fallbacks into a solid color.`}
                  </MDX>
                </span>
              </figcaption>
            </figure>
          </div>
          <MDX>
            {`This feature might be a small detail, but an easy win from an "Oh! that's cool" perspective is always welcome.`}
          </MDX>
        </ProjectBand>
        <ProjectBand headline={{ bold: "03", thin: "Result" }}>
          <figure className="mb-4">
            <Image
              className="z-[31] relative border overflow-hidden border-gray-3 rounded-sm"
              layout="responsive"
              width="500"
              height="851"
              objectFit="contain"
              src="/images/projs/iss/full_screenshot.png"
              alt="Website screenshot"
            />
          </figure>

          <MDX>
            {`
              Through the literal years of development, this project saw my preferred solutions and approaches changing; Now, much more than a love letter to someone who shaped my early development, this site became a time capsule of my growth.
              <br />
          
              This tiny piece of user experience—load page, see location—was an opportunity to learn, practice, and experiment. And I can't wait to see how I'll rebuild it years from now.
              <br />
              
              If you want to see me losing my mind, changing scope, and having
              fun, look at the [project's commit history](https://github.com/bdsqqq/iss-asset/commits/main) And to see the actual site, visit [iss.igorbedesqui.com](https://iss.igorbedesqui.com/)
            `}
          </MDX>
        </ProjectBand>
      </ProjectLayout>
    </ProjectContainer>
  );
}
