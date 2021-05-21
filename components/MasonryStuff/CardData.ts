export const sizes = [250, 375, 500];
export const colors = ["red", "blue", "yellow"];

export const makeCards = (numberOfCards: number) => {
  const cards = [];
  for (let i = 1; i <= numberOfCards; i++) {
    cards.push({
      height: getRandomFromArray(sizes) as number,
      color: getRandomFromArray(colors) as string,
    });
  }
  return cards;
};

export const removeFromCards = (
  amount: number,
  cards: { height: number; color: string }[]
) => {
  return cards.slice(0, cards.length - amount);
};

import getRandomFromArray from "../../lib/getRandomFromArray";
