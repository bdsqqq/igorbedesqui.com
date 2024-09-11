"use client";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useStore } from "zustand/react";
import { StoreApi } from "zustand/vanilla";
import { createWithEqualityFn as create } from 'zustand/traditional'

const GameOfLifeStoreContext = React.createContext<
  StoreApi<GameOfLifeStore>
>(null!);
type GameOfLifeStore = {
  cells: Map<number, number>;
  gridSize: number;
  actions: {
    updateCell: (i: number) => void;
    calculateNextState: () => void;
  };
}

type GameOfLifeStoreProviderProps = {
  children?: React.ReactNode;
  initialCells: Map<number, number>;
}
const prettyPrint = (cells: Map<number, number>): string => {
  const size = Math.sqrt(cells.size);
  let result = '';
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      result += (cells.get(index) || 0) + ' ';
    }
    result += '\n';
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

  for (let dx = -1; dx <= 1; dx++) { // wanna refactor this to avoid having to allocate an array every time I need to check neighbours
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue; // Skip the cell itself

      const newRow = row + dx;
      const newCol = col + dy;

      if (isFirstRow && isFirstCol && dx === 1 && dy === 1) continue; // Skip the cell itself
      if (isLastRow && isFirstCol && dx === -1 && dy === 1) continue; // Skip the cell itself
      if (isFirstRow && isLastCol && dx === 1 && dy === -1) continue; // Skip the cell itself
      if (isLastRow && isLastCol && dx === -1 && dy === -1) continue; // Skip the cell itself

      if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        neighbours.push(newRow * gridSize + newCol);
      }
    }
  }

  return neighbours;
};
const GameOfLiveStoreProvider: React.FC<GameOfLifeStoreProviderProps> = ({ children, initialCells }) => {
  const [store] = React.useState(() =>
    create<GameOfLifeStore>((set, get) => ({
      cells: new Map(initialCells.entries()),
      gridSize: Math.sqrt(initialCells.size),
      actions: {
        updateCell: (i: number) => {
            set((state) => {

              return { cells: get().cells.set(i, get().cells.get(i) === 1 ? 0 : 1) };
            });
        },
        calculateNextState: () => {
          set((state) => {
            const prevCells = state.cells;
            const newCells = new Map<number, number>();

            for (let i = 0; i < state.gridSize * state.gridSize; i++) {
              const cell = prevCells.get(i) || 0;
              const neighbourIndices = getNeighbourIndices(i, state.gridSize).filter(index => index >= 0 && index < prevCells.size);
              const neighbours = neighbourIndices.map(index => prevCells.get(index) || 0);

              const liveNeighbours = neighbours.filter(n => n === 1).length;

              if (i === 2) console.log(neighbourIndices, liveNeighbours, neighbours);

              if (cell === 1) {
                newCells.set(i, [2, 3].includes(liveNeighbours) ? 1 : 0);
              } else {
                newCells.set(i, liveNeighbours === 3 ? 1 : 0);
              }
            }

            console.log(prettyPrint(prevCells));
            console.log(" ↓");
            console.log(prettyPrint(newCells));

            return { cells: newCells };
          });
        },
      },
    }))
  );

  return (
    <GameOfLifeStoreContext.Provider value={store}>
      {children}
    </GameOfLifeStoreContext.Provider>
  );
};

const useGameOfLifeStore = () => {
  const store = React.useContext(GameOfLifeStoreContext);
  return useStore(store);
};

export const Test = () => {
  return (
    <GameOfLiveStoreProvider initialCells={makeBoard(10)}>
    <div className="flex gap-4">
      <GameOfLifeBoard />
        <div className="flex flex-col gap-1">
      <CalculateNextState />
          <CopyCurrentState />
        </div>
    </div>
    </GameOfLiveStoreProvider>
  );
};

const CalculateNextState = () => {
  const { actions } = useGameOfLifeStore();
  return (
    <Button className="w-fit" onClick={actions.calculateNextState}>Calculate Next State</Button>
  );
};
const CopyCurrentState = () => {
  const { cells, gridSize } = useGameOfLifeStore();
  const currentState = Array.from({ length: gridSize * gridSize }, (_, index) => cells.get(index) || 0);

  return <Button onClick={() => navigator.clipboard.writeText(currentState.join(' '))}>Copy current state</Button>;
};
const GameOfLifeBoard = () => {
  const {gridSize } = useGameOfLifeStore();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 1fr)` }} className="gap-1 w-fit">
      {Array.from({ length: gridSize * gridSize }, (_, index) => {
        return <Cell key={`cell-${index}`} index={index} />;
      })}
    </div>
  );
};

const Cell = ({ index }: { index: number}) => {
  const { cells, actions } = useGameOfLifeStore();
  const cell = cells.get(index) || 0;
  return (
    <Button
      key={`cell-${index}`}
      toggle
      pressed={cell === 1}
      className="aspect-square"
      onClick={() => actions.updateCell(index)}
    >{ index}</Button>
  );
};

const makeBoard = (size: number) => {
  const board = new Map<number, number>();
  for (let i = 0; i < size * size; i++) {
    board.set(i, 0);
  }
  return board;
};

export default GameOfLifeBoard;
