import { createFileRoute } from "@tanstack/react-router";
import Band from "@/components/Band";
import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { grid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import { ToolboxItem } from "@/components/toolbox";
import {
  GameOfLifeRoot,
  GameOfLifeBoard,
  CalculateNextStateButton,
  PlayPauseButton,
  CopyCurrentStateButton,
  ClearCurrentStateButton,
} from "~/routes/play/game-of-life/-game";

function GameOfLifePlayPage() {
  return (
    <Container backable backAnchor="library">
      <div className={"absolute inset-0 h-full overflow-clip"}>
        <GameOfLifeRoot>
          <GameOfLifeBoard />
          <ToolboxItem name="game-of-life/calculate-next-state">
            <CalculateNextStateButton />
          </ToolboxItem>
          <ToolboxItem name="game-of-life/play-pause">
            <PlayPauseButton />
          </ToolboxItem>
          <ToolboxItem name="game-of-life/copy-current-state">
            <CopyCurrentStateButton />
          </ToolboxItem>
          <ToolboxItem name="game-of-life/clear-current-state">
            <ClearCurrentStateButton />
          </ToolboxItem>
        </GameOfLifeRoot>
      </div>

      <Band gridless id="">
        <div className={cn(grid(), " gap-y-8")}>
          <div
            className={
              "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-9"
            }
          >
            <section className="prose space-y-4">
              <MDX>
                {`

              `}
              </MDX>
            </section>
          </div>
        </div>
      </Band>
    </Container>
  );
}

export const Route = createFileRoute("/play/game-of-life")({
  component: GameOfLifePlayPage,
  head: () => ({
    meta: [{ title: "Game of Life — Play — Igor Bedesqui" }],
  }),
});
