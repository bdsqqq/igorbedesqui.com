export const POKEMON_SHEET = {
  width: 480,
  height: 3990,
  cellWidth: 40,
  cellHeight: 30,
} as const;

/** A static sheet index, not a fetched resource identifier. Index zero is valid. */
export function pokemonSpriteGeometry(dexNumber: number, scale = 3) {
  const { width, height, cellWidth, cellHeight } = POKEMON_SHEET;
  const columns = width / cellWidth;
  const count = columns * (height / cellHeight);
  if (!Number.isInteger(dexNumber) || dexNumber < 0 || dexNumber >= count) {
    throw new Error(
      `PokemonSprite: dexNumber must be an integer from 0 to ${count - 1}`,
    );
  }
  if (!Number.isFinite(scale) || scale <= 0)
    throw new Error("PokemonSprite: scale must be positive and finite");
  return {
    left: (dexNumber % columns) * cellWidth * scale,
    top: Math.floor(dexNumber / columns) * cellHeight * scale,
    width: cellWidth * scale,
    height: cellHeight * scale,
    sheetWidth: width * scale,
    sheetHeight: height * scale,
  };
}
