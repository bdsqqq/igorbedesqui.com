// https://twitter.com/JCTecklenburg/status/1620822645142065153?t=lGXwhZLq3yZ5UZab-9nVxw&s=19

const text =
  "this typing animation is more lively. it feels like a human is actually typing quickly. it's more interesting";

const text2 =
  "instead of a linear reveal, adding a wiggle mimics how people type at different speeds and make mistakes.";

const text3 = `This works best with large blocks of text. It's a balancing act of wiggle ammount to get speed variation and a few "corrections" without constantly "re-writing" over and over again.`;

const TypingAnimation = () => {
  const [current, setCurrent] = useState(-1);
  const [msPerChar, setMsPerChar] = useState(75);
  const [spinAngle, setSpinAngle] = useState(0);

  const variants = {
    visible: {
      opacity: 1,
      // x: 0,
      transition: {
        duration: Math.min(msPerChar / 1000, 0.2),
        // delay: Math.random() * 0.07,
      },
    },
    hidden: {
      // opacity: 0,
      // x: -4,
      transition: {
        duration: msPerChar / 1000,
      },
    },
    exit: {
      // opacity: 0,
      // x: -8,
      transition: {
        duration: msPerChar / 1000,
      },
    },
  };

  useEffect(() => {
    if (current >= text3.length) return;

    const interval = setInterval(() => {
      // random interval before typing next char
      // if (Math.random() > 0.5) return;

      setCurrent((prev) =>
        Math.random() > 0.015
          ? prev + Math.ceil(Math.random() * 3)
          : prev - Math.max(6, Math.ceil(Math.random() * 8))
      );
    }, msPerChar);
    return () => clearInterval(interval);
  }, [current, msPerChar]);

  return (
    <Container>
      <Band gridless id="">
        <Button
          className="h-8"
          onClick={() => {
            setSpinAngle((prev) => prev + 360);
            setCurrent(-1);
          }}
        >
          <MotionReloadIcon
            animate={{
              rotate: spinAngle,
              transition: {
                duration: 0.5,
                ease: "easeInOut",
              },
            }}
          />
        </Button>
        <p className="text-2xl">
          {text3.split("").map((char, charIndex) => {
            console.log(char);
            return (
              <motion.span
                custom={charIndex}
                key={`${char}-${charIndex}`}
                animate={current >= charIndex ? "visible" : "hidden"}
                variants={variants}
                className="opacity-0"
              >
                {char}
              </motion.span>
            );
          })}
        </p>
      </Band>
    </Container>
  );
};

const MotionReloadIcon = motion(ReloadIcon);

export default TypingAnimation;

import Band from "@/components/Band";
import Container from "@/components/Container";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cx } from "class-variance-authority";
import { Button } from "@/components/ui/Button";
import { ReloadIcon } from "@radix-ui/react-icons";
