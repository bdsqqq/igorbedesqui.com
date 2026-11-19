import { createStore, type StoreApi } from "zustand/vanilla";

export const DEFAULT_BOARD_SIZE = 50;

export type PlaybackScheduler = {
  repeat: (tick: () => void, periodMs: number) => () => void;
};
const runtimeScheduler: PlaybackScheduler = {
  repeat(tick, periodMs) {
    const timer = setInterval(tick, periodMs);
    return () => clearInterval(timer);
  },
};

export function makeBoard(size: number) {
  if (!Number.isSafeInteger(size) || size < 0) {
    throw new Error("GameOfLife: board size must be a nonnegative integer");
  }
  return new Uint8Array(size ** 2);
}

export function validateCells(cells: Uint8Array) {
  if (
    !(cells instanceof Uint8Array) ||
    !Number.isInteger(Math.sqrt(cells.length))
  ) {
    throw new Error("GameOfLife: cells must be a square Uint8Array");
  }
  if (cells.some((cell) => cell !== 0 && cell !== 1)) {
    throw new Error("GameOfLife: cells must contain only 0 or 1");
  }
}

export function getNeighbourIndices(i: number, gridSize: number) {
  const neighbours: number[] = [];
  const row = Math.floor(i / gridSize);
  const col = i % gridSize;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      // Preserve the playground's corner exclusions during extraction.
      if (row === 0 && col === 0 && dx === 1 && dy === 1) continue;
      if (row === gridSize - 1 && col === 0 && dx === -1 && dy === 1) continue;
      if (row === 0 && col === gridSize - 1 && dx === 1 && dy === -1) continue;
      if (
        row === gridSize - 1 &&
        col === gridSize - 1 &&
        dx === -1 &&
        dy === -1
      )
        continue;
      const nextRow = row + dx;
      const nextCol = col + dy;
      if (
        nextRow >= 0 &&
        nextRow < gridSize &&
        nextCol >= 0 &&
        nextCol < gridSize
      ) {
        neighbours.push(nextRow * gridSize + nextCol);
      }
    }
  }
  return neighbours;
}

export function nextCells(cells: Uint8Array) {
  validateCells(cells);
  const size = Math.sqrt(cells.length);
  return cells.map((cell, index) => {
    const live = getNeighbourIndices(index, size).filter(
      (i) => cells[i] === 1,
    ).length;
    return cell === 1 ? Number(live === 2 || live === 3) : Number(live === 3);
  });
}

export type GameOfLifeState = {
  cells: Uint8Array;
  gridSize: number;
  playing: boolean;
  actions: {
    updateCell: (index: number, value: number) => void;
    updateCells: (cells: Uint8Array) => void;
    calculateNextState: () => void;
    setPlaying: (playing: boolean) => void;
    togglePlaying: () => void;
    clear: () => void;
    reset: () => void;
    copyText: () => string;
  };
};
export type GameOfLifeStore = StoreApi<GameOfLifeState> & {
  dispose: () => void;
};

/** Inputs are copied. reset restores the seed; clear preserves the current dimensions.
 * The creator owns disposal, including playback started outside React.
 */
export function createGameOfLifeStore(
  initialCells: Uint8Array = makeBoard(DEFAULT_BOARD_SIZE),
  scheduler: PlaybackScheduler = runtimeScheduler,
): GameOfLifeStore {
  validateCells(initialCells);
  const seed = new Uint8Array(initialCells);
  let stopPlayback: (() => void) | undefined;
  const store = createStore<GameOfLifeState>((set, get) => ({
    cells: new Uint8Array(seed),
    gridSize: Math.sqrt(seed.length),
    playing: false,
    actions: {
      updateCell(index, value) {
        if (
          !Number.isInteger(index) ||
          index < 0 ||
          index >= get().cells.length
        ) {
          throw new Error("GameOfLife: cell index is outside the board");
        }
        if (value !== 0 && value !== 1)
          throw new Error("GameOfLife: cell must be 0 or 1");
        const cells = new Uint8Array(get().cells);
        cells[index] = value;
        set({ cells });
      },
      updateCells(cells) {
        validateCells(cells);
        set({
          cells: new Uint8Array(cells),
          gridSize: Math.sqrt(cells.length),
        });
      },
      calculateNextState() {
        set({ cells: nextCells(get().cells) });
      },
      setPlaying(playing) {
        stopPlayback?.();
        stopPlayback = undefined;
        set({ playing });
        if (playing)
          stopPlayback = scheduler.repeat(
            () => get().actions.calculateNextState(),
            100,
          );
      },
      togglePlaying() {
        get().actions.setPlaying(!get().playing);
      },
      clear() {
        get().actions.updateCells(makeBoard(get().gridSize));
      },
      reset() {
        get().actions.updateCells(seed);
      },
      copyText() {
        return get().cells.join("");
      },
    },
  }));
  return Object.assign(store, {
    dispose: () => store.getState().actions.setPlaying(false),
  });
}
