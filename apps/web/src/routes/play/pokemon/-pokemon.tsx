import type { ComponentPropsWithRef } from "react";
import pokemonSheet from "./-pokemonicons-sheet.png";
import { pokemonSpriteGeometry } from "./-sprite";
export * from "./-sprite";

export type PokemonSpriteProps = ComponentPropsWithRef<"div"> & {
  dexNumber: number;
  scale?: number;
};

/** Static sprite presentation. Caller owns semantics (e.g. aria-label), layout, and styles. */
export function PokemonSprite({
  dexNumber,
  scale = 3,
  style,
  ...props
}: PokemonSpriteProps) {
  const sprite = pokemonSpriteGeometry(dexNumber, scale);
  return (
    <div
      {...props}
      style={{
        background: `transparent url(${pokemonSheet}) no-repeat scroll -${sprite.left}px -${sprite.top}px / ${sprite.sheetWidth}px ${sprite.sheetHeight}px`,
        width: `${sprite.width}px`,
        height: `${sprite.height}px`,
        imageRendering: "pixelated",
        ...style,
      }}
    />
  );
}
