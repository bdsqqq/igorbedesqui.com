import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

function Example() {
  const [dex_number, setDexNumber] = useState("885");

  return (
    <div>
      <PokemonSprite dex_number={dex_number} scale={3} />
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

import pokemonSheet from "./-pokemonicons-sheet.png";

const PokemonSprite = ({
  dex_number,
  scale = 3,
}: {
  dex_number: string;
  scale?: number;
}) => {
  const SPRITESHEET_DIMENSIONS = {
    width: 480,
    height: 3990,
  };

  const num = parseInt(dex_number);
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
