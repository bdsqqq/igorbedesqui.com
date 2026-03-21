import { create } from "zustand";
import { useEffect, useSyncExternalStore } from "react";

const PATHNAME_CHANGE_EVENT = "pathnamechange";

function usePathname(): string {
  return useSyncExternalStore(
    (cb) => {
      const notify = () => cb();
      const dispatchPathnameChange = () =>
        window.dispatchEvent(new Event(PATHNAME_CHANGE_EVENT));
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;

      window.addEventListener("popstate", notify);
      window.addEventListener(PATHNAME_CHANGE_EVENT, notify);

      window.history.pushState = function (
        ...args: Parameters<History["pushState"]>
      ) {
        const result = originalPushState.apply(this, args);
        dispatchPathnameChange();
        return result;
      };
      window.history.replaceState = function (
        ...args: Parameters<History["replaceState"]>
      ) {
        const result = originalReplaceState.apply(this, args);
        dispatchPathnameChange();
        return result;
      };

      return () => {
        window.removeEventListener("popstate", notify);
        window.removeEventListener(PATHNAME_CHANGE_EVENT, notify);
        window.history.pushState = originalPushState;
        window.history.replaceState = originalReplaceState;
      };
    },
    () => window.location.pathname,
    () => "/",
  );
}

type BreadcrumbsState = {
  breadcrumbs: string[];
  add: (segment: string) => void;
};

export const useBreadcrumbsStore = create<BreadcrumbsState>((set) => ({
  breadcrumbs: [],
  add: (segment) =>
    set((state) => ({ breadcrumbs: [...state.breadcrumbs, segment] })),
}));

/** subscribe to pathname changes and append segments for MainNav */
export function HistoryTracker() {
  const pathname = usePathname();
  const currentSegment = `/${pathname?.split("/").at(-1) || ""}`;

  const { breadcrumbs, add } = useBreadcrumbsStore();

  useEffect(() => {
    console.log(breadcrumbs);
  }, [breadcrumbs]);

  useEffect(() => {
    add(currentSegment);
  }, [currentSegment, add]);

  return null;
}
