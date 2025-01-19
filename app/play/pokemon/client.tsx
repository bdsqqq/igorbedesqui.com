"use client";

import { useState } from "react";

const PokemonIcon = ({ id, scale = 1 }: { id: string; scale?: number }) => {
  const SPRITESHEET_DIMENSIONS = {
    width: 480,
    height: 3990,
  };

  // from smogon https://github.com/smogon/pokemon-showdown-client/blob/ec3e54241c763ddc8b2c7fdf8e749e2230701691/play.pokemonshowdown.com/src/panel-teambuilder-team.tsx#L170
  const num = parseInt(id);
  const top = Math.floor(num / 12) * 30;
  const left = (num % 12) * 40;

  return (
    <div
      style={{
        background: `transparent url(/images/pokemon/pokemonicons-sheet.png) no-repeat scroll -${left * scale}px -${top * scale}px / ${SPRITESHEET_DIMENSIONS.width * scale}px ${SPRITESHEET_DIMENSIONS.height * scale}px`,
        width: `${40 * scale}px`,
        height: `${30 * scale}px`,
        imageRendering: "pixelated",
      }}
    />
  );
};

export const Example = () => {
  const [id, setId] = useState("885");

  return (
    <div>
      <PokemonIcon id={id} scale={4} />
    </div>
  );
};
