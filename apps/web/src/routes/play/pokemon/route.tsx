import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
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

const page = {
  name: "Pokemon",
};

export const Route = createFileRoute("/play/pokemon")({
  component: PokemonPlayPage,
  staticData: { page },
  head: () => pageHead(page, "Play"),
});
