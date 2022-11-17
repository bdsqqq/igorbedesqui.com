// const Separator = styled(SeparatorPrimitive.Root, {
//   backgroundColor: "$gray-6",
//   "&[data-orientation=horizontal]": { height: 1 },
//   "&[data-orientation=vertical]": { width: 1 },
// });

const Separator: React.FC<SeparatorPrimitive.SeparatorProps> = ({
  className,
  ...rest
}) => {
  return (
    <SeparatorPrimitive.Root
      className={cx(
        "bg-gray-4 radix-orientation-horizontal:h-[1px] radix-orientation-vertical:w-[1px]",
        className
      )}
      {...rest}
    />
  );
};

export default Separator;

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cx } from "class-variance-authority";
import React from "react";
