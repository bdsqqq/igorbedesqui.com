import { createFileRoute } from "@tanstack/react-router";
import { PokemonSprite } from "~/routes/play/pokemon/-pokemon";

function PokemonPlayPage() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="grid w-96 grid-cols-3 gap-8">
        <div>
          <PokemonSprite dexNumber={885} scale={3} />
        </div>
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
