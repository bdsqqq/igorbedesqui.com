import { Test, LocalCursorPositionStoreProvider } from "./client"

export default function Page() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <LocalCursorPositionStoreProvider>
        <div className="w-96 grid grid-cols-3 gap-8">
          <Test />
          <Test />
          <Test />
          <Test />
          <Test />
          <Test />
          <Test />
          <Test />
          <Test />
          <Test />
          <Test />
        </div>
      </LocalCursorPositionStoreProvider>
    </div>
  )
}
