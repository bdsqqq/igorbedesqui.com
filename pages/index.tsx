export default function Home() {
  const { t } = useTranslation("home");

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta content={t("title")} name="description" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container
        heading={
          <Trans
            i18nKey="home:hero"
            components={[
              <span className="font-light text-sm sm:text-lg md:text-2xl" />,
              <br />,
              <span className="font-bold" />,
            ]}
          />
        }
        heroImg={{ src: "/images/background.jpg", alt: "" }}
      >
        <Band headline={{ bold: "01", thin: "In a few words" }}>
          <p className="text-xl md:text-3xl tracking-tight ">
            I create <span className="font-bold"> digital solutions</span> using
            <span className="font-bold"> motion</span> and
            <span className="font-bold"> contrast</span> to enrich content.
          </p>
        </Band>
        <Band dark headline={{ bold: "02", thin: "Work" }}>
          <Projects />
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
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import Band from "../components/Band";
import Container from "../components/Container";
import Projects from "../components/ProjectStuff/Projects";
