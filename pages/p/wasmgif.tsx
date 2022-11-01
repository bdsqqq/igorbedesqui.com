export default function WasmGif() {
  const { t, lang } = useTypeSafeTranslation("projs/wasmGif");
  const wasmGifMeta = useMeta("wasmGif", "projs");
  const bebopMeta = useMeta("bebop", "projs");

  return (
    <>
      <Seo
        title="WASM Gif maker"
        description="Fast and secure gif making — made by Igor Bedesqui"
        url="p/wasmgif"
      />

      <ProjectContainer key="wasmGifProj">
        <HeroBand fullBleed heroVideo={"/videos/wasmgif/wow"}>
          <TransWithComps text={t("heroTitle")} />
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/next-wasm-gif"
              demoUrl="https://gif-maker-bdsq.vercel.app/"
            />
          </div>
        </HeroBand>

        <ProjectLayout projMeta={wasmGifMeta} nextProjMeta={bebopMeta}>
          <Band
            options={{ padding: "smol" }}
            headline={{ bold: "01", thin: t("01Thin") }}
          >
            <p>
              <TransWithComps text={t("01Copy")} />
            </p>
          </Band>
          <Band
            options={{ padding: "smol" }}
            headline={{ bold: "02", thin: t("02Thin") }}
          >
            <p>
              <TransWithComps
                text={t("02Copy")}
                extraComponents={{
                  git: (
                    <StyledLinkWithIcon href="https://github.com/fireship-io/react-wasm-gif-maker" />
                  ),
                }}
              />
            </p>
          </Band>
        </ProjectLayout>
      </ProjectContainer>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/components/ui/BackToTop";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

import useMeta from "@/hooks/useMeta";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
