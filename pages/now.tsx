export default function Home() {
  const { t, lang } = useTypeSafeTranslation("now");
  const thingsImDoing = t(
    "doingArray",
    {},
    {
      returnObjects: true,
    }
  ) as unknown as string[];

  return (
    <>
      <Seo t={t} lang={lang} />

      <Container backable key="index">
        <Band gridless id="main">
          <div className="mx-auto">
            <h1 className="text-4xl">{t("doingTitle")}</h1>
            <p className="text-mauve11 text-sm font-semibold">
              <TransWithComps
                text={t("lastUpdated")}
                extraComponents={{ date: <span /> }}
              />
            </p>

            <div className="h-16" />
            <ul className="flex flex-col gap-2 [list-style-type:circle] list-inside">
              {thingsImDoing.map((thing) => {
                return (
                  <li className="text-base leading-relaxed" key={thing}>
                    {thing}
                  </li>
                );
              })}
            </ul>
            <div className="h-40" />
            <p className="text-mauve11 text-xs font-semibold">
              <TransWithComps text={t("bottomText")} />
            </p>
          </div>
        </Band>
      </Container>
    </>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
import TransWithComps from "@/components/i18nStuff/TransWithComps";
