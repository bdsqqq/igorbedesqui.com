export default function Home() {
  const { t } = useTranslation("home");
  const issMeta = useProjMeta("iss");
  const projsMeta = [issMeta, issMeta, issMeta];

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta content={t("title")} name="description" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container key="index">
        <HeroBand heroImg={{ src: "/images/background.jpg", alt: "" }}>
          <TransWithComps
            i18nKey="home:hero"
            extraComponents={{
              intro: <span className="font-light text-lg md:text-2xl" />,
            }}
          />
        </HeroBand>
        <Band headline={{ bold: "01", thin: t("01Title") }}>
          <p className="text-xl md:text-3xl tracking-tight ">
            <TransWithComps i18nKey="home:inAFewWords" />
          </p>
        </Band>
        <Band
          dark
          headline={{ bold: "02", thin: t("02Title") }}
          cta={{ target: "/p", text: t("02Cta") as string }}
        >
          <Projects projectsMeta={projsMeta} />
        </Band>
        <Band
          gridless
          id="something"
          cta={{
            target: "/example",
            text: "CTA TEXT",
          }}
        >
          <p className="text-4xl text-center italic font-light">
            " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod qui
            facere voluptate! "
          </p>
        </Band>
        <Band
          headline={{ bold: "03", thin: "Gallery" }}
          cta={{
            target: "/example",
            text: "CTA TEXT",
          }}
        >
          <div className="grid grid-cols-1fr12rem gap-4 pb-8">
            <Image
              alt="sunset at montmajour"
              src="/images/background.jpg"
              width={700}
              height={500}
            />
            <Image
              alt="sunset at montmajour"
              src="/images/background.jpg"
              width={700}
              height={500}
            />
            <Image
              alt="sunset at montmajour"
              src="/images/background.jpg"
              width={700}
              height={500}
            />
            <Image
              alt="sunset at montmajour"
              src="/images/background.jpg"
              width={700}
              height={500}
            />
          </div>
        </Band>
        <Band
          headline={{ bold: "Hey", thin: `let's connect!` }}
          cta={{
            target: "#",
            text: "back to the top",
          }}
        >
          <p className="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            laborum porro distinctio obcaecati sequi dolorum aperiam ipsam
            molestiae est beatae!
          </p>
        </Band>
      </Container>
    </>
  );
}

import Head from "next/head";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import useProjMeta from "../hooks/useProjMeta";

import Band from "../components/Band";
import Container from "../components/Container";
import TransWithComps from "../components/i18nStuff/TransWithComps";
import Projects from "../components/ProjectStuff/Projects";
import HeroBand from "../components/HeroBand";
