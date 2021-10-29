const FABContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      css={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
      }}
    >
      {children}
    </Box>
  );
};

export default FABContainer;

import { Box } from "@/ui/primitives";
import { ReactNode } from "react";
