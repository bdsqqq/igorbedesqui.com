const FABContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed right-8 bottom-0 z-[39] md:right-16">{children}</div>
  );
};

export default FABContainer;

import { ReactNode } from "react";
