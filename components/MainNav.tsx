type MainNavProps =
  | {
      backable?: boolean;
      backMessage?: never;
      backTarget?: never;
    }
  | {
      backable: true;
      backMessage?: string;
      backTarget?: string;
    };

const MainNav: React.FC<MainNavProps> = ({
  backable,
  backMessage,
  backTarget,
}) => {
  const { t } = useTranslation();

  const [backIsActive, setBackIsActive] = useState(false);

  const a = {
    active: { opacity: 1, x: -8 },
    inactive: { opacity: 0.5, x: 0 },
  };
  const span = {
    active: { opacity: 1, y: 0 },
    inactive: { opacity: 0.01, y: 5 },
  };
  return (
    <nav
      className={`flex ${
        backable ? "justify-between" : "justify-end"
      } items-start w-full px-8 py-8 my-0 md:pt-8 md:px-16 mx-auto`}
    >
      {backable && (
        <Link href={backTarget ? `/#${backTarget}` : "/"} passHref>
          <motion.a
            className="cursor-pointer px-4 pb-0 select-none text-xl"
            variants={a}
            animate={backIsActive ? "active" : "inactive"}
            onFocus={() => {
              setBackIsActive(true);
            }}
            onBlur={() => {
              setBackIsActive(false);
            }}
            onMouseOver={() => {
              setBackIsActive(true);
            }}
            onMouseLeave={() => {
              setBackIsActive(false);
            }}
          >
            <span className="font-bold">⟵</span>
            <motion.span
              className="ml-1 inline-block"
              transition={{ duration: 0.1 }}
              variants={span}
              animate={backIsActive ? "active" : "inactive"}
            >
              {backMessage ? backMessage : t("common:back")}
            </motion.span>
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
  );
};

export default MainNav;

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";

import ChangeLang from "./ChangeLang";
