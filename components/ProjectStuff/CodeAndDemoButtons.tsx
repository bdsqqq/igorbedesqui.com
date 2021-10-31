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
          <Svg viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </g>
          </Svg>
        </LinkButton>
      )}
      {demoUrl && (
        <LinkButton href={demoUrl}>
          <span>{t("demo")}</span>
          <Svg viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </g>
          </Svg>
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
