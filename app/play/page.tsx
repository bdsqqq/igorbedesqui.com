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
              <Upsell
                locked={walled}
                lockedContent={
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
              </Upsell>
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

import Popover from "@/components/ui/Popover";
import { useState } from "react";

const Upsell = ({
  children,
  locked,
  lockedContent,
}: React.PropsWithChildren<{
  locked: boolean;
  lockedContent: React.ReactNode;
}>) => {
  if (!locked) return <>{children}</>;

  return (
    <Popover content={lockedContent} Icon={React.Fragment}>
      <Slot
        onClick={() => {
          // do nothing
        }}
      >
        {children}
      </Slot>
    </Popover>
  );
};

const UpsellExample = () => {
  let canAddTeam = false; // this would come from somewhere else
  let hasReachedTeamLimit = false; // this would come from somewhere else
  let lockedContent = "placeholder"; // custom messages & actions based on the reason for locking

  return (
    <Upsell
      locked={!canAddTeam || hasReachedTeamLimit}
      lockedContent={lockedContent}
    >
      <Button
        onClick={(e) => {
          // add team to org
        }}
      >
        add +
      </Button>
    </Upsell>
  );
};

/* =========================================
    END SLOT STUFF
========================================= */

import * as React from "react";
import { composeRefs } from "@radix-ui/react-compose-refs";

/* -------------------------------------------------------------------------------------------------
 * Slot
 * -----------------------------------------------------------------------------------------------*/

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    // the new element to render is the one passed as a child of `Slottable`
    const newElement = slottable.props.children as React.ReactNode;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        // because the new element will be the one rendered, we are only interested
        // in grabbing its children (`newElement.props.children`)
        if (React.Children.count(newElement) > 1)
          return React.Children.only(null);
        return React.isValidElement(newElement)
          ? (newElement.props.children as React.ReactNode)
          : null;
      } else {
        return child;
      }
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});

Slot.displayName = "Slot";

/* -------------------------------------------------------------------------------------------------
 * SlotClone
 * -----------------------------------------------------------------------------------------------*/

interface SlotCloneProps {
  children: React.ReactNode;
}

const SlotClone = React.forwardRef<any, SlotCloneProps>(
  (props, forwardedRef) => {
    const { children, ...slotProps } = props;

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...mergeProps(slotProps, children.props),
        ref: forwardedRef
          ? composeRefs(forwardedRef, (children as any).ref)
          : (children as any).ref,
      });
    }

    return React.Children.count(children) > 1
      ? React.Children.only(null)
      : null;
  }
);

SlotClone.displayName = "SlotClone";

/* -------------------------------------------------------------------------------------------------
 * Slottable
 * -----------------------------------------------------------------------------------------------*/

const Slottable = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

/* ---------------------------------------------------------------------------------------------- */

type AnyProps = Record<string, any>;

function isSlottable(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child) && child.type === Slottable;
}

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // all child props should override
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          // differs from Radix's implementation, we make Slot override Children, not the other way around
          slotPropValue(...args);
        };
      }
      // but if it exists only on the slot, we use only this one
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    }
    // if it's `style`, we merge them
    else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

const Root = Slot;

export {
  Slot,
  Slottable,
  //
  Root,
};
export type { SlotProps };

/* =========================================
    END SLOT STUFF
========================================= */

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
