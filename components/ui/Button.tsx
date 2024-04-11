"use client";

export const Spinner = ({ ...props }: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      d="M8 1.5C9.19862 1.5 10.3739 1.83143 11.3959 2.45765C12.418 3.08388 13.2469 3.98051 13.7912 5.04843C14.3355 6.11635 14.5739 7.31398 14.48 8.50892C14.3862 9.70387 13.9638 10.8496 13.2594 11.8195L12.4529 11.2337C13.0492 10.4126 13.4068 9.44257 13.4863 8.43088C13.5658 7.41918 13.3639 6.40522 12.9031 5.50107C12.4423 4.59691 11.7405 3.83779 10.8752 3.3076C10.0099 2.77741 9.01481 2.4968 8 2.4968V1.5Z"
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
    "before:absolute before:inset-0 before:rounded before:shadow-lg before:shadow-gray-0/50 before:transition-all before:motion-safe:duration-fast-02 before:motion-safe:ease-expressive-standard",
  ),
  {
    variants: {
      size: {
        sm: "h-7 min-w-7 px-1.5 py-1.5 text-sm",
        md: "h-8 min-w-8 px-2 py-1.5 text-base",
      },
      variant: {
        primary: cn(
          "border-gray-A4",
          "shadow-gray-A3",
          "from-gray-A2 to-gray-A4",
          "hover:border-gray-A8",
          "focus-visible:border-gray-A8",
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
export const ButtonGroup = ({ children }: { children: React.ReactNode }) => {
  const stableId = React.useId();

  return (
    <div className="flex">
      {React.Children.map(children, (child, index) => {
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        const childWithProps = React.cloneElement(child as React.ReactElement, {
          className: cn(
            (child as React.ReactElement).props.className,
            !isFirst && "rounded-l-none border-l-0",
            !isLast && "rounded-r-none border-r-0",
          ),
          key: `${stableId}-${index}`,
        });

        return (
          <>
            {childWithProps}
            {!isLast && <span className="bg-gray-07 h-auto w-px" />}
          </>
        );
      })}
    </div>
  );
};

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
import React, { ComponentPropsWithoutRef, HtmlHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { UnstyledLinkProps } from "@/components/ui/primitives/UnstyledLink";
import {
  PrimitiveButtonProps,
  Root as ToggleRoot,
  ToggleProps,
} from "@radix-ui/react-toggle";
