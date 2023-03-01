import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import Tooltip from "@/components/ui/Tooltip";
import type { Metadata } from "next";

import { wasmGifMeta, bebopMeta } from "../poor_mans_cms";
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
  title: "WASM Gif maker",
  description: "Fast and secure gif making — made by Igor Bedesqui",
  slug: "/work/wasmgif",
  ogText: "*Fast* and *secure* gif making.",
});

export default async function WasmGif() {
  return (
    <ProjectContainer key="wasmGifProj" backMessage={wasmGifMeta.backMessage}>
      <HeroBand heroVideo="/videos/wasmgif/wow">
        <MDX>{`**Fast** and **secure** gif making.`}</MDX>
        <div className="mt-6">
          <CodeAndDemoButtons
            codeUrl="https://github.com/bdsqqq/next-wasm-gif"
            demoUrl="https://gif-maker-bdsq.vercel.app/"
          />
        </div>
      </HeroBand>
      <div className="mb-16" />

      <ProjectLayout projMeta={wasmGifMeta} nextProjMeta={bebopMeta}>
        <ProjectBand headline={{ bold: "01", thin: "Why?" }}>
          <MDX>
            {`
               Working at a company with a lot of sensitive data like IBM made me realize the danger of uploading stuff to places you don't trust;
               <br/>
               
               And as a person who makes gifs for my friends regularly, I got concerned! What if some shady conversion website is laughing at my friend's grimace face?
               <br/>
           
               The natural course of action as a programmer was to make the tool myself, this way I can rest assured that _no data is going anywhere_.
            `}
          </MDX>
        </ProjectBand>
        <ProjectBand headline={{ bold: "02", thin: "How" }}>
          <MDX>
            {`
              The dream was alive, making gifs without sending anything to any server, but how the f#@% would I do it?
              <br />
              
              After doing my research, I discovered that javascript (the programming language that runs on the browser) is *HORRIBLE* at encoding; But I knew what was great at it: the C programming language, especially with a library called FFMPEG, using it makes transforming any video file into a gif as simple as
              writing one line in a console.
              <br />
              
              The next question was: “how can I run C with FFMPEG in the browser?”, and searching it on google was helpful. It turns out I can very easily run C with something called *Web Assembly*.
              <br />
          
              My luck wasn't even close to stopping; At this point, I found a [Github repository](https://github.com/fireship-io/react-wasm-gif-maker) that did exactly what I wanted to do; And as a good programmer, I Yoinked it! After some bug fixing and updates, including remaking the state management and creating a UI from scratch, I was set.
              <br /> 
              
              I finally have a gif-making tool that my friends and I can trust without a doubt.
            `}
          </MDX>
        </ProjectBand>
      </ProjectLayout>
    </ProjectContainer>
  );
}
