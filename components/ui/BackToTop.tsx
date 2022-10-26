const buttonVariants = cva(
  "cursor-pointer w-10 h-10 rounded-sm p-2 text-mauve12 bg-mauve3 border border-b-0 border-mauve7 transform transition-all duration-moderate-01  hover:bg-mauve4 hover:border-mauve8 active:bg-mauve5",
  {
    variants: {
      visible: {
        visible: "block opacity-100 translate-y-0 ease-productive-entrance",
        notVisible: "invisible opacity-0 translate-y-16 ease-productive-exit",
      },
    },
  }
);
const BackToTop = () => {
  const { t } = useTypeSafeTranslation("common");
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
    <button
      className={buttonVariants({
        visible: isVisible ? "visible" : "notVisible",
      })}
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
    </button>
  );
};

export default BackToTop;

import { useState, useEffect } from "react";
import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import { cva } from "class-variance-authority";
