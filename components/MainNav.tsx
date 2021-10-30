type MainNavProps =
  | {
      backable?: boolean;
      backMessage?: never;
      backAnchor?: string;
    }
  | {
      backable: true;
      backMessage?: string;
      backAnchor?: string;
    };

const MainNav: React.FC<MainNavProps> = ({
  backable,
  backMessage,
  backAnchor,
}) => {
  const { t } = useTranslation();

  const [backIsActive, setBackIsActive] = useState(false);

  const { history } = useHistory();
  const [anchor, setAnchor] = useState("/");
  useEffect(() => {
    let found = false;
    //loop trought history backwards until you get to 0 or until you get to the first match, matches can be the backAnchor or "/". Then feed this to the nextLink bellow and be happy
    //this can be expanded making the backanchor into an array and looping through it to find a match, in the current implementation a page can only have one anchor.
    for (let i = history.length - 1; i >= 0 && found == false; i--) {
      if (history[i] == backAnchor) {
        setAnchor(history[i]);
        found = true;
      }
      if (history[i] == "/") {
        found = true;
      }
    }
  }, []);

  const a = {
    active: { opacity: 1, x: -8 },
    inactive: { opacity: 0.8, x: 0 },
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
        <Link href={anchor ? anchor : "/"} passHref>
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
              className="ml-1"
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
        generalClasses="p-1 sm:p-2 lowercase select-none"
        activeClasses="font-bold text-mauve-mauve12"
        inactiveClasses="text-mauve-mauve11"
      />
    </nav>
  );
};

export default MainNav;

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { useHistory } from "@/contexts/History";
import ChangeLang from "@/components/ChangeLang";
