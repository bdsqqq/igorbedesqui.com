import { meta, default as MD } from "data/work/wasmgif.mdx";
import { meta as bebopMeta } from "data/work/bebop.mdx";

export default function WasmGif() {
  return (
    <>
      <Seo
        title="WASM Gif maker"
        description="Fast and secure gif making — made by Igor Bedesqui"
        url="p/wasmgif"
      />

      <ProjectContainer key="wasmGifProj">
        <HeroBand fullBleed heroVideo={"/videos/wasmgif/wow"}>
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

        <ProjectLayout projMeta={meta} nextProjMeta={bebopMeta}>
          <MD />
        </ProjectLayout>
      </ProjectContainer>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import HeroBand from "@/components/HeroBand";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/components/ui/BackToTop";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";
