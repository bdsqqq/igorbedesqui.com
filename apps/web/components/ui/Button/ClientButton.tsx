"use client";

type BaseButtonProps = {
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
};

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

export type ButtonProps = React.ComponentPropsWithRef<typeof AriakitButton> &
  BaseButtonProps &
  ButtonVariants;

export function Button({
  className,
  variant,
  size,
  activeStyle,
  loading: _loading,
  icon,
  children,
  loadingStrategy = "delay",
  ...props
}: ButtonProps) {
  const loading = useArtificialDelay(_loading, loadingStrategy);

  const iconObj = isIconObject(icon)
    ? icon
    : {
        left: icon,
        right: undefined,
      };

  const spinner = <Spinner className="animate-spin" />;

  const leftIcon =
    /** use left icon for spinner unless right icon is the only one defined. */
    loading && !(!iconObj.left && iconObj.right) ? spinner : iconObj.left;
  const rightIcon =
    /** use right icon for spinner unless left icon is defined. */
    loading && !iconObj.left ? spinner : iconObj.right;

  /**
   * if this is an iconOnly button (AKA: no children), we don't want to render empty nodes for the extra gap space.
   */
  const maybeSpacer = children ? <span /> : null;

  return (
    <AriakitButton
      className={cn(buttonVariants({ variant, size, activeStyle, className }))}
      {...props}
    >
      {leftIcon ? leftIcon : maybeSpacer}
      {children}
      {rightIcon ? rightIcon : maybeSpacer}
    </AriakitButton>
  );
}

export const BUTTON_GROUP_DISPLAY_NAME = "ButtonGroup";
/**
 * Group of buttons
 * Joined frames share one seam and keep only their outer corners rounded.
 */
export const ButtonGroup = ({
  children,
  className,
  orientation = "horizontal",
  ref,
  ...props
}: ComponentPropsWithRef<"div"> & {
  orientation?: "horizontal" | "vertical";
}) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "ak-frame [:where(&)]:ak-frame-field/0 ak-frame-join flex",
        orientation === "vertical" ? "ak-frame-col flex-col" : "ak-frame-row",
        className,
      )}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<{ className?: string }>(child)) return child;

        return React.cloneElement(child, {
          className: cn(
            child.props.className,
            "ak-frame-join-item hover:ak-frame-join-active aria-pressed:ak-frame-join-active data-[state=on]:ak-frame-join-active",
          ),
        });
      })}
    </div>
  );
};
ButtonGroup.displayName = BUTTON_GROUP_DISPLAY_NAME;

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
  const artificialDelayPromiseRef = React.useRef<Promise<void>>(undefined);

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

import { cn } from "@/lib/styling";
import React, { ComponentPropsWithRef } from "react";
import { ButtonVariants, buttonVariants } from "@/components/ui/Button";

import { Button as AriakitButton } from "@ariakit/react";
