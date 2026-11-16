import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Container from "@/components/Container";
import { Stage } from "@/components/Stage";
import { Button } from "@/components/ui/Button";
import { CVAWithPerms } from "@/lib/CVAPermutations";
import { ArrowRightIcon, PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/styling";
import { Border } from "@/components/ui/Border";
import { Image } from "@/components/ui/Image";
import Band from "@/components/Band";
import Link from "@/components/ui/StyledLink";
import { Lock } from "@/components/ui/Lock";

import reading_progress_webm from "../work/the-manual/-reading_progress.webm";
import reading_progress_mp4 from "../work/the-manual/-reading_progress.mp4";
import manual_2 from "../work/the-manual/-2.jpg?as=img";

function replaceLeafValuesWithDots(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      Array.isArray(obj[key]) === false
    ) {
      result[key] = replaceLeafValuesWithDots(
        obj[key] as Record<string, unknown>,
      );
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
        "ak-layer-6",
        "hover:ak-state-6",
        "focus-visible:ak-outline focus-visible:outline-2",
      ],
    },
  },
};

const [, permutations] = CVAWithPerms(
  cn(
    "select-none appearance-none",
    "relative ak-layer ak-frame ak-frame-field/1 px-2 inline-flex items-center gap-2 align-middle",
    "motion-safe:duration-fast-01 motion-safe:ease-expressive-standard transition-all",
    "active:scale-95",
  ),
  cvaConfig,
);

const variantsPlaceholder = replaceLeafValuesWithDots(
  cvaConfig as unknown as Record<string, unknown>,
);

function Permutations() {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-6">
      <div className="min-w-0 max-w-sm overflow-x-auto">
        <pre>{JSON.stringify(variantsPlaceholder, null, 2)}</pre>
      </div>
      <div className="h-4 w-4 text-base">
        <ArrowRightIcon />
      </div>
      <div className="min-w-0 max-w-full overflow-x-auto">
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
}

function BorderExamples() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Border>
        <div className="ak-layer ak-layer-8 ak-frame ak-frame-card/0 h-44 w-44 bg-gradient-to-l from-(--ak-edge) to-(--ak-layer)" />
      </Border>
      <Border asWrapper className="max-w-sm">
        <video
          className="ak-frame ak-frame-cover ak-frame-start ak-frame-end"
          autoPlay={false}
          controls={true}
          loop={true}
          muted={true}
        >
          <source src={reading_progress_webm} type="video/webm" />
          <source src={reading_progress_mp4} type="video/mp4" />
        </video>
      </Border>
      <Border asWrapper>
        <Image
          className="ak-frame ak-frame-cover ak-frame-start ak-frame-end w-full"
          alt=""
          src={manual_2}
        />
      </Border>
    </div>
  );
}

function PlayIndexPage() {
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
          <div className="flex w-full flex-wrap items-center justify-center gap-8">
            <Stage>
              <Button aria-pressed={walled} onClick={toggleWalled}>
                Toggle lock
              </Button>
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
                <Button
                  loading={count % 2 === 0}
                  className="font-normal"
                  onClick={increment}
                  icon={<PlusIcon />}
                >
                  add
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
}

export const Route = createFileRoute("/play/")({
  component: PlayIndexPage,
  head: () => ({
    meta: [
      { title: "Play — Igor Bedesqui" },
      {
        name: "description",
        content: "Interactive experiments and component explorations.",
      },
    ],
  }),
});
