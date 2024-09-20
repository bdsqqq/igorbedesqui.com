"use client";
import { Button, ButtonGroup } from "@/components/ui/Button";
import React, { useEffect } from "react";
import { useStore } from "zustand/react";
import { StoreApi } from "zustand/vanilla";
import { createWithEqualityFn as create } from 'zustand/traditional'
import { useShallow } from 'zustand/shallow'
import { Component1Icon, Component2Icon, PauseIcon, PlayIcon, TimerIcon } from "@radix-ui/react-icons";
import { InPortal } from "@/components/ui/Portal";
import { ToolboxItem } from "@/components/toolbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";

const GameOfLifeStoreContext = React.createContext<
  StoreApi<GameOfLifeStore>
>(null!);

type GameOfLifeStore = {
  cells: Uint8Array;
  gridSize: number;
  actions: {
    updateCell: (index: number, newValue: number) => void;
    updateCells: (newCells: Uint8Array) => void;
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
      cells:  initialCells,
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

const useGridSize = () => {
  const store = React.useContext(GameOfLifeStoreContext);
  return useStore(store, useShallow((state) => state.gridSize));
};

const useActions = () => {
  const store = React.useContext(GameOfLifeStoreContext);
  return useStore(store, useShallow((state) => state.actions));
};

const useCells = (index?: number) => {
  const store = React.useContext(GameOfLifeStoreContext);

  return useStore(store, useShallow((state) =>
    index !== undefined ? state.cells[index] : state.cells
  ));
};

export const Test = () => {
  return (
    <GameOfLiveStoreProvider initialCells={makeBoard(20)}>
      <GameOfLifeBoard />
        <ToolboxItemPopover name="game-of-life-controls" icon={<Component1Icon />}>
          <Controls />
        </ToolboxItemPopover>
      </GameOfLiveStoreProvider>
    );
};

const ToolboxItemPopover = ({ name, icon, children }: { name: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <ToolboxItem name={name}>
    <Popover>
      <PopoverTrigger>
        <Button icon={icon} />
      </PopoverTrigger>
      <PopoverContent align="end">
        {children}
      </PopoverContent>
    </Popover>
  </ToolboxItem>
);

export const Controls = () => {
  return (
    <div className="flex flex-col gap-1">
      <CalculateNextStateButtons />
      <CopyCurrentState />
      <ClearCurrentStateButton />
   </div>
  )
}

const CalculateNextStateButtons = () => {
  const [playing, setPlaying] = React.useState(false);
  const togglePlay = () => setPlaying((prev) => !prev);
  const { actions } = useGameOfLifeStore();

  React.useEffect(() => {
      const interval = setInterval(() => {
        playing && actions.calculateNextState();
      }, 100);
    return () => clearInterval(interval);
  }, [actions, playing]);

  return (
    <ButtonGroup>
      <Button disabled={playing} className="w-fit" onClick={actions.calculateNextState}>Calculate Next State</Button>
      <Button className="w-fit" toggle pressed={playing} onClick={togglePlay} icon={<TimerIcon />} />
    </ButtonGroup>
  );
};

const CopyCurrentState = () => {
 const cells = useCells();

  return <Button onClick={() => navigator.clipboard.writeText(typeof cells === 'number' ? cells.toString() : cells.join(''))}>Copy current state</Button>;
};

const ClearCurrentStateButton = () => {
 const actions = useActions();

  return <Button onClick={() => actions.updateCells(makeBoard(20))}>Clear current state</Button>;
};

const GameOfLifeBoard = () => {
  const gridSize = useGridSize();

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, 1fr)` }} className="gap-1 w-fit">
      {Array.from({ length: gridSize ** 2}, () => null).map((_, index) => {
       return <Cell key={`cell-${index}`} index={index} />
      })}
    </div>
  );
};

const Cell = ({ index }: { index: number }) => {
  const actions = useActions();
  const cell = useCells(index);

  return (
    <Button
      toggle
      pressed={cell === 1}
      className="aspect-square"
      onClick={() => actions.updateCell(index, cell === 1 ? 0 : 1)}
    />
  );
};

const makeBoard = (size: number) => {
  return new Uint8Array(size ** 2) ;
};

export default GameOfLifeBoard;
