import Trans from "next-translate/Trans";
import Band from "../components/Band";
import Container from "../components/Container";
import Image from "next/image";

export default function Home() {
  return (
    <Container
      heading={
        <Trans
          i18nKey="home:hero"
          components={[
            <span className="font-light text-sm md:text-2xl" />,
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
        headline={{ number: "01", text: "Title" }}
        cta={{
          target: "https://www.igorbedesqui.com",
          text: "CTA TEXT",
          external: true,
        }}
      >
        <h3 className="text-2xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum laborum
          porro distinctio obcaecati sequi dolorum aperiam ipsam molestiae est
          beatae!
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
        headline={{ number: "02", text: "Gallery" }}
        cta={{
          target: "/example",
          text: "CTA TEXT",
        }}
      >
        <div className="grid grid-cols-1fr12rem gap-4 pb-8">
          <Image src="/images/background.jpg" width={1200} height={900} />
          <Image src="/images/background.jpg" width={1200} height={900} />
          <Image src="/images/background.jpg" width={1200} height={900} />
          <Image src="/images/background.jpg" width={1200} height={900} />
        </div>
      </Band>
    </Container>
  );
}
