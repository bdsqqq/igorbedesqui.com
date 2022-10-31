const { locales } = i18nConfig;

const ChangeLang = () => {
  const router = useRouter();
  const { lang } = useTypeSafeTranslation("common");

  let count = 0;

  const changeLangLinkVariants = cva(
    "lowercase select-none w-8 transition-colors",
    {
      variants: {
        state: {
          active: "text-mauve12 font-bold",
          inactive:
            "text-mauve11 cursor-pointer hover:text-mauve12 focus:text-mauve12 focus-visible:outline outline-1 outline-offset-4 outline-mauve8 rounded-sm",
        },
      },
    }
  );
  return (
    <div className="flex gap-2 justify-between items-center text-mauve11">
      {locales.map((lng: string) => {
        count++;

        if (lng === lang)
          return (
            <React.Fragment key={`${lng}-fragment`}>
              <span className="inline w-[3ch] text-center" key={lng}>
                <span className={changeLangLinkVariants({ state: "active" })}>
                  {lng}
                </span>
              </span>
              {count < locales.length && (
                <Separator
                  className="h-3 translate-y-0.5"
                  orientation="vertical"
                  key={`${count}-separator`}
                />
              )}
            </React.Fragment>
          );

        let switchMessage;
        if (lng == "en") {
          switchMessage = en.switch;
        }
        if (lng == "pt") {
          switchMessage = pt.switch;
        }

        return (
          <React.Fragment key={`${lng}-fragment`}>
            <span className="inline w-[3ch] text-center" key={lng}>
              <Link href={router.pathname} locale={lng} key={lng} passHref>
                <a
                  aria-label={switchMessage}
                  className={changeLangLinkVariants({ state: "inactive" })}
                >
                  {lng}
                </a>
              </Link>
            </span>
            {count < locales.length && (
              <Separator
                className="h-3 translate-y-0.5"
                orientation="vertical"
                key={`${count}-separator`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ChangeLang;

import Link from "next/link";
import { useRouter } from "next/router";
import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import i18nConfig from "../../i18n.json";

import en from "@/locales/en/common.json";
import pt from "@/locales/pt/common.json";
import React from "react";
import { cva } from "class-variance-authority";
import { Separator } from "../ui/primitives";
