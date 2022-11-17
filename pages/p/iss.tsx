import { meta, default as MD } from "data/work/iss.mdx";
import { meta as wasmGifMeta } from "data/work/wasmgif.mdx";

export default function Iss() {
  return (
    <>
      <Seo
        title="Where's the ISS?"
        description="A simple webapp that tells you where is the International Space Station — made by Igor Bedesqui"
        url="p/iss"
      />

      <ProjectContainer key="issProj" backMessage="Fly back home">
        <HeroBand fullBleed heroVideo="/videos/iss/space">
          <span>
            Where’s the{" "}
            <Tooltip content="International Space Station">
              <strong className="text-gray-12">ISS</strong>
            </Tooltip>
            ?
          </span>
          <p className="text-transparent" aria-hidden="true">
            (In space, probably, don’t tell anyone)
          </p>
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/iss-asset"
              demoUrl="https://iss.igorbedesqui.com/"
            />
          </div>
        </HeroBand>

        <ProjectLayout projMeta={meta} nextProjMeta={wasmGifMeta}>
          <MD />
        </ProjectLayout>
      </ProjectContainer>
    </>
  );
}

import Seo from "@/components/Seo";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";
import Tooltip from "@/components/ui/Tooltip";
