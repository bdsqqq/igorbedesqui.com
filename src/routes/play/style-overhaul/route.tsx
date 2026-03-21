import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/Container";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";

const Content = () => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button activeStyle="none">Hej</Button>
        </PopoverTrigger>
        <PopoverContent
          options={{
            maxW: "full",
          }}
        >
          <div>Hej do</div>
          <Button size="sm">Hej</Button>
        </PopoverContent>
      </Popover>
    </>
  );
};

function StyleOverhaulPlayPage() {
  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center">
        <Content />
      </div>
    </Container>
  );
}

export const Route = createFileRoute("/play/style-overhaul")({
  component: StyleOverhaulPlayPage,
  head: () => ({
    meta: [{ title: "Style overhaul — Play — Igor Bedesqui" }],
  }),
});
