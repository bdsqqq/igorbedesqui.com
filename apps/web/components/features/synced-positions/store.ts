import { createStore } from "zustand/vanilla";

export type Position = { x: number; y: number };
export type CursorPositionState = {
  pos: Position;
  updatePos: (x: number, y: number) => void;
  reset: () => void;
};
export function createCursorPositionStore(
  initialPosition: Position = { x: 0, y: 0 },
) {
  const seed = { ...initialPosition };
  return createStore<CursorPositionState>((set) => ({
    pos: { ...seed },
    updatePos: (x, y) => set({ pos: { x, y } }),
    reset: () => set({ pos: { ...seed } }),
  }));
}
export type CursorPositionStore = ReturnType<typeof createCursorPositionStore>;
