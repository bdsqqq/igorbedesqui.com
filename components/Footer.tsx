interface FooterProps {
  dark?: boolean;
}

const Footer: React.FC<FooterProps> = ({ dark }) => {
  const { t } = usetranslation();

  const linkClassList = `text-sm text-opacity-80 hover:text-opacity-100 focus:text-opacity-100 transition-all ${
    dark ? "text-igor-light" : " text-igor-500"
  }`;

  return (
    <footer
      className={`flex flex-col items-center pb-8 ${
        dark ? "bg-igor-500" : "bg-igor-light"
      }`}
    >
      <nav aria-label={t("common:secondary")}>
        <div className="flex space-x-4 mb-4">
          <ExternalLink
            href="https://github.com/bdsqqq"
            aClassList={linkClassList}
          >
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
          <ExternalLink
            href="mailto:igorbedesqui@gmail.com"
            aClassList={linkClassList}
          >
            <span className="sr-only">Email</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </g>
            </svg>
          </ExternalLink>
        </div>
        <div className="space-x-3">
          <Link href="/example" passHref>
            <a className={linkClassList}>/example</a>
          </Link>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;

import Link from "next/link";
import ExternalLink from "./ExternalLink";
import usetranslation from "next-translate/useTranslation";
