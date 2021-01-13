import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import i18nConfig from "../i18n.json";
import { Fragment } from "react";

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
            <Fragment key={lng}>
              <a className={generalClasses.concat(" " + activeClasses)}>
                {t(`${lng}`)}
              </a>
              {count < locales.length && (
                <span className={generalClasses}>|</span>
              )}
            </Fragment>
          );

        return (
          <Fragment key={lng}>
            <Link href="/" locale={lng}>
              <a className={generalClasses.concat(" " + inactiveClasses)}>
                {t(`${lng}`)}
              </a>
            </Link>
            {count < locales.length && (
              <span className={generalClasses}>|</span>
            )}
          </Fragment>
        );
      })}
    </>
  );
};

export default ChangeLang;
