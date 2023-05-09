"use client";

interface PopOver {
  content: React.ReactNode;
  Icon?: React.ForwardRefExoticComponent<any>; // TODO: I don't know if this is the right type, I got it from Radix Icons and it works 👺
  options?: VariantProps<typeof tooltipVariants> & {
    side?: "bottom" | "left" | "right" | "top" | undefined;
  };
}

const PopOver: React.FC<React.PropsWithChildren<PopOver>> = ({
  children,
  content,
  Icon = QuestionMarkCircledIcon,
  options,
}) => {
  const popoverState = usePopoverState({
    animated: true,
    placement: options?.side ?? "top",
    gutter: -8,
  });

  return (
    <>
      <PopoverDisclosure
        state={popoverState}
        className={cn([
          "group inline cursor-pointer select-text font-semibold duration-fast-02 ease-productive-standard focus-within:text-gray-12 hover:text-gray-12 aria-expanded:text-gray-12 motion-safe:transition-all",
        ])}
      >
        {children}
        <Icon className="inline text-gray-11 duration-fast-02 ease-productive-standard group-focus-within:text-gray-12 group-hover:text-gray-12 group-aria-expanded:text-gray-12 motion-safe:transition-all" />
      </PopoverDisclosure>
      <Portal
      // <div>s will cause a hydration mismatch when rendered inside a <p>, see: https://nextjs.org/docs/messages/react-hydration-error. Putting the Popover in a Portal prevents the issue.
      >
        <Popover
          state={popoverState}
          className={tooltipVariants({
            bg: options?.bg,
            maxW: options?.maxW,
            padding: options?.padding,
          })}
          data-dir={popoverState?.currentPlacement || "top"}
        >
          {content}
          <PopoverArrow
            className={arrowTooltipVariants({
              bg: options?.bg,
            })}
          />
        </Popover>
      </Portal>
    </>
  );
};

export default PopOver;

// TODO: these are the same styles as tooltip, extract these into a Disclosure generic style for reuse in both
const tooltipVariants = cva(
  [
    "inline-block",
    "shadow-sm border border-gray-7 rounded-sm transform motion-safe:transition-all duration-fast-02",
    "data-[dir=top]:origin-bottom",
    "data-[dir=bottom]:origin-top",
    "data-[enter]:opacity-100 data-[enter]:translate-y-0 data-[enter]:scale-100 data-[enter]:ease-productive-enter",
    "data-[leave]:opacity-0 data-[leave]:scale-0 data-[leave]:ease-productive-exit",
    "data-[dir=top]:data-[leave]:translate-y-1",
    "data-[dir=bottom]:data-[leave]:-translate-y-1",
  ],
  {
    variants: {
      bg: {
        standard: "bg-gray-1",
        subtle: "bg-gray-0",
      },
      padding: {
        none: "p-0",
        sm: "py-0.5 px-1",
        md: "py-1 px-2",
        lg: "p-4",
      },
      maxW: {
        full: "max-w-full",
        md: "max-w-[16rem]",
      },
    },
    defaultVariants: {
      bg: "standard",
      maxW: "md",
      padding: "lg",
    },
  }
);

const arrowTooltipVariants = cva("stroke-gray-7 filter drop-shadow-sm", {
  variants: {
    bg: {
      standard: "fill-gray-1",
      subtle: "fill-gray-0",
    },
  },
});

import {
  Popover,
  PopoverArrow,
  PopoverDisclosure,
  usePopoverState,
} from "ariakit/popover";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { cva, type VariantProps } from "class-variance-authority";
import { Portal } from "ariakit/portal";
import { cn } from "@/lib/styling";
