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

  const a = {
    active: { opacity: 1, x: -8 },
    innactive: { opacity: 0.5, x: 0 },
  };
  const item = {
    active: { opacity: 1, y: 0 },
    innactive: { opacity: 0.01, y: 5 },
  };

  const childrenArray: any = Children.toArray(children);
  const dark: boolean | undefined =
    childrenArray[childrenArray.length - 1].props.dark;

  return (
    <div className="relative min-h-screen bg-igor-light">
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
              <motion.a
                className="cursor-pointer px-4 pb-0 select-none"
                initial="innactive"
                variants={a}
                whileFocus={"active"}
                whileHover={"active"}
              >
                ⟵{" "}
                <motion.span
                  className="inline-block"
                  transition={{ duration: 0.1 }}
                  variants={item}
                >
                  {t("common:back")}
                </motion.span>{" "}
              </motion.a>
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
        <Footer dark={dark} />
      </div>
    </div>
  );
};

export default Container;

import { Children } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";

import Footer from "./Footer";
import ChangeLang from "./ChangeLang";
import Link from "next/link";
