import { CVAWithPerms } from "@/lib/CVAPermutations";
import { cn } from "@/lib/styling";
import { VariantProps } from "class-variance-authority";

export const [buttonVariants, permutations] = CVAWithPerms(
  cn(
    "select-none appearance-none",
    "relative whitespace-nowrap rounded-sm inline-flex items-center gap-1 align-middle outline-none focus-within:outline-none",
    "motion-safe:duration-fast-01 motion-safe:ease-expressive-standard transition-all",
    "border",
    "shadow-input ",
    "bg-gradient-to-b",
    "before:absolute before:inset-0 before:rounded-[inherit] before:shadow-lg before:shadow-gray-00/50 before:transition-all before:motion-safe:duration-fast-01 before:motion-safe:ease-expressive-standard",
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
          "disabled:opacity-60",
          "data-[state=on]:from-gray-A05 data-[state=on]:to-gray-A08",
          "data-[state=open]:from-gray-A05 data-[state=open]:to-gray-A08",
          "enabled:hover:border-gray-A08",
          "enabled:focus-visible:border-gray-A08",
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

export const buttonPermutations = permutations;

export type ButtonVariants = VariantProps<typeof buttonVariants>;

// Also, export the stuff from UnstyledButton to have all imports in from one file.
import { Button, ButtonProps, Spinner, ButtonGroup } from "./ClientButton";
export { Button, type ButtonProps, Spinner, ButtonGroup };
