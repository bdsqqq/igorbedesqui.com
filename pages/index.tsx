import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import Container from "../components/Container";

export default function Home() {
  const { t, lang } = useTranslation("common");
  const title = t("title");
  return (
    <Container
      heading={
        <Trans
          i18nKey="common:title"
          components={[<span className=" font-bold" />]}
        />
      }
      heroSrc="/images/giphy.gif"
    >
      <section className="max-w-5xl mx-auto  px-8 ">
        <div className="flex flex-col justify-center items-start max-w-4xl mx-auto mb-16 py-8">
          <h1 className="font-bold text-3xl md:text-6xl tracking-tight mb-4 text-gray-700">
            Lorem ipsum dolor sit. {lang}
          </h1>
          <h2 className="text-gray-600 mb-16">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Repudiandae suscipit quisquam atque quidem aut, dignissimos ut eaque
            eos provident, tempora vitae sed optio at et aperiam a amet,
            nesciunt cupiditate!
          </h2>
        </div>
      </section>
      <div className="h-48 bg-oliver-500"></div>
    </Container>
  );
}
