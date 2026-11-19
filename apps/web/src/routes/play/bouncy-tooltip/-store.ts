import { createStore } from "zustand/vanilla";

export type BouncyTooltipPosition = { x: number; y: number };
export type BouncyTooltipState = {
  pos: BouncyTooltipPosition;
  isHovering: boolean;
  updatePos: (x: number, y: number) => void;
  setIsHovering: (value: boolean) => void;
  reset: () => void;
};
export function createBouncyTooltipStore(
  initialPosition: BouncyTooltipPosition = { x: 0, y: 0 },
) {
  const seed = { ...initialPosition };
  return createStore<BouncyTooltipState>((set) => ({
    pos: { ...seed },
    isHovering: false,
    updatePos: (x, y) => set({ pos: { x, y } }),
    setIsHovering: (isHovering) => set({ isHovering }),
    reset: () => set({ pos: { ...seed }, isHovering: false }),
  }));
}
export type BouncyTooltipStore = ReturnType<typeof createBouncyTooltipStore>;
