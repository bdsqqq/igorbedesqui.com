import { Stage, StagesWrap } from "@/components/Stage";
import { Button } from "@/components/ui/Button";

const Page = () => {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      <StagesWrap>
        <Stage>
          <Button>Hej do</Button>
        </Stage>
        <Stage>
          <Button>Hej do</Button>
        </Stage>
        <Stage>
          <Button>Hej do</Button>
        </Stage>
      </StagesWrap>
    </div>
  );
};
export default Page;
