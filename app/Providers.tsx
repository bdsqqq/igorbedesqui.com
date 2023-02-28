"use client";

import { HistoryProvider } from "@/contexts/AppDirHistory";
import { MDXProvider } from "@mdx-js/react";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
import Popover from "@/components/ui/Popover";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <HistoryProvider>
      <MDXProvider
        components={{
          // @ts-ignore
          a: (props) => <StyledLinkWithIcon {...props} />,
          h1: (props) => (
            <h1 className="text-2xl text-gray-11 mb-8" {...props} />
          ),
          h2: (props) => <h1 className="text-lg font-bold my-2" {...props} />,
          strong: (props) => (
            <strong className="font-bold text-gray-12" {...props} />
          ),
          pre: (props) => (
            <pre
              className="bg-gray-2 rounded p-4 my-2 overflow-x-auto text-sm"
              {...props}
            />
          ),
          Popover: (props) => <Popover {...props} />,
        }}
      >
        {children}
      </MDXProvider>
    </HistoryProvider>
  );
};
