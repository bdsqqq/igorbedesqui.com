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
  }, [backAnchor, history]);

  return (
    <nav
      className={cva(
        "flex justify-end items-start w-full p-8 md:px-16 md:mx-auto",
        {
          variants: {
            backable: {
              backable: "justify-between",
            },
          },
        }
      )({
        backable: backable ? "backable" : undefined,
      })}
    >
      {backable && (
        <Link
          href={anchor ? anchor : "/"}
          className="group cursor-pointer select-none flex items-center gap-1 px-4 -mx-4 pb-0 text-xl text-mauve11 transform translate-x-0 motion-safe:transition-all ease-productive-standard duration-moderate-01 hover:text-mauve12 hover:-translate-x-2 focus:text-mauve12 focus:-translate-x-2 focus-visible:outline outline-1 outline-offset-4 outline-mauve8 rounded-sm"
        >
          <span className="flex-shrink-0 translate-y-[1px]">
            {anchor === "/" ? <PinLeftIcon /> : <ArrowLeftIcon />}
          </span>
          <span className="ml-1 opacity-[0.01] motion-safe:transition-opacity ease-productive-standard duration-fast-02 group-hover:opacity-100 group-focus:opacity-100">
            {backMessage ? backMessage : "Back"}
          </span>
        </Link>
      )}
      <a
        className=" text-mauve12 outline outline-1 outline-offset-4 outline-mauve8 rounded-sm sr-only right-16 focus:!absolute focus:not-sr-only"
        href="#skip"
      >
        Skip to content
      </a>
    </nav>
  );
};

export default MainNav;

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHistory } from "@/contexts/History";

import { ArrowLeftIcon, PinLeftIcon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
