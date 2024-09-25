import { AnimatedElements, CursorWithAttachedElement } from "./client"

export default function Page() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="flex gap-8">
        <CursorWithAttachedElement attachedElementContent={<AnimatedElements animation="bouncy" />}>
          bouncy
        </CursorWithAttachedElement>

        <CursorWithAttachedElement attachedElementContent={<AnimatedElements animation="glichy" />}>
          glitchy
        </CursorWithAttachedElement>
      </div>
    </div>
  )
}
