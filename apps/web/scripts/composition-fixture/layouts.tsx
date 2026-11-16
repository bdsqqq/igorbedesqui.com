import React, { useRef, useState } from "react";
import Band, { BandHeadline } from "../../components/Band";
import Container from "../../components/Container";
import HeroBand from "../../components/HeroBand";
import MainNav, { MainNavView } from "../../components/MainNav";
import Projects, {
  ProjectLink,
  type Meta,
} from "../../components/ProjectStuff/Projects";
import { ProjectBand } from "../../components/ProjectStuff/ProjectLayout";
import {
  PortalStoreProvider,
  createPortalStore,
} from "../../components/ui/Portal";
import { useExpose } from "./controller";
const project: Meta = {
  shortName: "supplied",
  name: "caller project",
  description: "caller description",
  roles: [],
  tools: [],
  type: "",
  date: "",
  urlSlug: "caller",
  draft: false,
};
const projects: readonly Meta[] = [project];
export function Layouts() {
  const [populated, setPopulated] = useState(false);
  const [store] = useState(createPortalStore);
  const container = useRef<HTMLDivElement>(null),
    main = useRef<HTMLElement>(null),
    band = useRef<HTMLElement>(null),
    hero = useRef<HTMLElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    list = useRef<HTMLUListElement>(null),
    nav = useRef<HTMLElement>(null),
    anchor = useRef<HTMLAnchorElement>(null);
  const clicks = useRef(0);
  useExpose("layouts", {
    populate: () => setPopulated(true),
    inspect: () => ({
      refs: [
        !!container.current,
        !!main.current,
        !!band.current,
        !!hero.current,
        !!heading.current,
        !!list.current,
        !!nav.current,
        !!anchor.current,
      ],
      clicks: clicks.current,
      portalOuts: store.getState().outPortals.size,
    }),
  });
  return (
    <PortalStoreProvider store={store}>
      <Container
        ref={container}
        data-testid="container"
        style={{ maxWidth: 600 }}
        navigation={
          <MainNav
            breadcrumbs={[]}
            backable
            backMessage=""
            backLinkProps={{
              render: <a />,
              onClick: (event) => event.preventDefault(),
            }}
          />
        }
        footer={null}
        mainProps={{
          ref: main,
          "aria-label": "caller main",
          style: { overflow: "auto" },
        }}
      >
        <MainNavView
          breadcrumbs={[]}
          backable
          backMessage=""
          ref={nav}
          aria-label="caller nav"
          backLinkProps={{
            render: <a data-testid="caller-back" />,
            ref: anchor,
            onClick: (event) => {
              clicks.current++;
              event.preventDefault();
            },
          }}
        />
        <Band
          ref={band}
          id="caller-band"
          aria-label="caller band"
          style={{ maxWidth: 444 }}
          headline={{ bold: "0", thin: "supplied" }}
          renderHeadline={(props) => (
            <BandHeadline
              {...props}
              data-testid="headline-slot"
              style={{ fontSize: 13 }}
            />
          )}
        >
          0
        </Band>
        <HeroBand
          ref={hero}
          id="caller-hero"
          media={false}
          aria-label="caller hero"
          headingProps={{
            ref: heading,
            title: "caller heading",
            style: { fontSize: 22 },
          }}
        >
          caller hero
        </HeroBand>
        <ProjectBand
          id="caller-project-band"
          headline={{ bold: "1", thin: "projects" }}
          options={{ padding: "default", subGrid: { lg: 8 } }}
        >
          caller band body
        </ProjectBand>
        <Projects
          ref={list}
          projectsMeta={populated ? projects : []}
          aria-label="caller projects"
          renderProject={(props) => (
            <ProjectLink {...props} render={<a />} title="caller row">
              {props.project.name}
            </ProjectLink>
          )}
        />
      </Container>
    </PortalStoreProvider>
  );
}
