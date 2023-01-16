export default function Minesweeper() {
  return (
    <>
      <Seo
        title="Minesweeper"
        description="A modern implementation of the classic game minesweeper — made by Igor Bedesqui"
        ogText="The classic minesweeper game, made modern."
        url="work/minesweeper"
      />
      <ProjectContainer key="minesweeperProj">
        <HeroBand>
          Minesweeper
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/minesweeper"
              demoUrl="https://minesweeper-iota.vercel.app/"
            />
          </div>
        </HeroBand>
      </ProjectContainer>
    </>
  );
}
import Seo from "@/components/Seo";
import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
