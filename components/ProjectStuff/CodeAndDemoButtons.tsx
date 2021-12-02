interface CodeAndDemoButtonsProps {
  codeUrl?: string;
  demoUrl?: string;
}

const CodeAndDemoButtons: React.FC<CodeAndDemoButtonsProps> = ({
  codeUrl,
  demoUrl,
}) => {
  const { t } = useTranslation("common");

  return (
    <Box css={{ display: "flex", gap: "1rem" }} className={darkTheme}>
      {codeUrl && (
        <LinkButton href={codeUrl}>
          <span>{t("code")}</span>
          <span className="sr-only">Github</span>
          <GitHubLogoIcon height="23" width="23" />
        </LinkButton>
      )}
      {demoUrl && (
        <LinkButton href={demoUrl}>
          <span>{t("live")}</span>
          <ArrowTopRightIcon height="23" width="23" />
        </LinkButton>
      )}
    </Box>
  );
};

const Svg = styled("svg", {
  width: "1.25rem",
  height: "1.25rem",
});

export default CodeAndDemoButtons;

import { darkTheme, styled } from "stitches.config";
import { LinkButton } from "@/ui/Button";
import { Box } from "@/ui/primitives";
import useTranslation from "next-translate/useTranslation";
import { GitHubLogoIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
