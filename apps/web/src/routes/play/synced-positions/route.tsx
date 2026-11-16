import { createFileRoute } from "@tanstack/react-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import { createStore, StoreApi } from "zustand/vanilla";
import { motion } from "motion/react";

type CursorPositionStore = {
  pos: { x: number; y: number };
  updatePos: (x: number, y: number) => void;
};
const LocalCursorPositionStoreContext = React.createContext<
  StoreApi<CursorPositionStore>
>(null!);
const LocalCursorPositionStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store] = useState(() =>
    createStore<CursorPositionStore>((set, get) => ({
      pos: { x: 0, y: 0 },
      updatePos: (x: number, y: number) => {
        set({ pos: { x, y } });
      },
    })),
  );

  return (
    <LocalCursorPositionStoreContext.Provider value={store}>
      {children}
    </LocalCursorPositionStoreContext.Provider>
  );
};

const Test = () => {
  const cursorPositionStore = useContext(LocalCursorPositionStoreContext);
  const updatePos = useStore(cursorPositionStore, (state) => state.updatePos);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updatePos(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    },
    [updatePos],
  );

  return (
    <div
      className="ak-layer ak-layer-darken-3 ak-frame ak-frame-card/0 ak-frame-bordering relative w-full h-16"
      onMouseMove={handleMouseMove}
    >
      <Crosshair />
    </div>
  );
};

const Crosshair = () => {
  const cursorPositionStore = useContext(LocalCursorPositionStoreContext);
  const pos = useStore(cursorPositionStore, (state) => state.pos);

  return (
    <motion.div
      className="ak-layer ak-layer-primary ak-layer-contrast ak-frame ak-frame-badge/0 absolute pointer-events-none h-1 w-1"
      style={pos}
    />
  );
};

function SyncedPositionsPlayPage() {
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
  );
}

export const Route = createFileRoute("/play/synced-positions")({
  component: SyncedPositionsPlayPage,
  head: () => ({
    meta: [{ title: "Synced positions — Play — Igor Bedesqui" }],
  }),
});
