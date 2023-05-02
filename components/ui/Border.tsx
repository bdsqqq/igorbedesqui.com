import { cn } from "@/lib/styling";
import { HTMLProps } from "react";

export const shadowBorderStyles =
  "relative after:pointer-events-none after:absolute after:inset-0 after:block after:rounded-inherit after:shadow-[0px_0px_0px_1px_inset_--tw-shadow-color] after:shadow-gray-A7 overflow-hidden";

export const Border = ({ className, ...rest }: HTMLProps<HTMLDivElement>) => {
  return <div className={cn(shadowBorderStyles, className)} {...rest} />;
};
