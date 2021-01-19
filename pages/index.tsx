import Trans from "next-translate/Trans";
import Container from "../components/Container";

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
      heroSrc="/images/giphy.gif"
    >
      <section className="max-w-5xl mx-auto px-8 ">
        <div className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 py-8">
          <h1 className="text-2xl md:text-5xl tracking-tight mb-4 text-gray-700">
            <Trans
              i18nKey="home:about"
              components={[<span className="font-bold" />]}
            />
          </h1>
        </div>
      </section>
      <div className="h-48 bg-oliver-500"></div>
    </Container>
  );
}
