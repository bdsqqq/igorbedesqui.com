import Head from "next/head";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";
import Band from "../components/Band";
import Container from "../components/Container";
import Image from "next/image";

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
        heroImg={{ src: "/images/background.jpg", alt: "bob ross" }}
      >
        <Band gridless id="hej">
          <h1 className="text-2xl md:text-5xl tracking-tight text-center">
            <Trans
              i18nKey="home:about"
              components={[<span className="font-bold" />]}
            />
          </h1>
        </Band>
        <Band
          dark
          headline={{ bold: "01", thin: "Title" }}
          cta={{
            target: "#lets's connect!",
            text: "Connect with me",
          }}
        >
          <h3 className="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            laborum porro distinctio obcaecati sequi dolorum aperiam ipsam
            molestiae est beatae!
          </h3>
        </Band>
        <Band
          gridless
          id="something"
          cta={{
            target: "/example",
            text: "CTA TEXT",
          }}
        >
          <h3 className="text-4xl text-center italic font-light">
            " Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod qui
            facere voluptate! "
          </h3>
        </Band>
        <Band
          headline={{ bold: "02", thin: "Gallery" }}
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
          headline={{ bold: "Hey", thin: "lets's connect!" }}
          cta={{
            target: "#",
            text: "back to the top",
          }}
        >
          <h3 className="text-2xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            laborum porro distinctio obcaecati sequi dolorum aperiam ipsam
            molestiae est beatae!
          </h3>
        </Band>
      </Container>
    </>
  );
}
