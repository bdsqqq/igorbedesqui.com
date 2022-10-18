const variants = {
  base: "cursor-pointer select-none appearance-none inline-flex items-center gap-2 border border-transparent rounded-sm tracking-normal py-1 px-2 align-middle motion-safe:duration-moderate-01 motion-safe:ease-productive-standard outline-none focus-within:outline-none",
  size: {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  },
  color: {
    crimson:
      "text-crimson12 bg-crimson3 border-crimson7 hover:bg-crimson4 hover:border-crimson9 focus-within:bg-crimson4 focus-within:border-crimson9 active:bg-crimson6 active:border-crimson10",
    mauve:
      "text-mauve12 bg-mauve3 border-mauve7 hover:bg-mauve5 hover:border-mauve9 focus-within:bg-mauve5 focus-within:border-mauve9 active:bg-mauve7 active:border-mauve10",
  },
};

const Button = <button />;
const LinkButton: React.FC<
  LinkProps & { size?: "sm" | "md" | "lg"; color?: "crimson" | "mauve" }
> = ({ size = "lg", color = "mauve", children, ...rest }) => (
  <UnstyledLink
    className={clsx(variants.base, variants.size[size], variants.color[color])}
    {...rest}
  >
    {children}
  </UnstyledLink>
);

export { Button, LinkButton };

import { UnstyledLink } from "./primitives";
import type { LinkProps } from "next/link";
import clsx from "clsx";
