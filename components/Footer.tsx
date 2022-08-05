interface FooterProps {
  dark?: boolean;
}

const Footer: React.FC<FooterProps> = ({ dark }) => {
  const { t } = useTypeSafeTranslation("common");

  return (
    <Box
      css={{
        display: "flex",
        justifyContent: "center",
        width: "100%",

        backgroundColor: "$mauve1",
        color: "$mauve12",
      }}
      className={dark ? darkTheme : ""}
    >
      <Box
        css={{
          maxWidth: "72rem",
          px: "$spacing-08",
          width: "100%",
        }}
      >
        <Separator
          css={{
            width: "45px",
            marginY: "$spacing-07",
          }}
        />
        <Box as="footer" css={{ paddingBottom: "$spacing-10" }}>
          <Grid
            css={{
              display: "grid",
              rowGap: "$spacing-07",
              columnGap: "$spacing-03",

              gridTemplateColumns: "repeat(2, 1fr)",

              "@md": {
                gridTemplateColumns: "repeat(3, 1fr)",
              },

              "@lg": {
                gridTemplateColumns: "repeat(4, 1fr)",
              },
            }}
          >
            <Box
              css={{
                gridColumn: "1 / -1",

                "@lg": {
                  gridColumn: "auto",
                },
              }}
            >
              {/*@ts-expect-error Styled link doesn't expose the css prop but it will be passed as ...rest down the component tree */}
              <StyledLink css={{ textDecoration: "none" }} href="/">
                <Text css={{ fontWeight: "400", textDecoration: "none" }}>
                  Igor Bedesqui
                </Text>
              </StyledLink>
            </Box>

            {/*
            <Box>
            <Title as="h6">Me</Title> 
            <LinkList>
            <li>About</li>
            <li>Now</li>
          </LinkList>
          </Box>

          <Box>
          <Title as="h6">Work</Title>
          <LinkList>
            <li>Projects</li>
            <li>Resume</li>
          </LinkList>
          </Box> */}

            <Box>
              <Title as="h6">{t("footer.connect")}</Title>
              <LinkList>
                <li>
                  <StyledLink bold={false} href="https://github.com/bdsqqq/">
                    Github
                  </StyledLink>
                </li>
                <li>
                  <StyledLink bold={false} href="https://twitter.com/bedesqui">
                    Twitter
                  </StyledLink>
                </li>
                <li>
                  <StyledLink
                    bold={false}
                    href="https://www.linkedin.com/in/igor-bedesqui/"
                  >
                    Linkedin
                  </StyledLink>
                </li>
                <li>
                  <EmailLink>
                    <span
                      style={{
                        fontWeight: 400,
                      }}
                    >
                      Email
                    </span>
                  </EmailLink>
                </li>
              </LinkList>
            </Box>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

const Grid = Box;

const LinkList = styled("ul", {
  "& li": {
    marginTop: "$spacing-03",
  },
});
const Title = styled("h6", {
  fontWeight: "bold",
});

export default Footer;

import { darkTheme, styled } from "stitches.config";
import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";

import { Box, Separator } from "@/ui/primitives";
import StyledLink from "@/ui/StyledLink";
import Text from "@/ui/Text";
import EmailLink from "./ui/EmailLink";
