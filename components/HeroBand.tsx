type HeroBandImg = {
  heroImg?: {
    src: string;
    alt: string;
  };
  heroVideo?: never;
};

type HeroBandVideo = {
  heroVideo?: string;
  heroImg?: never;
};

type HeroBandProps = HeroBandVideo | HeroBandImg;

const StyledImage = styled(Image);

const HeroBand: React.FC<HeroBandProps> = ({
  heroImg,
  heroVideo,
  children,
}) => {
  return (
    <Band gridless id="hero" padless>
      <Box
        css={{
          position: "relative",
          width: "100%",
          minHeight: "70vh",
        }}
      >
        {(heroImg || heroVideo) && (
          <Box
            css={{
              position: "absolute",
              height: "100%",
              width: "100%",
              marginY: 0,
              marginX: "auto",
            }}
          >
            {heroImg && (
              <StyledImage
                priority
                css={{
                  padding: "4rem !important",

                  "@md": {
                    paddingRight: "6rem !important",
                    paddingLeft: "18rem !important",
                    paddingTop: "4rem !important",
                    paddingBottom: "4rem !important",
                  },
                }}
                src={heroImg.src}
                alt={heroImg.alt}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
              />
            )}
            {heroVideo && (
              <Box
                css={{
                  overflow: "hidden",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                }}
              >
                <Box
                  as={"video"}
                  preload="none"
                  playsInline
                  autoPlay
                  muted
                  loop
                  css={{
                    position: "absolute",
                    visibility: "visible",
                    width: "100%",
                    height: "100%",
                    objectPosition: "center",
                    objectFit: "cover",

                    padding: "4rem !important",

                    "@md": {
                      paddingRight: "6rem !important",
                      paddingLeft: "18rem !important",
                      paddingTop: "4rem !important",
                      paddingBottom: "4rem !important",
                    },
                  }}
                >
                  <source src={`${heroVideo}.webm`} type="video/webm" />
                  <source src={`${heroVideo}.mp4`} type="video/mp4" />
                </Box>
              </Box>
            )}
            <Box
              css={{
                position: "absolute",
                height: "100%",
                width: "100%",
                background: "$mauve1",
                opacity: "75%",
              }}
            />
          </Box>
        )}
        <Box
          css={{
            position: "relative",
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            maxWidth: "72rem",
            padding: "$spacing-07",
            marginX: "auto",

            "@md": {
              padding: "$spacing-10 ",
            },
          }}
        >
          <Text
            as="h1"
            css={{
              marginBottom: "$spacing-05",
              letterSpacing: "$tight",
              lineHeight: "$xl",
              fontSize: "$xl",

              "@md": {
                maxWidth: "42rem",
                width: "66.6%",
                marginLeft: "$spacing-07",
                marginRight: "$spacing-10",

                lineHeight: "$2xl",
                fontSize: "$2xl",
                textTransform: "uppercase",
              },
            }}
            id="skip"
            tabIndex={-1}
          >
            {children}
          </Text>
        </Box>
      </Box>
    </Band>
  );
};

export default HeroBand;

import Image from "next/image";
import { styled } from "stitches.config";

import Band from "@/components/Band";
import { Box } from "./ui/primitives";
import Text from "./ui/Text";
