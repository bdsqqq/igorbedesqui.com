const BackToTop = () => {
  const { t, lang } = useTranslation("common");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset >= 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <Button
      className={darkTheme}
      visible={isVisible}
      tabIndex={isVisible ? 0 : -1}
      onClick={scrollToTop}
      aria-label={t("backToTop")}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    </Button>
  );
};

const Button = styled("button", {
  cursor: "pointer",

  width: "3rem",
  height: "3rem",
  borderRadius: 9999,
  padding: "0.75rem",

  color: "$mauve12",
  backgroundColor: "$mauve3",
  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: "$mauve7",

  display: "hidden",
  opacity: "0",
  transform: "scale(0) translate(0, 5rem)",

  transitionDuration: "150ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",

  variants: {
    visible: {
      true: {
        display: "block",
        opacity: "1",
        transform: "scale(1) translate(0, 0)",
        transitionTimingFunction: "cubic-bezier(0, 0, 0.3, 1)",
      },
    },
  },

  "&:hover": {
    backgroundColor: "$mauve4",
    borderColor: "$mauve8",
  },

  "&:active, &:focus-visible, &:focus": {
    backgroundColor: "$mauve5",
    borderColor: "$mauve8",
  },
});

export default BackToTop;

import { styled, darkTheme } from "stitches.config";
import { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
