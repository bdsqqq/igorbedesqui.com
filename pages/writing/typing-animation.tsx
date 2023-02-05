// https://twitter.com/JCTecklenburg/status/1620822645142065153?t=lGXwhZLq3yZ5UZab-9nVxw&s=19
const linearText =
  "This typing animation is boring. It's a perfect linear reveal. It's straight forward to implement and achieves the desired effect most of the time.";

const wiggleText1 =
  "This typing animation is more lively. It feels like a human is actually typing.";
const wiggleText2 =
  "Instead of a linear reveal, adding a wiggle mimics how people type at different speeds and make mistakes.";
const wiggleText3 = `This works best with large blocks of text. It's a balancing act of wiggle ammount to get speed variation and a few "corrections" without constantly "re-writing" over and over again.`;

const TypingAnimation = () => {
  return (
    <Container>
      <Band gridless id="">
        <div className="flex flex-col gap-4 md:grid grid-cols-2">
          <div className="bg-gray-2 rounded p-4">
            <BoringTyping />
          </div>
          <div className="bg-gray-2 rounded p-4">
            <FluidTyping />
          </div>
        </div>
      </Band>
    </Container>
  );
};

const ResetButton = ({ resetFunction }: { resetFunction: () => void }) => {
  const [angle, setAngle] = useState(0);

  return (
    <Button
      className="h-8"
      onClick={() => {
        setAngle((prev) => prev + 360);
        resetFunction();
      }}
    >
      <ReloadIcon
        className="transition-all duration-slow-01 ease-expressive-entrance"
        style={{ transform: `rotate(${angle}deg)` }}
      />
    </Button>
  );
};

const BoringTyping = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= linearText.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="flex flex-col gap-2 justify-between items-end h-full">
      <TypingText text={linearText} current={current} msPerChar={50} />
      <ResetButton resetFunction={() => setCurrent(-4)} />
    </div>
  );
};

const FluidTyping = () => {
  const [current, setCurrent] = useState(-1);
  const [msPerChar, setMsPerChar] = useState(50);

  useEffect(() => {
    if (current >= wiggleText1.length + wiggleText2.length + wiggleText3.length)
      return;

    const interval = setInterval(() => {
      // random interval before typing next char
      setCurrent((prev) =>
        Math.random() > 0.015
          ? prev + Math.ceil(Math.random() * 2)
          : prev - Math.max(6, Math.ceil(Math.random() * 4))
      );
    }, msPerChar);
    setMsPerChar(Math.max(35, Math.ceil(Math.random() * 75)));
    return () => clearInterval(interval);
  }, [current, msPerChar]);

  return (
    <div className="flex flex-col gap-2 justify-between items-end h-full">
      <div className="space-y-2">
        <TypingText
          text={wiggleText1}
          current={current}
          msPerChar={msPerChar}
        />
        <TypingText
          text={wiggleText2}
          delay={wiggleText1.length}
          current={current}
          msPerChar={msPerChar}
        />
        <TypingText
          text={wiggleText3}
          delay={wiggleText1.length + wiggleText2.length}
          current={current}
          msPerChar={msPerChar}
        />
      </div>
      <ResetButton resetFunction={() => setCurrent(-4)} />
    </div>
  );
};

const TypingText = ({
  text,
  delay = 0,
  current,
  msPerChar,
}: {
  text: string;
  delay?: number;
  current: number;
  msPerChar: number;
}) => {
  const variants = {
    visible: {
      opacity: 1,
      transition: {
        duration: Math.min(msPerChar / 1000, 0.2),
      },
    },
    hidden: {
      transition: {
        duration: msPerChar / 1000,
      },
    },
    exit: {
      transition: {
        duration: msPerChar / 1000,
      },
    },
  };

  return (
    <p>
      {text.split("").map((char, charIndex) => {
        console.log(char);
        return (
          <motion.span
            custom={charIndex}
            key={`${text}-${char}-${charIndex}`}
            animate={current >= charIndex + delay ? "visible" : "hidden"}
            variants={variants}
            className="opacity-0"
          >
            {char}
          </motion.span>
        );
      })}
    </p>
  );
};

export default TypingAnimation;

import Band from "@/components/Band";
import Container from "@/components/Container";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { cx } from "class-variance-authority";
import { Button } from "@/components/ui/Button";
import { ReloadIcon } from "@radix-ui/react-icons";
