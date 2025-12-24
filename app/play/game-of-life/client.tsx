"use client";
import { Button, ButtonGroup } from "@/components/ui/Button";
import React, { useContext, useEffect } from "react";
import { useStore } from "zustand/react";
import { StoreApi } from "zustand/vanilla";
import { createWithEqualityFn as create } from "zustand/traditional";
import { useShallow } from "zustand/shallow";
import {
  CheckIcon,
  ClipboardCopyIcon,
  DoubleArrowRightIcon,
  ReloadIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import { ToolboxItem } from "@/components/toolbox";
import { Toggle } from "@radix-ui/react-toggle";
import Tooltip from "@/components/ui/Tooltip";

const GameOfLifeStoreContext = React.createContext<StoreApi<GameOfLifeStore>>(
  null!,
);

type GameOfLifeStore = {
  cells: Uint8Array;
  gridSize: number;
  actions: {
    updateCell: (index: number, newValue: number) => void;
    updateCells: (newCells: Uint8Array) => void;
    calculateNextState: () => void;
  };
};

type GameOfLifeStoreProviderProps = {
  children?: React.ReactNode;
  initialCells: Uint8Array;
};

const prettyPrint = (cells: Uint8Array): string => {
  const size = Math.sqrt(cells.length);
  let result = "";
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      result += cells[i * size + j] + " ";
    }
    result += "\n";
  }
  return result;
};

const getNeighbourIndices = (i: number, gridSize: number) => {
  const neighbours: number[] = [];
  const row = Math.floor(i / gridSize);
  const col = i % gridSize;

  const isFirstRow = row === 0;
  const isLastRow = row === gridSize - 1;
  const isFirstCol = col === 0;
  const isLastCol = col === gridSize - 1;

  for (let dx = -1; dx <= 1; dx++) {
    // wanna refactor this to avoid having to allocate an array every time I need to check neighbours
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip the cell itself

      const newRow = row + dx;
      const newCol = col + dy;

      if (isFirstRow && isFirstCol && dx === 1 && dy === 1) continue; // Skip the cell itself
      if (isLastRow && isFirstCol && dx === -1 && dy === 1) continue; // Skip the cell itself
      if (isFirstRow && isLastCol && dx === 1 && dy === -1) continue; // Skip the cell itself
      if (isLastRow && isLastCol && dx === -1 && dy === -1) continue; // Skip the cell itself

      if (
        newRow >= 0 &&
        newRow < gridSize &&
        newCol >= 0 &&
        newCol < gridSize
      ) {
        neighbours.push(newRow * gridSize + newCol);
      }
    }
  }

  return neighbours;
};

function GameOfLiveStoreProvider({
  children,
  initialCells,
}: GameOfLifeStoreProviderProps) {
  const [store] = React.useState(() =>
    create<GameOfLifeStore>((set, get) => ({
      cells: initialCells,
      gridSize: Math.sqrt(initialCells.length),
      actions: {
        updateCell: (i: number, newValue: number) => {
          set((state) => {
            const newCells = new Uint8Array(state.cells.buffer);
            newCells[i] = newValue;
            return { ...get(), cells: newCells };
          }, true);
        },
        updateCells: (newCells: Uint8Array) => {
          set({ ...get(), cells: newCells }, true);
        },
        calculateNextState: () => {
          set((state) => {
            const prevCells = state.cells;

            const newCells = prevCells.map((cell, i) => {
              const neighbourIndices = getNeighbourIndices(
                i,
                state.gridSize,
              ).filter((index) => index >= 0 && index < prevCells.length);
              const neighbours = neighbourIndices.map(
                (index) => prevCells[index],
              );

              const liveNeighbours = neighbours.filter((n) => n === 1).length;

              if (i === 2)
                console.log(neighbourIndices, liveNeighbours, neighbours);

              if (cell === 1) return [2, 3].includes(liveNeighbours) ? 1 : 0;
              if (cell === 0) return liveNeighbours === 3 ? 1 : 0;

              return 0;
            });

            console.log(prettyPrint(prevCells));
            console.log(" ↓");
            console.log(prettyPrint(newCells));

            return { cells: newCells };
          });
        },
      },
    })),
  );

  return (
    <GameOfLifeStoreContext.Provider value={store}>
      {children}
    </GameOfLifeStoreContext.Provider>
  );
};

const useGridSize = () => {
  const store = React.useContext(GameOfLifeStoreContext);
  return useStore(
    store,
    useShallow((state) => state.gridSize),
  );
};

const useActions = () => {
  const store = React.useContext(GameOfLifeStoreContext);
  return useStore(
    store,
    useShallow((state) => state.actions),
  );
};

const useCells = (index?: number) => {
  const store = React.useContext(GameOfLifeStoreContext);

  return useStore(
    store,
    useShallow((state) =>
      index !== undefined ? state.cells[index] : state.cells,
    ),
  );
};

const BOARD_SIZE = 50;

export const Test = () => {
  return (
    <PointerDownStoreProvider>
      <GameOfLiveStoreProvider initialCells={makeBoard(BOARD_SIZE)}>
        <GameOfLifeBoard />
        <ToolboxItem name="game-of-life/calculate-next-state">
          <CalculateNextStateButton />
        </ToolboxItem>

        <ToolboxItem name="game-of-life/play-pause">
          <PlayPauseButton />
        </ToolboxItem>

        <ToolboxItem name="game-of-life/copy-current-state">
          <CopyCurrentStateButton />
        </ToolboxItem>

        <ToolboxItem name="game-of-life/clear-current-state">
          <ClearCurrentStateButton />
        </ToolboxItem>
      </GameOfLiveStoreProvider>
    </PointerDownStoreProvider>
  );
};

const CalculateNextStateButton = () => {
  const calculateNextState = useActions().calculateNextState;

  return (
    <Tooltip content="Calculate Next State">
      <Button
        className="w-fit"
        onClick={calculateNextState}
        icon={<DoubleArrowRightIcon />}
      />
    </Tooltip>
  );
};

const PlayPauseButton = () => {
  const [playing, setPlaying] = React.useState(false);
  const togglePlay = () => setPlaying((prev) => !prev);
  const calculateNextState = useActions().calculateNextState;

  React.useEffect(() => {
    const interval = setInterval(() => {
      playing && calculateNextState();
    }, 100);
    return () => clearInterval(interval);
  }, [calculateNextState, playing]);

  return (
    <Tooltip content={playing ? "Pause" : "Play"}>
      <Button
        className="w-fit"
        toggle
        pressed={playing}
        onClick={togglePlay}
        icon={<TimerIcon />}
      />
    </Tooltip>
  );
};

const CopyCurrentStateButton = () => {
  const gameOfLifeStore = useContext(GameOfLifeStoreContext);
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  return (
    <Tooltip content="Copy current game state">
      <Button
        icon={copied ? <CheckIcon /> : <ClipboardCopyIcon />}
        onClick={() => {
          const cells = gameOfLifeStore.getState().cells;
          const copyPromise = navigator.clipboard
            .writeText(cells.join(""))
            .then(() => {
              setCopied(true);
              timeoutRef.current = setTimeout(() => setCopied(false), 1000);
            });
        }}
      />
    </Tooltip>
  );
};

const ClearCurrentStateButton = () => {
  const actions = useActions();

  return (
    <Tooltip content="Clear current state">
      <Button
        icon={<ReloadIcon />}
        onClick={() => actions.updateCells(makeBoard(BOARD_SIZE))}
      />
    </Tooltip>
  );
};

const GameOfLifeBoard = () => {
  const gridSize = useGridSize();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      }}
      className="w-fit"
    >
      {Array.from({ length: gridSize ** 2 }, () => null).map((_, index) => {
        return <Cell key={`cell-${index}`} index={index} />;
      })}
    </div>
  );
};

type PointerDownStore = {
  pointerDown: boolean;
  actions: {
    setPointerDown: (pointerDown: boolean) => void;
  };
};
const pointerDownStore = create<PointerDownStore>((set) => ({
  pointerDown: false,
  actions: {
    setPointerDown: (pointerDown: boolean) => set({ pointerDown }),
  },
}));

const pointerdownStoreContext = React.createContext<StoreApi<PointerDownStore>>(
  null!,
);

function PointerDownStoreProvider({
  children,
}: React.PropsWithChildren) {
  const [store] = React.useState(() =>
    create<PointerDownStore>((set) => ({
      pointerDown: false,
      actions: {
        setPointerDown: (pointerDown: boolean) => set({ pointerDown }),
      },
    })),
  );

  const setPointerDown = useStore(
    store,
    useShallow((state) => state.actions.setPointerDown),
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onPointerDown = () => {
      timeout = setTimeout(() => {
        setPointerDown(true);
      }, 250);
    };
    const onPointerUp = () => {
      clearTimeout(timeout);
      setPointerDown(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      clearTimeout(timeout);
    };
  }, [setPointerDown]);

  return (
    <pointerdownStoreContext.Provider value={store}>
      {children}
    </pointerdownStoreContext.Provider>
  );
};

const Cell = ({ index }: { index: number }) => {
  // getting the store instead of subscribing to it because I don't
  // want to watch changes and re-render based on them, just need to
  // check a value in a handler.
  const pointerDownStore = useContext(pointerdownStoreContext);

  const actions = useActions();
  const cell = useCells(index);

  return (
    <Toggle
      pressed={cell === 1}
      style={{
        willChange: "background-color",
      }}
      className="aspect-square w-8 rounded aria-pressed:scale-[.4] aria-pressed:animate-fadeBlueOut aria-pressed:bg-gray-04"
      onPointerDown={() => actions.updateCell(index, cell === 1 ? 0 : 1)}
      onMouseEnter={() => {
        if (pointerDownStore && pointerDownStore.getState().pointerDown)
          actions.updateCell(index, 1);
      }}
    />
  );
};

const makeBoard = (size: number) => {
  return new Uint8Array(size ** 2);
};

export default GameOfLifeBoard;
