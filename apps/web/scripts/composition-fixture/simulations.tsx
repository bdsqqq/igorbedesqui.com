import React, { useEffect, useRef, useState } from "react";
import {
  GameOfLifeRoot,
  GameOfLifeBoard,
  GameOfLifeCell,
  GameOfLifeControls,
  PlayPauseButton,
  createGameOfLifeStore,
  useGameOfLifeStore,
  useGameOfLifeActions,
} from "../../components/features/game-of-life";
import {
  SyncedPositions,
  SyncedPositionsRoot,
  SyncedPositionSurface,
  SyncedPositionCrosshair,
  createCursorPositionStore,
} from "../../components/features/synced-positions";
import {
  BouncyTooltipRoot,
  CursorWithAttachedElementTrigger,
  CursorWithAttachedElementContent,
  AnimatedElements,
  createBouncyTooltipStore,
} from "../../components/features/bouncy-tooltip";
import { PokemonSprite } from "../../components/features/pokemon";
import { useExpose, type CapturedGame } from "./controller";

function Capture({ capture }: { capture: CapturedGame }) {
  const store = useGameOfLifeStore();
  capture.store = store;
  // The observer belongs to the caller and outlives the feature subtree.
  // Unsubscription must not masquerade as successful timer disposal.
  useEffect(() => {
    if (!capture.unsubscribe)
      capture.unsubscribe = store.subscribe((next, previous) => {
        if (next.cells !== previous.cells) capture.ticks++;
      });
  }, [store, capture]);
  return null;
}
function CustomPlayback() {
  const actions = useGameOfLifeActions();
  return <button onClick={actions.togglePlaying}>custom playback</button>;
}
export function Game() {
  const [external] = useState(() => createGameOfLifeStore(new Uint8Array(9)));
  const [owned] = useState<CapturedGame>(() => ({ ticks: 0 }));
  const [externalCapture] = useState<CapturedGame>(() => ({ ticks: 0 }));
  const [mounted, setMounted] = useState(true);
  const [controls, setControls] = useState<"default" | "custom" | "none">(
    "default",
  );
  const board = useRef<HTMLDivElement>(null),
    cell = useRef<HTMLButtonElement>(null);
  useEffect(
    () => () => {
      external.dispose();
      externalCapture.unsubscribe?.();
      owned.unsubscribe?.();
    },
    [external, externalCapture, owned],
  );
  useExpose("game", {
    controls: setControls,
    unmount: () => setMounted(false),
    inspect: () => ({
      external: {
        playing: external.getState().playing,
        ticks: externalCapture.ticks,
      },
      owned: {
        playing: owned.store?.getState().playing ?? false,
        ticks: owned.ticks,
      },
      boardRef: board.current?.dataset.testid === "external-board",
      cellRef: cell.current?.dataset.testid === "custom-cell",
    }),
  });
  return (
    <>
      <div data-testid="empty-game">
        <GameOfLifeRoot initialCells={new Uint8Array()}>
          <GameOfLifeBoard />
        </GameOfLifeRoot>
      </div>
      {mounted && (
        <>
          <section data-testid="external-game">
            <GameOfLifeRoot store={external}>
              <Capture capture={externalCapture} />
              <GameOfLifeBoard
                ref={board}
                aria-label="external board"
                data-testid="external-board"
                style={{ gap: 2 }}
              />
              <GameOfLifeCell
                index={0}
                ref={cell}
                data-testid="custom-cell"
                aria-label="custom cell"
                onClick={(event) => event.preventDefault()}
                onPointerDown={(event) => event.preventDefault()}
              />
              {controls === "default" ? (
                <GameOfLifeControls data-testid="controls" />
              ) : controls === "custom" ? (
                <CustomPlayback />
              ) : null}
            </GameOfLifeRoot>
          </section>
          <section data-testid="owned-game">
            <GameOfLifeRoot initialCells={new Uint8Array(9)}>
              <Capture capture={owned} />
              <PlayPauseButton />
              <GameOfLifeBoard aria-label="owned board" />
            </GameOfLifeRoot>
          </section>
        </>
      )}
    </>
  );
}
export function Motion() {
  const [cursor] = useState(() => createCursorPositionStore({ x: 0, y: 0 }));
  const [bouncy] = useState(() => createBouncyTooltipStore({ x: 0, y: 0 }));
  const [mounted, setMounted] = useState(true);
  const surface = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLDivElement>(null),
    sprite = useRef<HTMLDivElement>(null);
  useExpose("motion", {
    unmount: () => setMounted(false),
    inspect: () => ({
      cursor: cursor.getState().pos,
      bouncy: bouncy.getState().pos,
      hovering: bouncy.getState().isHovering,
      refs: [!!surface.current, !!trigger.current, !!sprite.current],
    }),
  });
  return mounted ? (
    <>
      <SyncedPositions store={cursor} style={{ width: 250 }}>
        <SyncedPositionSurface ref={surface} data-testid="surface-a">
          <span>nested target</span>
          <SyncedPositionCrosshair data-testid="cross-a" />
        </SyncedPositionSurface>
        <SyncedPositionSurface data-testid="surface-b">
          <SyncedPositionCrosshair data-testid="cross-b" />
        </SyncedPositionSurface>
      </SyncedPositions>
      <SyncedPositionsRoot initialPosition={{ x: 0, y: 0 }}>
        <SyncedPositionSurface data-testid="surface-owned">
          <SyncedPositionCrosshair data-testid="cross-owned" />
        </SyncedPositionSurface>
      </SyncedPositionsRoot>
      <BouncyTooltipRoot store={bouncy}>
        <CursorWithAttachedElementContent data-testid="bouncy-a">
          <PokemonSprite
            dexNumber={0}
            scale={1}
            role="img"
            aria-label="zero pokemon"
          />
          <AnimatedElements animation="bouncy" media={[]} />
        </CursorWithAttachedElementContent>
        <CursorWithAttachedElementTrigger
          ref={trigger}
          data-testid="bouncy-trigger-a"
        >
          external tooltip
        </CursorWithAttachedElementTrigger>
      </BouncyTooltipRoot>
      <BouncyTooltipRoot initialPosition={{ x: 0, y: 0 }}>
        <CursorWithAttachedElementTrigger data-testid="bouncy-trigger-b">
          owned tooltip
        </CursorWithAttachedElementTrigger>
        <CursorWithAttachedElementContent data-testid="bouncy-b">
          second root
        </CursorWithAttachedElementContent>
      </BouncyTooltipRoot>
      <PokemonSprite
        ref={sprite}
        dexNumber={0}
        scale={1}
        role="img"
        aria-label="static zero"
        data-testid="pokemon"
        style={{ opacity: 0.8 }}
      />
    </>
  ) : null;
}
