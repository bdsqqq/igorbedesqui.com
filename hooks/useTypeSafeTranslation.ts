import useTranslation from "next-translate/useTranslation";
import { TranslationQuery } from "next-translate";
import { Paths } from "@/lib/tsWizardry/Paths";
import { Paths as Nodes } from "@/lib/tsWizardry/nestedKeyOfTypes";

import about from "@/locales/en/about.json";
import common from "@/locales/en/common.json";
import detail from "@/locales/en/detail.json";
import home from "@/locales/en/home.json";
import now from "@/locales/en/now.json";
import timeline from "@/locales/en/timeline.json";

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
  timeline: Paths<typeof timeline>;
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

export type TranslationAllNodes = {
  about: Nodes<typeof about>;
  common: Nodes<typeof common>;
  detail: Nodes<typeof detail>;
  home: Nodes<typeof home>;
  now: Nodes<typeof now>;
  timeline: Nodes<typeof timeline>;
  "projs/bebop": Nodes<typeof bebop>;
  "projs/iss": Nodes<typeof iss>;
  "projs/minesweeper": Nodes<typeof minesweeper>;
  "projs/wasmGif": Nodes<typeof wasmGif>;
};

/**
 * Use this when you want `years`, `years.2021` and `years.2022` from
 * ```
 * {
 *    years: {
 *      2021: {...},
 *      2022: {...}
 * }
 * ```
 */
export const useTypeSafeTranslationWithNonLeafs = <
  T extends keyof TranslationAllNodes
>(
  ns: T
) => {
  const { t, lang } = useTranslation(ns);

  return {
    t: (
      s: TranslationAllNodes[T],
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
