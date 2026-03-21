import {
  AnimatedElements,
  CursorPositionStoreProvider,
  CursorWithAttachedElement,
  CursorWithAttachedElementContent,
  CursorWithAttachedElementTrigger,
} from "./client";

export default function Page() {
  return (
    <CursorPositionStoreProvider>
      <div className="grid min-h-dvh place-items-center">
        <div className="flex gap-8">
          <CursorWithAttachedElement>
            <CursorWithAttachedElementTrigger>
              Bouncy
            </CursorWithAttachedElementTrigger>

            <CursorWithAttachedElementContent>
              <AnimatedElements animation="bouncy" />
            </CursorWithAttachedElementContent>
          </CursorWithAttachedElement>

          <CursorWithAttachedElement>
            <CursorWithAttachedElementTrigger>
              glitchy
            </CursorWithAttachedElementTrigger>

            <CursorWithAttachedElementContent>
              <AnimatedElements animation="glichy" />
            </CursorWithAttachedElementContent>
          </CursorWithAttachedElement>
        </div>
      </div>
    </CursorPositionStoreProvider>
  );
}
