export const ProjectLayout: React.FC<{
  projMeta: Meta;
  nextProjMeta?: Meta;
}> = ({ children, projMeta, nextProjMeta }) => {
  const { t } = useTranslation("detail");

  return (
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
        <Box>{children}</Box>

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
                  {t("detail:role")}
                </Text>
                <Text as="ul" presetStyle="paragraph">
                  {projMeta.roles.map((role, i) => {
                    return (
                      <li
                        style={{ display: "inline-list-item" }}
                        key={`role-${i}`}
                      >
                        {role}
                        {i < projMeta.roles.length - 1 && ","}
                      </li>
                    );
                  })}
                </Text>
              </Box>

              <Box css={{ marginBottom: "$spacing-06" }}>
                <Text presetStyle="paragraph" bold>
                  {t("detail:tools")}
                </Text>
                <Text as="ul" presetStyle="paragraph">
                  {projMeta.tools.map((tool, i) => {
                    return (
                      <li style={{ display: "inline-list-item" }} key={i}>
                        {tool}
                        {i < projMeta.tools.length - 1 && ","}
                      </li>
                    );
                  })}
                </Text>
              </Box>

              <Box css={{ marginBottom: "$spacing-07" }}>
                <Text presetStyle="paragraph" bold>
                  {t("detail:date")}
                </Text>
                <Text as="p" presetStyle="paragraph">
                  {projMeta.date}
                </Text>
              </Box>

              <Box css={{ marginBottom: "$spacing-06" }}>
                <Text presetStyle="paragraph" bold>
                  {t("detail:type")}
                </Text>
                <Text as="p" presetStyle="paragraph">
                  {projMeta.type}
                </Text>
              </Box>

              {nextProjMeta && (
                <>
                  <Separator
                    css={{
                      width: "45px",
                      marginY: "$spacing-09",
                    }}
                  />

                  <Box css={{ marginBottom: "$spacing-06" }}>
                    <Text presetStyle="paragraph" bold>
                      {t("detail:next")}
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
                      <StyledLink href={`/p/${nextProjMeta.urlSlug}`}>
                        {nextProjMeta.name}
                      </StyledLink>
                      <ArrowTopRightIcon />
                    </Text>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

import { Box, Separator } from "@/ui/primitives/";
import Text from "@/components/ui/Text";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import StyledLink from "@/ui/StyledLink";

import { Meta } from "@/hooks/useMeta";
import useTranslation from "next-translate/useTranslation";
