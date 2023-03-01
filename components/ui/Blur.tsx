import type { ReactNode } from "react";

export const Blur = ({ children }: { children: ReactNode }) => (
  <div
    tabIndex={0}
    className="text-gray-3 hover:text-gray-11 focus:text-gray-11 filter blur-sm  hover:blur-none focus:blur-none duration-moderate-02 transition-all ease-productive-standard group/blur"
  >
    {children}
  </div>
);
