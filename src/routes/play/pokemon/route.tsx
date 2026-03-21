import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import pokemonSheet from "./-pokemonicons-sheet.png";

const PokemonIcon = ({ id, scale = 1 }: { id: string; scale?: number }) => {
  const SPRITESHEET_DIMENSIONS = {
    width: 480,
    height: 3990,
  };

  const num = parseInt(id);
  const top = Math.floor(num / 12) * 30;
  const left = (num % 12) * 40;

  return (
    <div
      style={{
        background: `transparent url(${pokemonSheet}) no-repeat scroll -${left * scale}px -${top * scale}px / ${SPRITESHEET_DIMENSIONS.width * scale}px ${SPRITESHEET_DIMENSIONS.height * scale}px`,
        width: `${40 * scale}px`,
        height: `${30 * scale}px`,
        imageRendering: "pixelated",
      }}
    />
  );
};

function Example() {
  const [id, setId] = useState("885");

  return (
    <div>
      <PokemonIcon id={id} scale={4} />
    </div>
  );
}

function PokemonPlayPage() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="grid w-96 grid-cols-3 gap-8">
        <Example />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/play/pokemon")({
  component: PokemonPlayPage,
  head: () => ({
    meta: [{ title: "Pokemon — Play — Igor Bedesqui" }],
  }),
});
