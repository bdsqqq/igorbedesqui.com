export default function Custom404() {
  return (
    <>
      <Seo
        title="404 - Page not found"
        description="This page couldn't be found... How did you end up here?"
      />
      <Container backable>
        <HeroBand heroVideo={"/videos/404/zoro-lost"}>
          404
          <br />
          how did you get here...?
          <br />
          this place doesn't exist
        </HeroBand>
      </Container>
    </>
  );
}

import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
import Seo from "@/components/Seo";
