const FABContainer = ({ children }: { children: ReactNode }) => {
  return <div className="fixed right-6 bottom-6">{children}</div>;
};

export default FABContainer;

import { ReactNode } from "react";
