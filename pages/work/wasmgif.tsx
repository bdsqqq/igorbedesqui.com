import { meta as bebopMeta } from "./bebop";

export default function Wasm({
  mdx,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Seo
        title="WASM Gif maker"
        description="Fast and secure gif making — made by Igor Bedesqui"
        ogText="*Fast* and *secure* gif making."
        url="work/wasmgif"
      />

      <ProjectContainer key="wasmGifProj">
        <HeroBand heroVideo={"/videos/wasmgif/wow"}>
          <span>
            <span className="font-bold text-gray-12">Fast</span> and{" "}
            <span className="font-bold text-gray-12">secure</span> gif making.
          </span>
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/next-wasm-gif"
              demoUrl="https://gif-maker-bdsq.vercel.app/"
            />
          </div>
        </HeroBand>
        <div className="mb-16" />

        <ProjectLayout projMeta={meta} nextProjMeta={bebopMeta}>
          <ProjectBand headline={{ bold: "01", thin: "Why?" }}>
            <MDXRemote {...mdx.why} />
          </ProjectBand>
          <ProjectBand headline={{ bold: "02", thin: "How?" }}>
            <MDXRemote {...mdx.how} />
          </ProjectBand>
        </ProjectLayout>
      </ProjectContainer>
    </>
  );
}

export const meta = {
  shortName: "wasmGif",
  name: "Wasm Gif Converter",
  description: "Video to gif conversion without sending any data anywhere.",
  roles: ["FrontEnd Developer", "UX/UI Designer"],
  type: "Personal",
  tools: [
    "NextJS",
    "React",
    "Typescript",
    "Framer Motion",
    "ffmpeg",
    "Web Assembly",
  ],
  date: "Mar 2021",
  urlSlug: "wasmgif",
  backMessage: "",
};

const MDs = {
  why: `
    Working at a company with a lot of sensitive data like IBM made me realize the danger of uploading stuff to places you don't trust;
    <br/>
    
    And as a person who makes gifs for my friends regularly, I got concerned! What if some shady conversion website is laughing at my friend's grimace face?
    <br/>

    The natural course of action as a programmer was to make the tool myself, this way I can rest assured that _no data is going anywhere_.
  `,
  how: `
    The dream was alive, making gifs without sending anything to any server, but
    how the f#@% would I do it?
    <br />
    After doing my research, I discovered that javascript (the programming
    language that runs on the browser) is *HORRIBLE* at encoding; But I knew what
    was great at it: the C programming language, especially with a library called
    FFMPEG, using it makes transforming any video file into a gif as simple as
    writing one line in a console.
    <br />
    The next question was: “how can I run C with FFMPEG in the browser?”, and
    searching it on google was helpful. It turns out I can very easily run C with
    something called *Web Assembly*.
    <br />
    My luck wasn't even close to stopping; At this point, I found a [Github
    repository](https://github.com/fireship-io/react-wasm-gif-maker) that did
    exactly what I wanted to do; And as a good programmer, I Yoinked it! After
    some bug fixing and updates, including remaking the state management and
    creating a UI from scratch, I was set.
    <br /> I finally have a gif-making tool that my friends and I can trust without
    a doubt.
  `,
};

export const getStaticProps: GetStaticProps<{
  mdx: RecursiveSerialize<typeof MDs>;
}> = async () => {
  const mdx = await mutateSerializeMdx(MDs);
  return { props: { mdx } };
};

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import HeroBand from "@/components/HeroBand";
import {
  ProjectBand,
  ProjectLayout,
} from "@/components/ProjectStuff/ProjectLayout";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import {
  mutateSerializeMdx,
  RecursiveSerialize,
} from "@/lib/mutateSerializeMdx";
import { MDXRemote } from "next-mdx-remote";
