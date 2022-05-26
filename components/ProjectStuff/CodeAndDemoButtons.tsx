interface CodeAndDemoButtonsProps {
  codeUrl?: string;
  demoUrl?: string;
}

const CodeAndDemoButtons: React.FC<CodeAndDemoButtonsProps> = ({
  codeUrl,
  demoUrl,
}) => {
  const { t } = useTypeSafeTranslation("common");

  return (
    <Box css={{ display: "flex", gap: "1rem" }} className={darkTheme}>
      {codeUrl && (
        <LinkButton href={codeUrl}>
          <span>{t("code")}</span>
          <SrOnly>Github</SrOnly>
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

export default CodeAndDemoButtons;

import { darkTheme } from "stitches.config";
import { LinkButton } from "@/ui/Button";
import { Box, SrOnly } from "@/ui/primitives";
import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import { GitHubLogoIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
