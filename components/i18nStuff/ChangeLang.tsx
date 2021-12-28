const { locales } = i18nConfig;

const ChangeLang = () => {
  const router = useRouter();
  const { t, lang } = useTranslation();

  let count = 0;
  return (
    <LangChangeContainer>
      {locales.map((lng: string) => {
        count++;

        if (lng === lang)
          return (
            <>
              <InlineSpan key={lng}>
                <span className={ChangeLangLink({ state: "active" })}>
                  {t(`${lng}`)}
                </span>
              </InlineSpan>
              {count < locales.length && (
                <Span key={`${count}-separator`} css={{ userSelect: "none" }}>
                  |
                </Span>
              )}
            </>
          );

        let switchMessage;
        if (lng == "en") {
          switchMessage = en.switch;
        }
        if (lng == "pt") {
          switchMessage = pt.switch;
        }

        return (
          <>
            <InlineSpan key={lng}>
              <Link
                href={router.pathname}
                locale={lng}
                key={lng}
                passHref
                scroll={false}
              >
                <a
                  aria-label={switchMessage}
                  className={ChangeLangLink({ state: "inactive" })}
                >
                  {t(`${lng}`)}
                </a>
              </Link>
            </InlineSpan>
            {count < locales.length && (
              <Span key={`${count}-separator`} css={{ userSelect: "none" }}>
                |
              </Span>
            )}
          </>
        );
      })}
    </LangChangeContainer>
  );
};

const LangChangeContainer = styled("div", {
  display: "flex",
  gap: "0.5rem",
  justifyContent: "space-between",
  alignItems: "center",

  color: "$mauve11",
});

const InlineSpan = styled("span", {
  display: "inline",
});

const ChangeLangLink = css({
  color: "$mauve12",
  textTransform: "lowercase",
  userSelect: "none",
  width: "2rem",
  padding: "0.5rem",

  variants: {
    state: {
      active: {
        fontWeight: "bold",
      },
      inactive: {
        color: "$mauve11",
        cursor: "pointer",

        "&:hover": {
          color: "$mauve12",
        },

        "&:focus": {
          color: "$mauve12",
        },
      },
    },
  },
});

export default ChangeLang;

import { styled, css } from "stitches.config";
import { Span } from "@/ui/primitives";

import Link from "next/link";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import i18nConfig from "../../i18n.json";

import en from "@/locales/en/common.json";
import pt from "@/locales/pt/common.json";