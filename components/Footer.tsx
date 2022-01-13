interface FooterProps {
  dark?: boolean;
}

const Footer: React.FC<FooterProps> = ({ dark }) => {
  const { t } = usetranslation();

  return (
    <Box
      css={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box
        css={{
          maxWidth: "72rem",
          px: "$spacing-08",
          width: "100%",
        }}
        className={dark ? darkTheme : ""}
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
              <StyledLink href="/">
                <Text as="a" bold>
                  IgorBedesqui
                </Text>
              </StyledLink>
            </Box>

            {/* <LinkList>
            <Title as="h6">Me</Title>
            <li>About</li>
            <li>Now</li>
          </LinkList>

          <LinkList>
            <Title as="h6">Work</Title>
            <li>Projects</li>
            <li>Resume</li>
          </LinkList> */}

            <LinkList>
              <Title as="h6">{t("common:footer.connect")}</Title>
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
            </LinkList>
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
import usetranslation from "next-translate/useTranslation";

import { Box, Separator } from "@/ui/primitives";
import StyledLink from "@/ui/StyledLink";
import Text from "@/ui/Text";
