"use client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <HistoryTracker />
      {children}
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
