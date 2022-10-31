const FABContainer = ({ children }: { children: ReactNode }) => {
  return <div className="fixed right-8 md:right-16 bottom-0">{children}</div>;
};

export default FABContainer;

import { ReactNode } from "react";
