import { createRef } from "react";
import {
  GameOfLife,
  GameOfLifeRoot,
  GameOfLifeBoard,
  PlayPauseButton,
  createGameOfLifeStore,
  useGameOfLifeActions,
} from "../src/routes/play/game-of-life/-game";
import {
  SyncedPositions,
  SyncedPositionsRoot,
  SyncedPositionSurface,
  SyncedPositionCrosshair,
  createCursorPositionStore,
} from "../src/routes/play/synced-positions/-positions";
import {
  BouncyTooltip,
  BouncyTooltipRoot,
  CursorWithAttachedElementTrigger,
  CursorWithAttachedElementContent,
  AnimatedElements,
  createBouncyTooltipStore,
} from "../src/routes/play/bouncy-tooltip/-tooltip";
import { PokemonSprite } from "../src/routes/play/pokemon/-pokemon";

const cells = new Uint8Array(9);
const game = createGameOfLifeStore(cells);
createGameOfLifeStore(cells, {
  repeat: (_tick, periodMs) => {
    periodMs.toFixed();
    return () => {};
  },
});
// @ts-expect-error a scheduler must return its cancellation capability
createGameOfLifeStore(cells, { repeat: () => undefined });
const cursor = createCursorPositionStore();
const tooltip = createBouncyTooltipStore();
const divRef = createRef<HTMLDivElement>();
const buttonRef = createRef<HTMLButtonElement>();
function CustomControls() {
  const actions = useGameOfLifeActions();
  return <button onClick={actions.togglePlaying}>custom playback</button>;
}

export const simulationConsumers = (
  <>
    <GameOfLife />
    <GameOfLife initialCells={new Uint8Array()} />
    <GameOfLife store={game} />
    <GameOfLifeRoot initialCells={cells}>
      <PlayPauseButton ref={buttonRef} className="my-2" />
      <aside>
        <CustomControls />
      </aside>
      <GameOfLifeBoard
        ref={divRef}
        style={{ maxWidth: 300 }}
        aria-label="preview board"
      />
    </GameOfLifeRoot>
    <SyncedPositions store={cursor} className="grid grid-cols-2" ref={divRef} />
    <SyncedPositionsRoot initialPosition={{ x: 0, y: 0 }}>
      <SyncedPositionSurface ref={divRef}>
        <SyncedPositionCrosshair />
      </SyncedPositionSurface>
    </SyncedPositionsRoot>
    <BouncyTooltip label="preview" store={tooltip}>
      <PokemonSprite dexNumber={0} scale={1} />
    </BouncyTooltip>
    <BouncyTooltipRoot initialPosition={{ x: 0, y: 0 }}>
      <CursorWithAttachedElementContent>
        <AnimatedElements animation="bouncy" media={[]} />
      </CursorWithAttachedElementContent>
      <CursorWithAttachedElementTrigger ref={divRef} style={{ padding: 8 }}>
        reordered
      </CursorWithAttachedElementTrigger>
    </BouncyTooltipRoot>
    <PokemonSprite
      dexNumber={885}
      ref={divRef}
      className="shrink-0"
      style={{ opacity: 0.8 }}
      role="img"
      aria-label="dreepy"
    />
  </>
);

// @ts-expect-error store and initial cells are exclusive owners
<GameOfLife store={game} initialCells={cells} />;
// @ts-expect-error root has the same ownership contract
<GameOfLifeRoot store={game} initialCells={cells} />;
// @ts-expect-error cursor owner conflict
<SyncedPositions store={cursor} initialPosition={{ x: 0, y: 0 }} />;
// @ts-expect-error root cursor owner conflict
<SyncedPositionsRoot store={cursor} initialPosition={{ x: 0, y: 0 }} />;
// @ts-expect-error tooltip owner conflict
<BouncyTooltip
  label="conflict"
  store={tooltip}
  initialPosition={{ x: 0, y: 0 }}
/>;
// @ts-expect-error root tooltip owner conflict
<BouncyTooltipRoot store={tooltip} initialPosition={{ x: 0, y: 0 }} />;
// @ts-expect-error sprite data is required
<PokemonSprite />;
// @ts-expect-error no invented fetch mode
<PokemonSprite pokemonId="dreepy" />;
// @ts-expect-error sprite index is numeric static data
<PokemonSprite dexNumber="885" />;
// @ts-expect-error explicit animation media required; no route asset dependency
<AnimatedElements animation="bouncy" />;
