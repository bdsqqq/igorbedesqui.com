"use client";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useStore } from "zustand/react";
import { createStore, StoreApi } from "zustand/vanilla";

const GameOfLifeStoreContext = React.createContext<
  StoreApi<GameOfLifeStore>
>(null!);

type GameOfLifeStore = {
  cells: number[][];
  actions: {
    updateCell: (i: number, j: number) => void;
    calculateNextState: () => void;
  };
}

type GameOfLifeStoreProviderProps = {
  children?: React.ReactNode;
  initialCells: number[][];
}

const GameOfLiveStoreProvider: React.FC<GameOfLifeStoreProviderProps> = ({ children, initialCells }) => {
  const [store] = React.useState(() =>
    createStore<GameOfLifeStore>((set) => ({
      cells:  initialCells,
      actions: {
        updateCell: (i: number, j: number) => {
          set((state) => {
            const newCells = [...state.cells];
            newCells[i][j] = newCells[i][j] === 1 ? 0 : 1;
            return { cells: newCells };
          });
        },
        calculateNextState: () => {
          set((state) => {
            const prevCells = state.cells;

            const newCells = prevCells.map((row, i) => row.map((cell, j) => {
              const neighbours = [
                (prevCells[i - 1]?.[j - 1] ?? 0),
                (prevCells[i - 1]?.[j] ?? 0),
                (prevCells[i - 1]?.[j + 1] ?? 0),
                (prevCells[i]?.[j - 1] ?? 0),
                (prevCells[i]?.[j + 1] ?? 0),
                (prevCells[i + 1]?.[j - 1] ?? 0),
                (prevCells[i + 1]?.[j] ?? 0),
                (prevCells[i + 1]?.[j + 1] ?? 0),
              ]

              const liveNeighbours = neighbours.filter(n => n === 1).length


              if(cell === 1) return [2, 3].includes(liveNeighbours) ? 1 : 0;
              if(cell === 0) return liveNeighbours === 3 ? 1 : 0;

              return 0;
            }));

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
      <CalculateNextState />
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

const GameOfLifeBoard = () => {
const { cells, actions } = useGameOfLifeStore();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cells[0].length}, 1fr)` }} className="gap-1 w-fit">
      {cells.map((row, i) => (
        row.map((cell, j) => (
            <Button
              key={`cell-${i}-${j}`}
              toggle
              pressed={cell === 1}
              className="aspect-square"
              onClick={() => actions.updateCell(i, j)}
            />
          ))
      ))}
    </div>
  );
};


const makeBoard = (size: number) => {
  const board = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
  return board;
};

export default GameOfLifeBoard;
