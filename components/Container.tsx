interface ContainerProps {
  heading: JSX.Element;
  heroImg?: {
    src: string;
    alt: string;
  };
  backable?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  heading,
  heroImg,
  backable,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen">
      {heroImg && (
        <div className="absolute h-70vh w-full my-0 mx-auto">
          <Image
            priority
            className="p-16-caralho md:p-24-caralho"
            src={heroImg.src}
            alt={heroImg.alt}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
          <div className="absolute h-full w-full bg-igor-light bg-opacity-75" />
        </div>
      )}
      <div className="h-70vh relative">
        <nav
          className={`flex ${
            backable ? "justify-between" : "justify-end"
          } items-start w-full px-8 py-8 my-0 md:pt-8 md:px-16 mx-auto`}
        >
          {backable && (
            <Link href="/" passHref>
              <a>
                ⟵ <span>{t("common:back")}</span>{" "}
              </a>
            </Link>
          )}
          <a href="#skip" className="sr-only focus:not-sr-only">
            {t("common:skip")}
          </a>

          <ChangeLang
            generalClasses="p-1 sm:p-2 lowercase"
            activeClasses="font-bold text-gray-900"
            inactiveClasses="text-gray-500"
          />
        </nav>
        <h1
          id="skip"
          tabIndex={-1}
          className="max-w-2xl md:max-w-4xl mx-8 mt-8 md:mx-16 md:mt-16 text-lg sm:text-2xl md:text-3xl tracking-tight mb-4 text-igor-500 md:leading-snug uppercase"
        >
          {heading}
        </h1>
      </div>
      <div className="relative -mt-2 bg-igor-light min-h-30vh rounded-tl-2xl w-full">
        <main className="flex flex-col justify-center">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Container;

import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

import Footer from "./Footer";
import ChangeLang from "./ChangeLang";
import Link from "next/link";
