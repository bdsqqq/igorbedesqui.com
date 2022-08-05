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
  const { t } = useTypeSafeTranslation("common");
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
    <Nav backable={backable}>
      {backable && (
        <Link href={anchor ? anchor : "/"} passHref>
          <BackLink>
            <Span
              css={{
                flexShrink: "0",
                "& > *": {
                  height: "20px",
                  width: "20px",
                },
              }}
            >
              {anchor === "/" ? <PinLeftIcon /> : <ArrowLeftIcon />}
            </Span>
            <span id="backMessage">
              {backMessage ? backMessage : t("back")}
            </span>
          </BackLink>
        </Link>
      )}
      <SrOnly as="a" href="#skip">
        {t("skip")}
      </SrOnly>
      <ChangeLang />
    </Nav>
  );
};

const Nav = styled("nav", {
  display: "flex",
  justifyContent: "end",
  alignItems: "flex-start",

  width: "100%",
  px: "2rem",
  py: "2rem",
  marginY: 0,

  "@md": {
    px: "4rem",
    marginX: "auto",
  },

  variants: {
    backable: {
      true: {
        justifyContent: "space-between",
      },
    },
  },
});

const BackLink = styled("a", {
  cursor: "ponter",
  userSelect: "none",

  display: "flex",
  alignItems: "center",
  gap: "0.25rem",

  px: "1rem",
  paddingBottom: "0",

  fontSize: "$lg",
  lineHeight: "1.75rem",
  color: "$mauve11",

  transform: "translate(0)",

  "@motionOk": {
    transitionProperty: "color, transform",

    transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",
    transitionDuration: "150ms",
  },

  "& #backMessage": {
    marginLeft: "0.25rem",

    opacity: "0.01",

    "@motionOk": {
      transitionProperty: "opacity",

      transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",
      transitionDuration: "110ms",
    },
  },

  "&:hover, &:focus": {
    color: "$mauve12",
    transform: "translate(-8px)",

    "& #backMessage": {
      opacity: "1",
    },
  },
});

export default MainNav;

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import { useHistory } from "@/contexts/History";
import ChangeLang from "@/components/i18nStuff/ChangeLang";

import { styled } from "stitches.config";
import { Span, SrOnly } from "@/ui/primitives";

import { ArrowLeftIcon, PinLeftIcon } from "@radix-ui/react-icons";
