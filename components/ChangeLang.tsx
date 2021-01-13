import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import i18nConfig from "../i18n.json";
import { useEffect } from "react";

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
    <>
      {locales.map((lng: string) => {
        count++;

        if (lng === lang)
          return (
            <>
              <a className={generalClasses.concat(" " + activeClasses)}>
                {t(`${lng}`)}
              </a>
              {count < locales.length && (
                <span className={generalClasses}>|</span>
              )}
            </>
          );

        return (
          <>
            <Link href="/" locale={lng} key={lng}>
              <a className={generalClasses.concat(" " + inactiveClasses)}>
                {t(`${lng}`)}
              </a>
            </Link>
            {count < locales.length && (
              <span className={generalClasses}>|</span>
            )}
          </>
        );
      })}
    </>
  );
};

export default ChangeLang;
