import { createFileRoute, notFound } from "@tanstack/react-router";
import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
import zoro_webm from "./-zoro-lost.webm";
import zoro_mp4 from "./-zoro-lost.mp4";

/** Catch-all for unknown paths. `loader` + `notFound()` → HTTP 404 on SSR
 * (see `renderRouterToStream` + `router.stores.statusCode`);
 * UI is `notFoundComponent` when `match.status === "notFound"`. */
export const Route = createFileRoute("/$")({
  component: NotFound,
  notFoundComponent: NotFound,
  loader: () => {
    throw notFound({ throw: true });
  },
  head: () => ({
    meta: [
      { title: "404 — page not found — Igor Bedesqui" },
      {
        name: "description",
        content: "This page couldn't be found. How did you end up here?",
      },
    ],
  }),
});

function NotFound() {
  return (
    <Container backable>
      <HeroBand heroVideo={{ webm: zoro_webm, mp4: zoro_mp4 }}>
        <span className="text-gray-12">404</span>
        <br />
        how did you get here...?
        <br />
        this place doesn’t exist
      </HeroBand>
    </Container>
  );
}
