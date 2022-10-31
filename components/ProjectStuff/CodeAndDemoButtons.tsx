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
    <div className="flex gap-4">
      {codeUrl && (
        <LinkButton href={codeUrl}>
          <span>{t("code")}</span>
          <span className="sr-only">Github</span>
          <GitHubLogoIcon height="18" width="18" />
        </LinkButton>
      )}
      {demoUrl && (
        <LinkButton href={demoUrl}>
          <span>{t("live")}</span>
          <ArrowTopRightIcon height="18" width="18" />
        </LinkButton>
      )}
    </div>
  );
};

export default CodeAndDemoButtons;

import { LinkButton } from "@/ui/Button";
import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import { GitHubLogoIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
