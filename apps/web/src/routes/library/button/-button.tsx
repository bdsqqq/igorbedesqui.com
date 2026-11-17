import { CVAWithPerms } from "@/lib/CVAPermutations";
import { cn } from "@/lib/styling";
import { VariantProps } from "class-variance-authority";

// Zero-specificity geometry lets canonical caller frame utilities override defaults.
// tailwind-merge does not recognize Ariakit shortcuts or their padding longhands.
export const [buttonVariants, buttonPermutations] = CVAWithPerms(
  cn(
    "select-none appearance-none",
    "relative whitespace-nowrap inline-flex items-center gap-1 align-middle",
    "motion-safe:duration-fast-01 motion-safe:ease-expressive-standard transition-all",
    "ak-layer ak-frame [:where(&)]:ak-frame-field/field",
    "focus-visible:ak-outline focus-visible:ak-outline-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:z-10",
    "disabled:ak-ink-0 aria-disabled:ak-ink-0",
  ),
  {
    variants: {
      size: {
        sm: "h-7 min-w-7 text-sm",
        md: "h-8 min-w-8 px-2 text-base",
      },
      variant: {
        primary: cn(
          "ak-layer-5",
          "data-[state=on]:ak-state-10 data-[state=open]:ak-state-10",
          "aria-pressed:ak-state-10 aria-expanded:ak-state-10",
          "enabled:hover:ak-state-5 enabled:focus-visible:ak-state-5",
          "enabled:active:ak-state-darken-5",
        ),
      },
      activeStyle: {
        scale: "enabled:active:scale-95",
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

export type ButtonVariants = VariantProps<typeof buttonVariants>;

// Also, export the stuff from UnstyledButton to have all imports in from one file.
import { Button, ButtonProps, Spinner, ButtonGroup } from "./-client-button";
export { Button, type ButtonProps, Spinner, ButtonGroup };
