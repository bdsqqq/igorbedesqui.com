import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
import Container from "@/components/Container";
import { Button } from "~/routes/library/button/-button";
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

const page = {
  name: "Style overhaul",
};

export const Route = createFileRoute("/play/style-overhaul")({
  component: StyleOverhaulPlayPage,
  staticData: { page },
  head: () => pageHead(page, "Play"),
});
