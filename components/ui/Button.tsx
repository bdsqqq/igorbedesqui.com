"use client";

export const Spinner = ({ ...props }: React.ComponentProps<"svg">) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.6561 7.46354C12.6365 4.6326 10.3356 2.34375 7.5 2.34375V1.40625C7.81512 1.40625 8.12851 1.43068 8.4375 1.47879C9.23048 1.60226 9.99444 1.88168 10.684 2.30422C11.6422 2.89142 12.4194 3.73216 12.9296 4.7335C13.4398 5.73483 13.6631 6.85775 13.575 7.97811C13.5115 8.78432 13.2885 9.56661 12.9223 10.2807C12.78 10.5582 12.6161 10.8253 12.4316 11.0796L12.4299 11.0818L11.6718 10.531C12.2855 9.68777 12.6497 8.65135 12.6562 7.53016C12.6563 7.50794 12.6563 7.48574 12.6561 7.46354Z"
      fill="currentColor"
    />
  </svg>
);

type TogglePropsWithoutPrimitiveButtonProps = Omit<
  ToggleProps,
  keyof PrimitiveButtonProps
>;
type TogglePropsWithValuesAsNever = {
  [K in keyof TogglePropsWithoutPrimitiveButtonProps]: never;
};

/** Map of modifier keys to their KeyboardEvent properties
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState MDN Reference}
 */
export type ModifierKey = (typeof ModifierKeys)[number];

export const ModifierKeys = [
  "Accel",
  "Alt" /* Full Browser Support */,
  "AltGraph" /* Full Browser Support */,
  "CapsLock" /* Full Browser Support */,
  "Control" /* Full Browser Support */,
  "Fn",
  "Meta" /* Full Browser Support */,
  "NumLock",
  "OS",
  "ScrollLock",
  "Shift" /* Full Browser Support */,
  "Symbol",
] as const;

const ModifierToElement = {
  Accel: "⌘",
  Alt: "⌥",
  AltGraph: "AltGr",
  CapsLock: "Caps",
  Control: "Ctrl",
  Fn: "Fn",
  Meta: "⌘",
  NumLock: "Num",
  OS: "OS",
  ScrollLock: "Scroll",
  Shift: "⇧",
  Symbol: "Sym",
} as const;

export const Shortcut = ({
  children,
  modifier,
}: {
  children: string;
  modifier?: ModifierKey[];
}) => {
  const stableId = React.useId();

  return (
    <span className="flex items-center gap-0.5">
      {modifier?.map((mod) => (
        <kbd
          className="rounded-[3px] border border-[#00000055] bg-[#00000008] px-1 py-px text-sm leading-none"
          key={`${stableId}-${mod}`}
        >
          {ModifierToElement[mod]}
        </kbd>
      ))}
      <kbd className="rounded-[3px] border border-[#00000055] bg-[#00000008] px-1 py-px text-sm uppercase leading-none">
        {children}
      </kbd>
    </span>
  );
};

const buttonVariants = cva(
  cn(
    "select-none appearance-none",
    "relative rounded-sm inline-flex items-center gap-2 align-middle outline-none focus-within:outline-none",
    "motion-safe:duration-fast-01 motion-safe:ease-expressive-standard transition-all",
    "border",
    "shadow-input ",
    "bg-gradient-to-tr",
    "before:absolute before:inset-0 before:rounded before:shadow-lg before:shadow-gray-00/50 before:transition-all before:motion-safe:duration-fast-02 before:motion-safe:ease-expressive-standard",
  ),
  {
    variants: {
      size: {
        sm: "h-7 min-w-7 px-1.5 py-1.5 text-sm",
        md: "h-8 min-w-8 px-2 py-1.5 text-base",
      },
      variant: {
        primary: cn(
          "border-gray-A04",
          "shadow-gray-A03",
          "from-gray-A02 to-gray-A04",
          "data-[state=on]:from-gray-A03 data-[state=on]:to-gray-A05",
          "data-[state=open]:from-gray-A03 data-[state=open]:to-gray-A05",
          "hover:border-gray-A08",
          "focus-visible:border-gray-A08",
        ),
      },
      activeStyle: {
        scale: "active:scale-95",
        none: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
      activeStyle: "scale",
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface BaseButtonProps {
  loading?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  shortcut?: {
    key: string;
    modifier?: ModifierKey[];
  };
  /**
   * minimum artificial delays
   * - minimumDuration: shows spinner for at least 500ms
   * - delay: don't show spinner if response is less than 100ms
   * - immediate: normal behavior
   * @default "delay"
   */
  loadingStrategy?: loadingStrategy;
}

/**
 * Content rendered by buttons, handles swapping item with loading when appropriate
 * Used to share content between Button and ButtonLink
 */
const ButtonContent = ({
  left,
  loading,
  children,
  shortcut,
  right,
}: Pick<BaseButtonProps, "left" | "loading" | "shortcut" | "right"> & {
  children: React.ReactNode;
}) => {
  const Left = loading ? <Spinner className="animate-spin" /> : left;

  return (
    <>
      {Left}
      {children || shortcut ? (
        <span className="inline-flex gap-1">
          {children}
          {shortcut && (
            <Shortcut modifier={shortcut.modifier}>{shortcut.key}</Shortcut>
          )}
        </span>
      ) : null}
      {right}
    </>
  );
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseButtonProps,
    TogglePropsWithValuesAsNever,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  toggle?: false;
}

export interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseButtonProps,
    ToggleProps,
    VariantProps<typeof buttonVariants> {
  asChild?: false;
  toggle: true;
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps | ToggleButtonProps
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading: _loading,
      left,
      right,
      shortcut,
      children,
      loadingStrategy = "delay",
      toggle,
      ...props
    },
    ref,
  ) => {
    const loading = useArtificialDelay(_loading, loadingStrategy);

    const CompIfNotAsChild = toggle ? ToggleRoot : "button";
    const Comp = asChild ? Slot : CompIfNotAsChild;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <ButtonContent
          left={left}
          loading={loading}
          shortcut={shortcut}
          right={right}
        >
          {children}
        </ButtonContent>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export interface LinkButtonProps
  extends UnstyledLinkProps,
    BaseButtonProps,
    VariantProps<typeof buttonVariants> {}

export const LinkButton = React.forwardRef<
  HTMLAnchorElement,
  LinkButtonProps & { children: React.ReactNode }
>(
  (
    {
      className,
      variant,
      size,
      loading: _loading,
      loadingStrategy = "delay",
      shortcut,
      left,
      right,
      children,
      ...props
    },
    ref,
  ) => {
    const loading = useArtificialDelay(_loading, loadingStrategy);

    return (
      <UnstyledLink
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <ButtonContent
          left={left}
          loading={loading}
          shortcut={shortcut}
          right={right}
        >
          {children}
        </ButtonContent>
      </UnstyledLink>
    );
  },
);
LinkButton.displayName = "ButtonLink";

/**
 * Group of buttons
 * Takes buttons, removes the borders that would get doubled, makes only the outer ones rounded.
 */
export const ButtonGroup = forwardRef<
  ElementRef<"div">,
  ComponentPropsWithoutRef<"div"> & {
    orientation?: "horizontal" | "vertical";
  }
>(({ children, className, orientation = "horizontal" }, ref) => {
  const stableId = React.useId();

  const isHorizontal = orientation === "horizontal";

  return (
    <div
      ref={ref}
      className={cn("flex", !isHorizontal ? "flex-col" : "", className)}
    >
      {React.Children.map(children, (child, index) => {
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        const childWithProps = React.cloneElement(child as React.ReactElement, {
          className: cn(
            (child as React.ReactElement).props.className,
            !isFirst && isHorizontal
              ? "rounded-l-none border-l-0"
              : "rounded-t-none border-t-0",
            !isLast && isHorizontal
              ? "rounded-r-none border-r-0"
              : "rounded-b-none border-b-0",
          ),
          key: `${stableId}-${index}`,
        });

        return (
          <>
            {childWithProps}
            {!isLast && (
              <span
                className={cn(
                  "bg-gray-07",
                  isHorizontal ? "h-auto w-px" : "h-px w-full",
                )}
              />
            )}
          </>
        );
      })}
    </div>
  );
});
ButtonGroup.displayName = "ButtonGroup";

type loadingStrategy = "minimumDuration" | "delay" | "immediate";
const useArtificialDelay = (
  loading: boolean | undefined,
  /**
   * minimum artificial delays
   * - minimumDuration: shows spinner for at least 500ms
   * - delay: don't show spinner if response is less than 100ms
   * - immediate: normal behavior
   * @default "delay"
   */
  loadingStrategy: loadingStrategy = "delay",
) => {
  // loading strategy is based on https://x.com/JohnPhamous/status/1679271160570327040?s=20
  const [isLoading, setLoading] = React.useState(loading);
  const artificialDelayPromiseRef = React.useRef<Promise<void>>();

  const minimumDurationCallback = React.useCallback(() => {
    setLoading(true);
    artificialDelayPromiseRef.current = new Promise((resolve) =>
      setTimeout(resolve, 500),
    );
  }, []);

  const delayCallback = React.useCallback(() => {
    artificialDelayPromiseRef.current = new Promise((resolve) =>
      setTimeout(() => {
        setLoading(true);
        resolve();
      }, 100),
    );
  }, []);

  React.useEffect(() => {
    if (loadingStrategy === "immediate") {
      setLoading(loading);
      return;
    }

    if (loading) {
      if (loadingStrategy === "minimumDuration") {
        minimumDurationCallback();
      } else if (loadingStrategy === "delay") {
        delayCallback();
      }
    } else {
      void artificialDelayPromiseRef.current?.then(() => {
        setLoading(false);
      });
    }
  }, [loading, loadingStrategy, minimumDurationCallback, delayCallback]);

  return isLoading;
};

import { UnstyledLink } from "./primitives";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/styling";
import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  HtmlHTMLAttributes,
  forwardRef,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { UnstyledLinkProps } from "@/components/ui/primitives/UnstyledLink";
import {
  PrimitiveButtonProps,
  Root as ToggleRoot,
  ToggleProps,
} from "@radix-ui/react-toggle";
