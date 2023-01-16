export default function Think() {
  return (
    <>
      <Seo title="IBM" description="IBM" url="work/ibm" ogText="" />
      {/* TODO: actual title and description */}

      <Container key="bebopProj" backable>
        <HeroBand heroVideo={"/videos/ibm/tapes"}>
          Leading bleeding edge at a massive scale.
        </HeroBand>

        <Band gridless id="01">
          <div className={cx(grid({ mode: "narrow" }), "")}>
            <div>Hej do</div>
          </div>
        </Band>
      </Container>
    </>
  );
}

import Container from "@/components/Container";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import StyledLink from "@/ui/StyledLink";
import { cx } from "class-variance-authority";
import { grid } from "@/components/ui/Grid";
