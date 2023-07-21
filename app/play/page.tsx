"use client";

import Container from "@/components/Container";
import { Stage, StagesWrap } from "@/components/Stage";
import { Button } from "@/components/ui/Button";
import { CVAWithPerms } from "@/lib/CVAPermutations";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/styling";
import { Border } from "@/components/ui/Border";
import Image from "next/image";
import Band from "@/components/Band";
import Link from "@/components/ui/StyledLink";

const Page = () => {
  const [count, setCount] = useState(0);
  const [walled, setWalled] = useState(false);
  const toggleWalled = () => setWalled((prev) => !prev);
  const increment = () => setCount((prev) => prev + 1);

  return (
    <Container>
      <div className="flex flex-col gap-16">
        <Band headline={{ bold: "01", thin: "Permutations" }}>
          <Permutations />
        </Band>
        <Band headline={{ bold: "02", thin: "Border" }}>
          <BorderExamples />
        </Band>
        <Band headline={{ bold: "03", thin: "Composition" }}>
          <div className="flex items-center justify-center gap-8">
            <Stage>
              <Button onClick={toggleWalled}>Toggle lock</Button>
            </Stage>
            <Stage title={`${!walled ? "unlocked" : "locked"}`}>
              <Lock
                locked={walled}
                lockedFeedback={
                  <>
                    You reached the team limit in your license,{" "}
                    <Link href="/">Upgrade</Link>
                    to add more
                  </>
                }
              >
                <Button className="font-normal" onClick={increment}>
                  add +
                </Button>
              </Lock>
            </Stage>
            <Stage title={"count"}>
              <span className="block w-12 text-center">{count}</span>
            </Stage>
          </div>
        </Band>
      </div>
    </Container>
  );
};

import { useState } from "react";
import { Lock } from "@/components/ui/Lock";

/* =========================================
    PERMUTATION STUFF 
========================================= */
function replaceLeafValuesWithDots(
  obj: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      Array.isArray(obj[key]) === false
    ) {
      result[key] = replaceLeafValuesWithDots(obj[key]);
    } else {
      result[key] = "...";
    }
  }

  return result;
}

const cvaConfig = {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl",
    },
    intent: {
      primary: [
        "border-gray-A4",
        "shadow-gray-A3",
        "from-gray-A2 to-gray-A4",
        "hover:border-gray-A8",
        "focus-visible:border-gray-A8",
      ],
    },
  },
};

const [variants, permutations] = CVAWithPerms(
  cn(
    "select-none appearance-none",
    "relative rounded-sm px-2 py-1 inline-flex items-center gap-2 align-middle outline-none focus-within:outline-none",
    "motion-safe:duration-fast-01 motion-safe:ease-expressive-standard transition-all",
    "border",
    "shadow-input ",
    "bg-gradient-to-tr",
    "active:scale-95",
    "before:absolute before:inset-0 before:rounded before:shadow-lg before:shadow-gray-0/50 before:transition-all before:motion-safe:duration-fast-02 before:motion-safe:ease-expressive-standard"
  ),
  cvaConfig
);

const variantsPlaceholder = replaceLeafValuesWithDots(cvaConfig);
const Permutations = () => {
  return (
    <div className="flex items-center gap-6">
      <div className="max-w-sm">
        <pre className="">{JSON.stringify(variantsPlaceholder, null, 2)}</pre>
      </div>
      <div className="h-4 w-4 text-base">
        <ArrowRightIcon />
      </div>
      <div className="">
        <pre>{JSON.stringify(permutations, null, 2)}</pre>
      </div>
      <div className="h-4 w-4 text-base">
        <ArrowRightIcon />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        {permutations &&
          permutations.map((permutation) => (
            <Stage
              key={`${Object.values(permutation).join(" ")}`}
              className=""
              title={`${Object.values(permutation).join(" ")}`}
            >
              <Button {...permutation}>Hej do</Button>
            </Stage>
          ))}
      </div>
    </div>
  );
};
/* =========================================
  END PERMUTATION STUFF 
========================================= */

const BorderExamples = () => {
  return (
    <div className="flex items-center justify-center gap-6">
      <Border>
        <div className="h-44 w-44 bg-gradient-to-l from-gray-A7 to-gray-A4" />
      </Border>
      <Border asWrapper className="max-w-sm rounded">
        <video
          className=""
          autoPlay={false}
          controls={true}
          loop={true}
          muted={true}
        >
          <source
            src="/videos/the-manual/reading_progress.webm"
            type="video/webm"
          />
          <source
            src="/videos/the-manual/reading_progress.mp4"
            type="video/mp4"
          />
        </video>
      </Border>
      <Border asWrapper className="rounded">
        <Image
          className="w-full rounded"
          alt=""
          src={"/images/projs/the-manual/2.jpg"}
          width={685}
          height={993}
        />
      </Border>
    </div>
  );
};

export default Page;
