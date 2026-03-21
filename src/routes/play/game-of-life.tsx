import { createFileRoute } from "@tanstack/react-router";
import GameOfLifePage from "app/play/game-of-life/page";

export const Route = createFileRoute("/play/game-of-life")({
  component: GameOfLifePage,
  head: () => ({
    meta: [{ title: "Game of Life — Play — Igor Bedesqui" }],
  }),
});
