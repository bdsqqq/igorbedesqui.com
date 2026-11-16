import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  AnimatedElements,
  CursorWithAttachedElement,
  CursorWithAttachedElementTrigger,
  CursorWithAttachedElementContent,
  useBouncyTooltipStore,
} from "@/components/features/bouncy-tooltip";
import type { StaticImageData } from "@/lib/static-image";
import theManual1 from "../../work/the-manual/-1.jpg?as=img";
import bebopDesktop from "../../work/bebop/-desktop-screenshot.png?as=img";

const media: Array<
  | { key: string; src: StaticImageData; type: "image" }
  | { key: string; src: string; type: "video" }
> = [
  {
    key: "the-manual",
    src: theManual1,
    type: "image",
  },
  {
    key: "bebop-desktop",
    src: bebopDesktop,
    type: "image",
  },
  {
    key: "profile-video",
    src: "https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/sRGuzPg7aefddqqyQhgHTZi2sM53/rDbRz9x7nIoBUpLrGOP3/624244f2-1e6d-461b-b189-e0d1c4750ebe.mp4?_a=DATAdtAAZAA0",
    type: "video",
  },
];

// The fullscreen demo deliberately tracks the whole viewport. Embedded features do not.
function GlobalPointerTracking() {
  const store = useBouncyTooltipStore();
  useEffect(() => {
    const move = (event: MouseEvent) =>
      store.getState().updatePos(event.clientX, event.clientY);
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [store]);
  return null;
}

function BouncyTooltipPlayPage() {
  return (
    <>
      <div className="grid min-h-dvh place-items-center">
        <div className="flex gap-8">
          <CursorWithAttachedElement>
            <GlobalPointerTracking />
            <CursorWithAttachedElementTrigger>
              Bouncy
            </CursorWithAttachedElementTrigger>

            <CursorWithAttachedElementContent>
              <AnimatedElements media={media} animation="bouncy" />
            </CursorWithAttachedElementContent>
          </CursorWithAttachedElement>

          <CursorWithAttachedElement>
            <GlobalPointerTracking />
            <CursorWithAttachedElementTrigger>
              glitchy
            </CursorWithAttachedElementTrigger>

            <CursorWithAttachedElementContent>
              <AnimatedElements media={media} animation="glichy" />
            </CursorWithAttachedElementContent>
          </CursorWithAttachedElement>
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/play/bouncy-tooltip")({
  component: BouncyTooltipPlayPage,
  head: () => ({
    meta: [{ title: "Bouncy tooltip — Play — Igor Bedesqui" }],
  }),
});
