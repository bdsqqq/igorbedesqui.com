import { createRef } from "react";
import Band, { BandHeadline } from "../components/Band";
import Container from "../components/Container";
import HeroBand, { HeroBandMedia } from "../components/HeroBand";
import MainNav, { MainNavView } from "../components/MainNav";
import Projects, {
  ProjectLink,
  type Meta,
} from "../components/ProjectStuff/Projects";
import {
  ProjectBand,
  ProjectLayout,
  SidebarContent,
} from "../components/ProjectStuff/ProjectLayout";
import ProjectContainer from "../components/ProjectStuff/ProjectContainer";
import { ContentList } from "../components/ContentList";
import StyledLink from "../components/ui/StyledLink";

const heading = { bold: "01", thin: "Work" };
const project: Meta = {
  shortName: "demo",
  name: "demo",
  description: "",
  roles: [],
  type: "",
  tools: [],
  date: "",
  urlSlug: "demo",
  draft: false,
};
const div = createRef<HTMLDivElement>();
const section = createRef<HTMLElement>();
const anchor = createRef<HTMLAnchorElement>();
const list = createRef<HTMLUListElement>();

export const layoutConsumers = (
  <>
    <Band
      headline={heading}
      id="caller-ID"
      ref={section}
      style={{ maxWidth: 200 }}
      aria-label="work"
      options={{ subGrid: { lg: 8 } }}
    />
    <Band
      headline={heading}
      renderHeadline={(props) => (
        <BandHeadline {...props} className="text-sm" />
      )}
    />
    <Band gridless id="empty">
      {0}
    </Band>
    <Container
      ref={div}
      mainProps={{ ref: section, style: { overflow: "auto" } }}
      footer={null}
      navigation={null}
    />
    <Container backable backAnchor="/work" backMessage="" />
    <HeroBand
      heroImg={{ src: "/demo.png", alt: "" }}
      headingProps={{ className: "text-sm" }}
    >
      demo
    </HeroBand>
    <HeroBand media={false} id="no-media" ref={section}>
      demo
    </HeroBand>
    <HeroBandMedia heroVideo={{ mp4: "/demo.mp4", webm: "/demo.webm" }} />
    <MainNav breadcrumbs={[]} backable backMessage="" />
    <MainNavView
      breadcrumbs={[]}
      backable
      backLinkProps={{
        ref: anchor,
        render: <a />,
        onClick: (event) => event.preventDefault(),
      }}
    />
    <Projects projectsMeta={[]} ref={list} />
    <Projects
      projectsMeta={[project]}
      renderProject={(props) => (
        <ProjectLink {...props} render={<a />} ref={anchor}>
          {props.project.name}
        </ProjectLink>
      )}
    />
    <ProjectLayout projMeta={project} ref={div}>
      <ProjectBand
        headline={heading}
        options={{ padding: "default", subGrid: { lg: 8 } }}
      />
    </ProjectLayout>
    <SidebarContent projMeta={project} />
    <ProjectContainer ref={div} footer={null} />
    <ContentList ref={list} aria-label="empty list" />
    <StyledLink href="/local" render={<a />} ref={anchor}>
      caller routing
    </StyledLink>
  </>
);

// @ts-expect-error headed and gridless modes are exclusive
<Band gridless id="bad" headline={heading} />;
// @ts-expect-error gridless bands have no headline to replace
<Band gridless id="bad" renderHeadline={() => null} />;
// @ts-expect-error gridless identity is explicit
<Band gridless />;
// @ts-expect-error custom navigation owns the navigation, not backable configuration
<Container navigation={null} backable />;
// @ts-expect-error a back label requires a back link
<MainNav backable={false} backMessage="not rendered" />;
// @ts-expect-error a back label requires a back link in the presentation too
<MainNavView breadcrumbs={[]} backMessage="not rendered" />;
// @ts-expect-error presentation requires explicit history, not an implicit application subscription
<MainNavView />;
// @ts-expect-error data is required, even though [] is a valid list
<Projects />;
// @ts-expect-error projects owns its rows; children are not a second source
<Projects projectsMeta={[]}>
  <li>conflicting rows</li>
</Projects>;
// @ts-expect-error conflicting hero media owners
<HeroBand
  heroImg={{ src: "image", alt: "" }}
  heroVideo={{ mp4: "video", webm: "video" }}
/>;
// @ts-expect-error supplied markup owns the media
<HeroBand media={false} heroImg={{ src: "image", alt: "" }} />;
