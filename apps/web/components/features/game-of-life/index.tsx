"use client";

import React from "react";
import { useStore } from "zustand";
import { Button as AriakitButton } from "@ariakit/react";
import {
  DoubleArrowRightIcon,
  ReloadIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import Tooltip from "@/components/ui/Tooltip";
import { cn } from "@/lib/styling";
import {
  createGameOfLifeStore,
  type GameOfLifeStore,
  type GameOfLifeState,
} from "./store";
export * from "./store";

export type GameOfLifeOwner =
  | { store: GameOfLifeStore; initialCells?: never }
  | { store?: never; initialCells?: Uint8Array };
export type GameOfLifeRootProps = React.PropsWithChildren<GameOfLifeOwner>;
const StoreContext = React.createContext<GameOfLifeStore | null>(null);
const PointerContext = React.createContext<{
  down: React.MutableRefObject<boolean>;
  start: () => void;
} | null>(null);

/** Owner inputs initialize once per root. Remount to replace an owner/seed.
 * Caller stores (and their timers) remain alive when the root unmounts.
 */
export function GameOfLifeRoot({
  children,
  store: suppliedStore,
  initialCells,
}: GameOfLifeRootProps) {
  if (suppliedStore !== undefined && initialCells !== undefined) {
    throw new Error("GameOfLifeRoot: supply store OR initialCells");
  }
  const [owner] = React.useState(() => ({
    store: suppliedStore ?? createGameOfLifeStore(initialCells),
    owned: suppliedStore === undefined,
  }));
  const down = React.useRef(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const stop = React.useCallback(() => {
    clearTimeout(timeout.current);
    down.current = false;
  }, []);
  const start = React.useCallback(() => {
    stop();
    timeout.current = setTimeout(() => {
      down.current = true;
    }, 250);
  }, [stop]);
  React.useEffect(() => {
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    return () => {
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
      stop();
      if (owner.owned) owner.store.dispose();
    };
  }, [owner, stop]);
  return (
    <StoreContext.Provider value={owner.store}>
      <PointerContext.Provider value={{ down, start }}>
        {children}
      </PointerContext.Provider>
    </StoreContext.Provider>
  );
}

export function useGameOfLifeStore() {
  const store = React.useContext(StoreContext);
  if (!store) throw new Error("GameOfLife parts must be inside GameOfLifeRoot");
  return store;
}
export function useGameOfLife<T>(selector: (state: GameOfLifeState) => T) {
  return useStore(useGameOfLifeStore(), selector);
}
export function useGameOfLifeActions() {
  return useGameOfLife((state) => state.actions);
}

export function GameOfLife(props: GameOfLifeRootProps) {
  const { children, ...owner } = props;
  return (
    <GameOfLifeRoot {...owner}>
      {children === undefined ? (
        <>
          <GameOfLifeBoard />
          <GameOfLifeControls />
        </>
      ) : (
        children
      )}
    </GameOfLifeRoot>
  );
}

export function GameOfLifeBoard({
  className,
  style,
  ...props
}: React.ComponentPropsWithRef<"div">) {
  const gridSize = useGameOfLife((state) => state.gridSize);
  return (
    <div
      {...props}
      style={{
        display: "grid",
        gridTemplateColumns: gridSize ? `repeat(${gridSize}, 1fr)` : undefined,
        ...style,
      }}
      className={cn("w-fit", className)}
    >
      {Array.from({ length: gridSize ** 2 }, (_, index) => (
        <GameOfLifeCell key={index} index={index} />
      ))}
    </div>
  );
}

export function GameOfLifeCell({
  index,
  className,
  style,
  onPointerDown,
  onClick,
  onMouseEnter,
  ...props
}: React.ComponentPropsWithRef<typeof AriakitButton> & { index: number }) {
  const pointer = React.useContext(PointerContext);
  const store = useGameOfLifeStore();
  const cell = useGameOfLife((state) => state.cells[index]);
  const toggle = () => {
    const { cells, actions } = store.getState();
    actions.updateCell(index, cells[index] === 1 ? 0 : 1);
  };
  return (
    <AriakitButton
      {...props}
      aria-pressed={cell === 1}
      aria-label={props["aria-label"] ?? `Cell ${index + 1}`}
      style={{ willChange: "background-color", ...style }}
      className={cn(
        "ak-layer ak-layer-transparent ak-frame ak-frame-field/0 aspect-square w-8 aria-pressed:scale-[.4] aria-pressed:animate-fadeBlueOut aria-pressed:ak-state-12 focus-visible:ak-outline focus-visible:outline-2",
        className,
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (!event.defaultPrevented && event.button === 0) {
          pointer?.start();
          toggle();
        }
      }}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && event.detail === 0) toggle();
      }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!event.defaultPrevented && pointer?.down.current)
          store.getState().actions.updateCell(index, 1);
      }}
    />
  );
}

export function CalculateNextStateButton({ onClick, ...props }: ButtonProps) {
  const actions = useGameOfLifeActions();
  return (
    <Tooltip content="Calculate Next State">
      <Button
        aria-label="Calculate next state"
        className="w-fit"
        icon={<DoubleArrowRightIcon />}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) actions.calculateNextState();
        }}
      />
    </Tooltip>
  );
}
export function PlayPauseButton({ onClick, ...props }: ButtonProps) {
  const playing = useGameOfLife((state) => state.playing);
  const actions = useGameOfLifeActions();
  return (
    <Tooltip content={playing ? "Pause" : "Play"}>
      <Button
        aria-label="Run simulation"
        className="w-fit"
        icon={<TimerIcon />}
        {...props}
        aria-pressed={playing}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) actions.togglePlaying();
        }}
      />
    </Tooltip>
  );
}
export function CopyCurrentStateButton(
  props: Omit<React.ComponentPropsWithRef<typeof CopyButton>, "contentToCopy">,
) {
  const store = useGameOfLifeStore();
  return (
    <CopyButton
      size="md"
      aria-label="Copy current game state"
      tooltipContent="Copy current game state"
      {...props}
      contentToCopy={() => store.getState().actions.copyText()}
    />
  );
}
export function ClearCurrentStateButton({ onClick, ...props }: ButtonProps) {
  const actions = useGameOfLifeActions();
  return (
    <Tooltip content="Clear current state">
      <Button
        aria-label="Clear current state"
        icon={<ReloadIcon />}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) actions.clear();
        }}
      />
    </Tooltip>
  );
}
export function GameOfLifeControls(props: React.ComponentPropsWithRef<"div">) {
  return (
    <div {...props}>
      <CalculateNextStateButton />
      <PlayPauseButton />
      <CopyCurrentStateButton />
      <ClearCurrentStateButton />
    </div>
  );
}
