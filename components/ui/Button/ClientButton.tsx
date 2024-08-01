"use client";

type TogglePropsWithoutPrimitiveButtonProps = Omit<
  ToggleProps,
  keyof PrimitiveButtonProps
>;
type TogglePropsWithValuesAsNever = {
  [K in keyof TogglePropsWithoutPrimitiveButtonProps]: never;
};

interface BaseButtonProps {
  loading?: boolean;
  icon?:
    | React.ReactNode
    | {
        left?: React.ReactNode;
        right?: React.ReactNode;
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
 * type guard to check if an icon prop is an oject with left and right OR a single element
 */
const isIconObject = (
  icon: BaseButtonProps["icon"],
): icon is { left?: React.ReactNode; right?: React.ReactNode } => {
  return (
    typeof icon === "object" &&
    icon !== null &&
    ("left" in icon || "right" in icon)
  );
};
/**
 * Content rendered by buttons, handles swapping item with loading when appropriate
 * Used to share content between Button and ButtonLink
 */
const ButtonContent = ({
  icon,
  loading,
  children,
}: Pick<BaseButtonProps, "icon" | "loading"> & {
  children: React.ReactNode;
}) => {
  const iconObj = isIconObject(icon)
    ? icon // position is specified, use that
    : {
        left: icon, // if no position is specified, assume left
        right: undefined,
      };
  const spinner = <Spinner className="animate-spin" />;

  const leftIcon =
    // use left icon for spinner unless right icon is the only one defined.
    loading && !(!iconObj.left && iconObj.right) ? spinner : iconObj.left;
  const rightIcon =
    // use right icon for spinner unless left icon is defined.
    loading && !iconObj.left ? spinner : iconObj.right;

  /**
   * if this is an iconOnly button (AKA: no children), we don't want to render empty nodes for the extra gap space.
   */
  const maybeSpacer = children ? <span /> : null;

  return (
    <>
      {leftIcon ? leftIcon : maybeSpacer}
      {children}
      {rightIcon ? rightIcon : maybeSpacer}
    </>
  );
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseButtonProps,
    TogglePropsWithValuesAsNever,
    ButtonVariants {
  asChild?: boolean;
  toggle?: false;
}

export interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseButtonProps,
    ToggleProps,
    ButtonVariants {
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
      activeStyle,
      asChild = false,
      loading: _loading,
      icon,
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
        className={cn(
          buttonVariants({ variant, size, activeStyle, className }),
        )}
        ref={ref}
        {...props}
      >
        <ButtonContent icon={icon} loading={loading}>
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
    ButtonVariants {}

export const LinkButton = React.forwardRef<
  HTMLAnchorElement,
  LinkButtonProps & { children: React.ReactNode }
>(
  (
    {
      className,
      variant,
      size,
      activeStyle,
      loading: _loading,
      loadingStrategy = "delay",
      icon,
      children,
      ...props
    },
    ref,
  ) => {
    const loading = useArtificialDelay(_loading, loadingStrategy);

    return (
      <UnstyledLink
        className={cn(
          buttonVariants({ variant, size, activeStyle, className }),
        )}
        ref={ref}
        {...props}
      >
        <ButtonContent icon={icon} loading={loading}>
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

// prettier-ignore
export const Spinner = ({ ...props }: React.ComponentProps<"svg">) => (<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12.6561 7.46354C12.6365 4.6326 10.3356 2.34375 7.5 2.34375V1.40625C7.81512 1.40625 8.12851 1.43068 8.4375 1.47879C9.23048 1.60226 9.99444 1.88168 10.684 2.30422C11.6422 2.89142 12.4194 3.73216 12.9296 4.7335C13.4398 5.73483 13.6631 6.85775 13.575 7.97811C13.5115 8.78432 13.2885 9.56661 12.9223 10.2807C12.78 10.5582 12.6161 10.8253 12.4316 11.0796L12.4299 11.0818L11.6718 10.531C12.2855 9.68777 12.6497 8.65135 12.6562 7.53016C12.6563 7.50794 12.6563 7.48574 12.6561 7.46354Z"/></svg>);
// prettier

import { UnstyledLink } from "../primitives";
import { cn } from "@/lib/styling";
import React, { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { UnstyledLinkProps } from "@/components/ui/primitives/UnstyledLink";
import {
  PrimitiveButtonProps,
  Root as ToggleRoot,
  ToggleProps,
} from "@radix-ui/react-toggle";
import { ButtonVariants, buttonVariants } from "@/components/ui/Button";
