export default function bebop() {
  const { t, lang } = useTranslation("projs/bebop");
  const bebopMeta = useMeta("bebop", "projs");

  const dummyCopy = `
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, doloribus? Veniam cumque debitis labore laudantium quos autem perspiciatis provident at nulla minima vero aspernatur, enim consectetur dolorem veritatis unde iure numquam quas quis. Ad fugit nulla laborum explicabo similique doloribus expedita modi adipisci cupiditate corrupti aspernatur esse neque, asperiores totam assumenda laboriosam eum, dolor magnam ullam maxime tempore suscipit consequuntur harum. Accusamus quibusdam nihil architecto incidunt sequi corrupti commodi neque vel ad eveniet impedit voluptatibus dolorem ipsam tempore laudantium molestiae ut deserunt, consequatur, odit itaque iusto voluptates praesentium deleniti repudiandae. Libero nihil in corrupti necessitatibus enim beatae animi veritatis, hic soluta odit nisi quae quos cupiditate culpa, cumque est sapiente suscipit nostrum dolor commodi praesentium dolorem. Non nobis explicabo repudiandae, nam ullam nemo quidem dignissimos debitis voluptatem saepe eaque a natus doloribus, maiores soluta, voluptatum perspiciatis blanditiis impedit molestiae similique quasi consectetur illum. Eos, nobis vel quo illo voluptate dicta, sunt expedita rem at minima fuga delectus tempore ratione accusamus?
  `;
  return (
    <>
      <Seo t={t} lang={lang} url="p/bebop" />

      <ProjectContainer key="bebopProj" backMessage={t("backMessage")}>
        <HeroBand heroVideo={"/videos/bebop/noodles"}>
          <TransWithComps i18nKey={"projs/bebop:heroTitle"} />
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/bebop-webjam"
              demoUrl="https://bebop-webjam.vercel.app/"
            />
          </div>
        </HeroBand>

        <Box css={{ maxWidth: "1345px", marginX: "auto" }}>
          <Box
            css={{
              display: "grid",
              "@md": {
                gap: "20px",
                gridTemplateColumns: "1fr 330px",
              },

              "@lg": {
                gap: "80px",
              },
            }}
          >
            <Box>
              <Band smolPadding headline={{ bold: "01", thin: t("01Thin") }}>
                <Text presetStyle="paragraph">
                  <TransWithComps
                    i18nKey={"projs/bebop:01Copy"}
                    extraComponents={{
                      hc: (
                        <Popover
                          content={
                            <TransWithComps i18nKey={"projs/bebop:webjamHc"} />
                          }
                        ></Popover>
                      ),
                      s: <span className="cursor-pointer font-bold"></span>,
                    }}
                  />
                </Text>
              </Band>

              <Band smolPadding headline={{ bold: "02", thin: t("02Thin") }}>
                <Text presetStyle="paragraph">
                  <TransWithComps i18nKey={"projs/bebop:02Copy"} />
                </Text>
              </Band>

              <Band smolPadding headline={{ bold: "03", thin: t("03Thin") }}>
                <Text presetStyle="paragraph">
                  <TransWithComps i18nKey={"projs/bebop:03Copy"} />
                </Text>
              </Band>

              <Band smolPadding headline={{ bold: "04", thin: t("04Thin") }}>
                <Text presetStyle="paragraph">
                  <TransWithComps
                    i18nKey={"projs/bebop:04IntroCopy"}
                    extraComponents={{
                      a: (
                        <StyledLink href="https://bebop-webjam.vercel.app/"></StyledLink>
                      ),
                    }}
                  />
                </Text>

                <div className="grid grid-cols-4 gap-2 md:gap-4 h-96 my-4">
                  <div className="relative col-start-1 col-end-2 w-full h-full">
                    <Image
                      layout="fill"
                      objectFit="contain"
                      src="/images/projs/bebop/smartphone-screenshot.png"
                    ></Image>
                  </div>
                  <div className="relative col-start-2 col-end-5 w-full h-full">
                    <Image
                      layout="fill"
                      objectFit="contain"
                      src="/images/projs/bebop/desktop-screenshot.png"
                    ></Image>
                  </div>
                </div>
                <Text presetStyle="paragraph">
                  <TransWithComps i18nKey={"projs/bebop:04Copy"} />
                </Text>
              </Band>
            </Box>
            <Box>
              <Box
                css={{
                  position: "sticky",
                  top: "$spacing-06",
                  paddingTop: "$spacing-07",
                  px: "$spacing-07",

                  left: 0,
                  "@md": { paddingRight: "$spacing-12", px: 0 },
                }}
              >
                <Box>
                  <Box css={{ marginBottom: "$spacing-06" }}>
                    <Text presetStyle="paragraph" bold>
                      Roles
                    </Text>
                    <Text as="p" presetStyle="paragraph">
                      FrontEnd Developer, UX/UI Designer
                    </Text>
                  </Box>

                  <Box css={{ marginBottom: "$spacing-06" }}>
                    <Text presetStyle="paragraph" bold>
                      tools
                    </Text>
                    <Text as="p" presetStyle="paragraph">
                      TailwindCSS, Motion One, HTML, Adobe Illustrator
                    </Text>
                  </Box>

                  <Box css={{ marginBottom: "$spacing-07" }}>
                    <Text presetStyle="paragraph" bold>
                      Date
                    </Text>
                    <Text as="p" presetStyle="paragraph">
                      October 2021
                    </Text>
                  </Box>

                  <Box css={{ marginBottom: "$spacing-06" }}>
                    <Text presetStyle="paragraph" bold>
                      Project type
                    </Text>
                    <Text as="p" presetStyle="paragraph">
                      Personal
                    </Text>
                  </Box>
                  <Box
                    css={{
                      width: "45px",
                      height: "1px",

                      marginY: "$spacing-09",
                      backgroundColor: "$mauve6",
                    }}
                  />

                  <Box css={{ marginBottom: "$spacing-06" }}>
                    <Text presetStyle="paragraph" bold>
                      Next project
                    </Text>
                    <Text
                      presetStyle="paragraph"
                      css={{
                        display: "flex",
                        gap: "$spacing-01",
                        alignItems: "center",
                        color: "$mauve11",
                        fontWeight: "normal",
                      }}
                      as="span"
                    >
                      <StyledLink href="/p/wasmgif">Wasm gif maker</StyledLink>
                      <ArrowTopRightIcon />
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </ProjectContainer>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import useTranslation from "next-translate/useTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import DetailsBand from "@/components/Bands/DetailsBand";
import Popover from "@/components/ui/Popover";
import Text from "@/components/ui/Text";
import Image from "next/image";
import { Box, FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import useMeta from "@/hooks/useMeta";
import { darkTheme } from "stitches.config";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
