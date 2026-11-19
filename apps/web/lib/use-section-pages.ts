import { useRouter } from "@tanstack/react-router";
import { sectionPages } from "./route-catalog";

export function useSectionPages(section: string) {
  const router = useRouter();
  return sectionPages(Object.values(router.routesById), section);
}
