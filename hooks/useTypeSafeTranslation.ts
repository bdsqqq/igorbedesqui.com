import useTranslation from "next-translate/useTranslation";
import { TranslationQuery } from "next-translate";
import { Paths } from "@/lib/utilTypes";

import about from "@/locales/en/about.json";
import common from "@/locales/en/common.json";
import detail from "@/locales/en/detail.json";
import home from "@/locales/en/home.json";
import now from "@/locales/en/now.json";

import bebop from "@/locales/en/projs/bebop.json";
import iss from "@/locales/en/projs/iss.json";
import minesweeper from "@/locales/en/projs/minesweeper.json";
import wasmGif from "@/locales/en/projs/wasmGif.json";

export type TranslationKeys = {
  about: Paths<typeof about>;
  common: Paths<typeof common>;
  detail: Paths<typeof detail>;
  home: Paths<typeof home>;
  now: Paths<typeof now>;
  "projs/bebop": Paths<typeof bebop>;
  "projs/iss": Paths<typeof iss>;
  "projs/minesweeper": Paths<typeof minesweeper>;
  "projs/wasmGif": Paths<typeof wasmGif>;
};

export const useTypeSafeTranslation = <T extends keyof TranslationKeys>(
  ns: T
) => {
  const { t, lang } = useTranslation(ns);

  return {
    t: (
      s: TranslationKeys[T],
      q?: TranslationQuery,
      o?: {
        returnObjects?: boolean;
        fallback?: string | string[];
        default?: string;
      }
    ) => t(s, q, o),
    lang,
  };
};
