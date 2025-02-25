"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/Button";
import {
  PopoverProvider,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";

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
      <PopoverProvider>
        <PopoverTrigger render={<Button activeStyle="none">Hej</Button>} />
        <PopoverContent
          options={{
            maxW: "full",
          }}
        >
          <div>Hej do</div>
          <Button size="sm">Hej</Button>
        </PopoverContent>
      </PopoverProvider>
    </>
  );
};
