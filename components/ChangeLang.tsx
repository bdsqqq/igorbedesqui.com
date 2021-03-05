interface ChangeLangProps {
  generalClasses: string;
  inactiveClasses?: string;
  activeClasses?: string;
}

const { locales } = i18nConfig;

const ChangeLang: React.FC<ChangeLangProps> = ({
  generalClasses,
  inactiveClasses,
  activeClasses,
}) => {
  const { t, lang } = useTranslation();

  let count = 0;
  return (
    <ul>
      {locales.map((lng: string) => {
        count++;

        if (lng === lang)
          return (
            <li className="inline" key={lng}>
              <span className={generalClasses.concat(" " + activeClasses)}>
                {t(`${lng}`)}
              </span>
              {count < locales.length && (
                <span className={generalClasses}>|</span>
              )}
            </li>
          );

        let switchMessage;
        if (lng == "en") {
          switchMessage = en.switch;
        }
        if (lng == "pt") {
          switchMessage = pt.switch;
        }

        return (
          <li className="inline" key={lng}>
            <button
              onClick={async () => await setLanguage(lng)}
              aria-label={switchMessage}
            >
              <span
                className={generalClasses.concat(
                  " " + inactiveClasses + " cursor-pointer select-none"
                )}
              >
                {t(`${lng}`)}
              </span>
            </button>
            {count < locales.length && (
              <span className={generalClasses}>|</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ChangeLang;

import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import i18nConfig from "../i18n.json";

import en from "../locales/en/common.json";
import pt from "../locales/pt/common.json";
