const { locales } = i18nConfig;

const ChangeLang = () => {
  const { t, lang } = useTranslation();

  let count = 0;
  return (
    <Ul>
      {locales.map((lng: string) => {
        count++;

        if (lng === lang)
          return (
            <>
              <InlineLi key={lng}>
                <ChangeLangButton state="active" disabled>
                  {t(`${lng}`)}
                </ChangeLangButton>
              </InlineLi>
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
            <InlineLi key={lng}>
              <ChangeLangButton
                onClick={async () => await setLanguage(lng)}
                aria-label={switchMessage}
                state="inactive"
              >
                {t(`${lng}`)}
              </ChangeLangButton>
            </InlineLi>
            {count < locales.length && (
              <Span key={`${count}-separator`} css={{ userSelect: "none" }}>
                |
              </Span>
            )}
          </>
        );
      })}
    </Ul>
  );
};

const Ul = styled("ul", {
  display: "flex",
  gap: "0.5rem",
  justifyContent: "space-between",
  alignItems: "center",

  color: "$mauve11",
});

const InlineLi = styled("li", {
  display: "inline",
});

const ChangeLangButton = styled("button", {
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

import { styled } from "stitches.config";
import { Span } from "@/ui/primitives";

import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import i18nConfig from "../../i18n.json";

import en from "@/locales/en/common.json";
import pt from "@/locales/pt/common.json";
