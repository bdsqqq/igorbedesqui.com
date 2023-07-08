"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/newPopover";

export default function Page() {
  return (
    <Container>
      <div className="flex min-h-screen items-center justify-center">
        <Content />
      </div>
    </Container>
  );
}

const Content = () => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Hej</Button>
        </PopoverTrigger>
        <PopoverContent
          options={{
            maxW: "full",
          }}
        >
          <div>Hej do</div>
        </PopoverContent>
      </Popover>
    </>
  );
};
