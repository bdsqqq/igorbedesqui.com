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
            <Text
              css={{ marginBottom: "$spacing-04" }}
              presetStyle="semiHeading"
              as="h4"
            >
              Request limitations
            </Text>
            <Text>
              {`By using data from a third party, I had a couple of limitations, the most important of them was that I could only make one request per second to the API across all clients, meaning that if enough people visited the website at the same time, I would quickly exceed my API quota. This called for an interesting solution; creating a serverless cache layer to store fresh data and distribute it or refresh it when apropriate is something I never did before but had fun implementing. Using a blazing fast cache like redis on`}{" "}
              <StyledLinkWithIcon href="https://upstash.com/">
                Upstash
              </StyledLinkWithIcon>
              {` allowed me to deliver an almost instant experience to users while keeping the amount of requests to an external API in check.`}
              <br />
              <br />
              {`While server-side challenges are something I don't deal with that much, this one proved to be an interesting learning experience and tought me a pattern that I'm sure I'll use on the future. Also, if you're a nerd, here's a diagram of the cache logic. Simple but effective stuff.`}
            </Text>
            <Box
              as="figure"
              css={{
                marginY: "$spacing-05",
                borderRadius: "$md",
                overflow: "hidden",
              }}
            >
              <Image
                layout="responsive"
                width="100%"
                height="170%"
                objectFit="contain"
                src={`/images/projs/iss/cache_flow-${lang}.jpg`}
                alt="Flow diagram of caching logic"
              />
            </Box>

            <Text
              css={{ marginTop: "$spacing-06", marginBottom: "$spacing-04" }}
              presetStyle="semiHeading"
              as="h4"
            >
              Incremental enhacement
            </Text>
            <Text>
              {`While experimenting with the UI, I came across a problems with browser support, firefox didn't allow me to use some filter features to blur the content behind a div. While I could've just dropped the idea, I took this opportunity to use a pattern called Incremental Enchacement, using the "@supports" query in css, I applied some styles only on browsers that suppored a specific feature. This allowed me to deliver the experience I wanted to users with cutting edge browsers without sacrificing the experience of any user.`}
              <Box
                css={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "0.5rem",
                  marginY: "$spacing-02",
                }}
                className="grid grid-cols-2 gap-1 my-2"
              >
                <Box as="figure" css={{ gridColumnStart: 1 }}>
                  <Box
                    css={{
                      borderRadius: "$md",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      layout="responsive"
                      width="100%"
                      height="58%"
                      objectFit="contain"
                      src="/images/projs/iss/chrome_ui.jpg"
                    />
                  </Box>
                  <figcaption>
                    <Text
                      presetStyle="caption"
                      css={{
                        display: "inline-block",
                        textAlign: "center",
                        marginTop: "0.25rem",
                      }}
                    >
                      The UI in browsers that support filter properties blurs
                      elements behind it.
                    </Text>
                  </figcaption>
                </Box>
                <Box
                  as="figure"
                  css={{
                    gridColumnStart: 2,
                  }}
                >
                  <Box
                    css={{
                      borderRadius: "$md",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      layout="responsive"
                      width="100%"
                      height="58%"
                      objectFit="contain"
                      src="/images/projs/iss/firefox_ui.jpg"
                    />
                  </Box>

                  <figcaption>
                    <Text
                      presetStyle="caption"
                      css={{
                        display: "inline-block",
                        textAlign: "center",
                        marginTop: "0.25rem",
                      }}
                    >
                      While the UI in browsers that dont support filters,
                      fallbacks into a solid color.
                    </Text>
                  </figcaption>
                </Box>
              </Box>
            </Text>
          </Band>
          <Band headline={{ bold: "03", thin: "Results" }}>
            <Box
              as="figure"
              css={{
                borderRadius: "$md",
                overflow: "hidden",
                marginBottom: "$spacing-05",
              }}
            >
              <Image
                layout="responsive"
                width="100%"
                height="99.5%"
                objectFit="contain"
                src="/images/projs/iss/desktop-screenshot.jpg"
                alt="Website screenshot"
              />
            </Box>
            <Text>
              {`While I still plan to do small updates to this project, I consider it done. I love how this tiny piece of user experience— load page, see location—gave me an opportunity to learn, practice and experiment so much.`}
              <br />
              <br />
              If you want to see me losing my mind, changing scope and having
              fun, take a look at the{" "}
              <StyledLinkWithIcon href="https://github.com/bdsqqq/iss-asset/commits/main">
                commit history
              </StyledLinkWithIcon>{" "}
              of the project. and If you just want to see it in action,{" "}
              <StyledLinkWithIcon href="https://iss.igorbedesqui.com/">
                here it is
              </StyledLinkWithIcon>
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

import Image from "next/image";
import { Box } from "@/components/ui/primitives";
import { styled } from "stitches.config";
