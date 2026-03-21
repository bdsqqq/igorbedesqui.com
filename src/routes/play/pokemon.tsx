import { createFileRoute } from "@tanstack/react-router";
import PokemonPage from "app/play/pokemon/page";

export const Route = createFileRoute("/play/pokemon")({
  component: PokemonPage,
  head: () => ({
    meta: [{ title: "Pokemon — Play — Igor Bedesqui" }],
  }),
});
