"use client";

import { useEffect } from "react";

import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";

export default function Error({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container backable>
      <HeroBand heroVideo={"/videos/404/zoro-lost"}>
        Something went wrong: {error.message}
        <br />
        How did you get here...?
      </HeroBand>
    </Container>
  );
}
