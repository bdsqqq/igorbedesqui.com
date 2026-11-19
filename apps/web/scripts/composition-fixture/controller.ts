import { useLayoutEffect } from "react";
import type { AxiomCollectionState } from "../../src/routes/work/axiom/-story";
import type { ScalesValues } from "../../src/routes/writing/scales/-scales";
import type { GameOfLifeStore } from "../../src/routes/play/game-of-life/-game";

export interface FixtureController {
  host?: {
    setOpen: (open: boolean) => void;
    inspect: () => { open: boolean; triggerRef: boolean; contentRef: boolean };
  };
  copy?: {
    setText: (text: string) => void;
    cancel: (value: boolean) => void;
    setTip: (value: boolean) => void;
    inspect: () => {
      ref: boolean;
      clicks: number;
      copied: string[];
      errors: number;
      text: string;
    };
  };
  game?: {
    controls: (mode: "default" | "custom" | "none") => void;
    unmount: () => void;
    inspect: () => {
      external: { playing: boolean; ticks: number };
      owned: { playing: boolean; ticks: number };
      boardRef: boolean;
      cellRef: boolean;
    };
  };
  axiom?: {
    setBeats: (present: boolean) => void;
    setFirst: (value: AxiomCollectionState) => void;
    inspect: () => AxiomCollectionState[];
  };
  scales?: {
    defaults: () => void;
    setValues: (values: ScalesValues) => void;
    inspect: () => ScalesValues;
  };
  og?: {
    mode: (value: "supplied" | "url" | "custom" | "default") => void;
    url: (url: string) => void;
    text: (text: string) => void;
    inspect: () => string;
  };
  motion?: {
    unmount: () => void;
    inspect: () => {
      cursor: { x: number; y: number };
      bouncy: { x: number; y: number };
      hovering: boolean;
      refs: boolean[];
    };
  };
  layouts?: {
    populate: () => void;
    inspect: () => { refs: boolean[]; clicks: number; portalOuts: number };
  };
  images?: {
    setOpen: (open: boolean) => void;
    inspect: () => { refs: boolean[]; open: boolean };
  };
}
declare global {
  interface Window {
    composition: FixtureController;
  }
}
window.composition = {};
export function useExpose<K extends keyof FixtureController>(
  key: K,
  api: NonNullable<FixtureController[K]>,
) {
  useLayoutEffect(() => {
    window.composition[key] = api;
    return () => {
      delete window.composition[key];
    };
  }, [key, api]);
}
// Capturing a hook-provided store lets the caller observe owned disposal without patching it.
export type CapturedGame = {
  store?: GameOfLifeStore;
  ticks: number;
  unsubscribe?: () => void;
};
