interface CodeAndDemoButtonsProps {
  codeUrl?: string;
  demoUrl?: string;
}

const CodeAndDemoButtons: React.FC<CodeAndDemoButtonsProps> = ({
  codeUrl,
  demoUrl,
}) => {
  const { t } = useTranslation("common");
  const buttonClasses =
    "flex items-center text-lg py-1 px-2 align-middle bg-igor-700 text-igor-light shadow-lg rounded mr-2 hover:bg-igor-500 hover:shadow-xl focus:bg-igor-500 focus:shadow-xl transition-all cursor-pointer";
  return (
    <div className="flex">
      {codeUrl && (
        <ExternalLink aClassList={buttonClasses} href={codeUrl}>
          <span className="mr-2">{t("code")}</span>
          <span className="sr-only">Github</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </g>
          </svg>
        </ExternalLink>
      )}
      {demoUrl && (
        <ExternalLink aClassList={buttonClasses} href={demoUrl}>
          <span className="mr-2">{t("demo")}</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </g>
          </svg>
        </ExternalLink>
      )}
    </div>
  );
};

export default CodeAndDemoButtons;

import ExternalLink from "../ExternalLink";
import useTranslation from "next-translate/useTranslation";
