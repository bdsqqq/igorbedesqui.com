"use client";

import { MDXProvider } from "@mdx-js/react";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
import Popover from "@/components/ui/Popover";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HistoryTracker />
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
    </>
  );
};

import { create } from "zustand";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// TODO: maybe move this to nav since it's the only thing that uses it?? then this whole file can be deleted yay. Just not sure if it will work since Nav remounts on navigation
type BreadcrumbsState = {
  breadcrumbs: string[];
  add: (segment: string) => void;
};
export const useBreadcrumbsStore = create<BreadcrumbsState>((set) => ({
  breadcrumbs: [],
  add: (segment) =>
    set((state) => ({ breadcrumbs: [...state.breadcrumbs, segment] })),
  // remove: () => set({ bears: 0 }),
}));
const HistoryTracker = () => {
  const pathname = usePathname();
  const currentSegment = `/${pathname?.split("/").at(-1) || ""}`;

  const { breadcrumbs, add } = useBreadcrumbsStore();

  useEffect(() => {
    console.log(breadcrumbs);
  }, [breadcrumbs]);

  useEffect(() => {
    add(currentSegment);
  }, [currentSegment, add]);

  return <></>;
};
