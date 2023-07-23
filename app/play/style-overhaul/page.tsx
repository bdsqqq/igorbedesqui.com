"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/Button";
import { Popover } from "@/components/ui/Popover";

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
        <Popover.Trigger asChild>
          <Button
            variants={{
              activeStyle: "none",
            }}
          >
            Hej
          </Button>
        </Popover.Trigger>
        <Popover.Content
          options={{
            maxW: "full",
          }}
        >
          <div>Hej do</div>
          <Button
            variants={{
              size: "sm",
            }}
          >
            Hej
          </Button>
        </Popover.Content>
      </Popover>
    </>
  );
};
