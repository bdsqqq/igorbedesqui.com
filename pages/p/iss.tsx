export default function Iss() {
  const { t, lang } = useTranslation("projs/iss");
  const issMeta = useMeta("iss", "projs");

  return (
    <>
      <Seo t={t} lang={lang} url="p/iss" />
      <ProjectContainer key="issProj" backMessage="Fly back home">
        <HeroBand heroVideo="/videos/iss/space">
          <TransWithComps i18nKey="projs/iss:heroTitle" />
          <p aria-hidden="true" className="text-transparent">
            {t("projs/iss:heroSubHead")}
          </p>
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/iss-asset"
              demoUrl="https://iss.igorbedesqui.com/"
            />
          </div>
        </HeroBand>

        <ProjectLayout projMeta={issMeta}>
          <Band headline={{ bold: "01", thin: t("01Thin") }}>
            <Text>
              A few years ago I fell in love with coding by watching{" "}
              <StyledLinkWithIcon href="https://www.youtube.com/c/TheCodingTrain">
                Daniel Shiffman's youtube channel
              </StyledLinkWithIcon>
              , following along with{" "}
              <StyledLinkWithIcon href="https://www.youtube.com/watch?v=DbcLg8nRWEg&list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X">
                his series about Data and APIs
              </StyledLinkWithIcon>{" "}
              I created the website that got me my first job interview. This
              project is an update for that website and a lesson on prioritizing
              and focusing on outcome, it started as me trying to replicate the
              layout of an asset I saw on ibm.com but it quickly transformed
              into a side project that reflects the quality of the work I do.
              Instead of adding as many animations, features, and info as
              possible, I choose to focus on functionality, simplicity and
              aesthetics.
            </Text>
          </Band>
          <Band headline={{ bold: "02", thin: "challenges" }}>
            <Text>
              ## Handling cache
              {`By using data from a third party, I had a couple of limitations, the most important of them was that I could only make one request per second to the API across all clients, meaning that if enough people visited the website at the same time, I would quickly exceed my API quota. This called for an interesting solution; creating a serverless cache layer to store fresh data and distribute it or refresh it when apropriate is something I never did before but had fun implementing. Using a blazing fast cache like redis on Upstash(coloca o link do upstash aqui igor do futuro) allowed me to deliver an almost instant experience to users while keeping the amount of requests to an external API in check.`}
              <br />
              <br />
              {`While server-side challenges are something I don't deal with that much, this one proved to be an interesting learning experience and tought me a pattern that I'm sure I'll use on the future. Also, if you're a nerd, here's a diagram of the caching layer. Simple but effective stuff.`}
              <img src="" alt="Diagrama" />
              ## Incremental enhacement
            </Text>
          </Band>
          <Band headline={{ bold: "03", thin: t("03Thin") }}>
            <Text>
              <TransWithComps i18nKey={"projs/iss:03Copy"} />
            </Text>
          </Band>
        </ProjectLayout>
      </ProjectContainer>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import Seo from "@/components/Seo";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Band from "@/components/Band";
import Text from "@/components/ui/Text";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";

import useMeta from "@/hooks/useMeta";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
