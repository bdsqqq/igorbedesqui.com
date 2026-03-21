import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { RootError } from "./routes/__root";

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultErrorComponent: RootError,
    scrollRestoration: true,
  });
  return router;
}
