"use client";
import { Button } from "@/components/ui/Button";
import React from "react";
import { useStore } from "zustand/react";
import { createStore, StoreApi } from "zustand/vanilla";

const GameOfLifeStoreContext = React.createContext<
  StoreApi<GameOfLifeStore>
>(null!);

type GameOfLifeStore = {
  cells: Uint8Array;
  gridSize: number;
  actions: {
    updateCell: (i: number, j: number) => void;
    calculateNextState: () => void;
  };
}

type GameOfLifeStoreProviderProps = {
  children?: React.ReactNode;
  initialCells: Uint8Array;
}

const prettyPrint = (cells: Uint8Array): string => {
  const size = Math.sqrt(cells.length);
  let result = '';
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      result += cells[i * size + j] + ' ';
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

  for (let dx = -1; dx <= 1; dx++) {
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
    createStore<GameOfLifeStore>((set) => ({
      cells:  initialCells,
      gridSize: Math.sqrt(initialCells.length),
      actions: {
        updateCell: (i: number, j: number) => {
          set((state) => {
            const newCells = new Uint8Array(state.cells);
            newCells[i * state.gridSize + j] = newCells[i * state.gridSize + j] === 1 ? 0 : 1;
            return { cells: newCells };
          });
        },
        calculateNextState: () => {
          set((state) => {
            const prevCells = state.cells;

            const newCells = prevCells.map((cell, i) =>{
              const neighbourIndices = getNeighbourIndices(i, state.gridSize).filter(index => index >= 0 && index < prevCells.length);
              const neighbours = neighbourIndices.map(index => prevCells[index]);


              const liveNeighbours = neighbours.filter(n => n === 1).length

              if(i === 2) console.log(neighbourIndices, liveNeighbours, neighbours)

              if(cell === 1) return [2, 3].includes(liveNeighbours) ? 1 : 0;
              if(cell === 0) return liveNeighbours === 3 ? 1 : 0;

              return 0;
            });


            console.log(prettyPrint(prevCells))
            console.log(" ↓")
            console.log(prettyPrint(newCells))

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
    <GameOfLiveStoreProvider initialCells={makeBoard(3)}>
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
  const currentState = Array.from(cells);

  return <Button onClick={() => navigator.clipboard.writeText(currentState.join(' '))}>Copy current state</Button>;
};

const GameOfLifeBoard = () => {
  const { cells, gridSize, actions } = useGameOfLifeStore();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 1fr)` }} className="gap-1 w-fit">
      {Array.from(cells).map((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        return (
          <Button
            key={`cell-${index}`}
            toggle
            pressed={cell === 1}
            className="aspect-square"
            onClick={() => actions.updateCell(row, col)}
          >{ index}</Button>
        );
      })}
    </div>
  );
};


const makeBoard = (size: number) => {
  return new Uint8Array(size ** 2) ;
};

export default GameOfLifeBoard;
