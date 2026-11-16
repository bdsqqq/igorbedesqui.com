import React from "react";
import { Tab, TabList, TabPanel, TabProvider } from "@ariakit/react";

import { cn } from "@/lib/styling";
import { ButtonGroup, Button } from "@/components/ui/Button";
import { InPortal, OutPortal, useOutPortal } from "@/components/ui/Portal";

const PRETEND_NAVBAR_PORTAL_NAME = "out-nav";
const InPortalPretendNavbar = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <InPortal name={name} outPortalName={PRETEND_NAVBAR_PORTAL_NAME}>
      {children}
    </InPortal>
  );
};

function FarAwaySlots_PretendNavBar() {
  const gap = "gap-4";

  return (
    <nav
      className={cn(
        "ak-layer ak-layer-lighten-6 ak-frame ak-frame-cover ak-frame-start ak-frame-p-2 flex flex-wrap justify-between border-b",
        gap,
      )}
    >
      <div className={cn("flex flex-wrap", gap)}>
        <Button>Datasets</Button>
        <Button>Query</Button>
      </div>
      <div className={cn("flex flex-wrap", gap)}>
        <OutPortal
          className={cn(
            "ak-layer ak-frame ak-frame-field/0 ak-frame-border ak-edge-[#ff9a00] ak-edge-raw min-w-8 border-dashed",
            "flex flex-wrap",
            gap,
          )}
          name={PRETEND_NAVBAR_PORTAL_NAME}
        >
          <Button>action from nav</Button>
        </OutPortal>
      </div>
    </nav>
  );
}

function FarAwaySlots_PretendMain() {
  const tabId = React.useId();

  const tabsAmmount = 3;

  return (
    <>
      <InPortalPretendNavbar name={`action-from-main`}>
        <Button>action from main</Button>
      </InPortalPretendNavbar>
      <TabProvider defaultSelectedId={`${tabId}-0`}>
        <div className="ak-frame ak-frame-cover ak-frame-end ak-frame-p-2 flex min-w-0 flex-col gap-2">
          <TabList
            aria-label="Main tabs"
            render={<ButtonGroup />}
            className="self-start"
          >
            {Array.from({ length: tabsAmmount }).map((_, i) => (
              <Tab
                key={`tab-${i}`}
                id={`${tabId}-${i}`}
                className="aria-selected:ak-state-10"
                render={<Button />}
              >
                Tab {i + 1}
              </Tab>
            ))}
          </TabList>

          {Array.from({ length: tabsAmmount }).map((_, i) => (
            <TabPanel key={i} tabId={`${tabId}-${i}`} unmountOnHide>
              <FarAwaySlots_PretendTab id={String(i + 1)} />
            </TabPanel>
          ))}
        </div>
      </TabProvider>
    </>
  );
}

function FarAwaySlots_PretendTab({ id }: { id: string }) {
  const subTabId = React.useId();

  const subTabsAmmount = 3;

  return (
    <>
      <InPortalPretendNavbar name={`tab-${id}`}>
        <Button>{`action from tab ${id}`}</Button>
      </InPortalPretendNavbar>
      <TabProvider defaultSelectedId={`${subTabId}-0`}>
        <div className="ak-layer ak-layer-darken-3 ak-frame ak-frame-field/2 ak-frame-bordering">
          <TabList
            aria-label={`Subtabs for tab ${id}`}
            render={<ButtonGroup />}
            className="ak-frame ak-frame-cover ak-frame-start"
          >
            {Array.from({ length: subTabsAmmount }).map((_, i) => (
              <Tab
                key={`subtab-${i}`}
                id={`${subTabId}-${i}`}
                className="aria-selected:ak-state-10"
                render={<Button />}
              >
                SubTab {i + 1}
              </Tab>
            ))}
          </TabList>
          <div className="flex flex-col pt-2">
            <span>tab: {id}</span>

            {Array.from({ length: subTabsAmmount }).map((_, i) => (
              <TabPanel key={i} tabId={`${subTabId}-${i}`} unmountOnHide>
                <FarAwaySlots_PretendSubTab id={String(i + 1)} />
              </TabPanel>
            ))}
          </div>
        </div>
      </TabProvider>
    </>
  );
}

function FarAwaySlots_PretendSubTab({ id }: { id: string }) {
  return (
    <>
      <InPortalPretendNavbar name={`subtab-${id}`}>
        <Button>{`action from subtab ${id}`}</Button>
      </InPortalPretendNavbar>

      <div className="">
        <span>subtab: {id}</span>
      </div>
    </>
  );
}

export const PortalShowcase_FarAwaySlots = () => {
  return (
    <div className="ak-layer ak-layer-lighten-3 ak-frame ak-frame-card/2 ak-frame-ring ak-edge-10 flex w-full min-w-0 flex-col gap-2">
      <FarAwaySlots_PretendNavBar />
      <FarAwaySlots_PretendMain />
    </div>
  );
};

function PortalShowcase_Multiplexer_content() {
  const [count, setCount] = React.useState(0);
  const increment = React.useCallback(() => setCount((c) => c + 1), []);

  const [portalDestination, setPortalDestination] =
    React.useState("intentionallyEmpty");

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button onClick={increment}>+1</Button>
        <Button
          aria-pressed={portalDestination === "out-1"}
          onClick={() => setPortalDestination("out-1")}
        >
          Move to #1
        </Button>
        <Button
          aria-pressed={portalDestination === "out-2"}
          onClick={() => setPortalDestination("out-2")}
        >
          Move to #2
        </Button>
        <Button
          aria-pressed={portalDestination === "intentionallyEmpty"}
          onClick={() => setPortalDestination("intentionallyEmpty")}
        >
          Move to nowhere
        </Button>

        <div className="ak-layer ak-frame ak-frame-field/1 ak-frame-border ak-edge-primary ak-edge-raw grid place-items-center border-dashed px-2">
          <span className="leading-none">in-a: {count}</span>
          <InPortal
            name={`multiplexer-content`}
            outPortalName={portalDestination}
          >
            <div>out-a: {count}</div>
          </InPortal>
        </div>
      </div>
    </>
  );
}

function PortalShowcase_MultiPlexer_out() {
  const outputRef = useOutPortal<HTMLFormElement>("out-1");
  return (
    <div className="grid w-full grid-cols-2 gap-2">
      <form
        ref={outputRef}
        className="ak-layer ak-frame ak-frame-card/0 ak-frame-border ak-edge-[#f00] ak-edge-raw grid h-24 place-items-center border-dashed"
      />
      <OutPortal
        name="out-2"
        className="ak-frame ak-frame-card/0 grid h-24 place-items-center"
      />
    </div>
  );
}

export function PortalShowcase_Multiplexer() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <PortalShowcase_Multiplexer_content />
      <PortalShowcase_MultiPlexer_out />
    </div>
  );
}

export function PortalShowcase_dynamicOut() {
  const [showOut, setShowOut] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col gap-2">
        <Button onClick={() => setShowOut(true)}>Show out</Button>
        <Button onClick={() => setShowOut(false)}>Hide out</Button>
      </div>
      {showOut ? <OutPortal name="dynamic-out" /> : null}

      <InPortal name="dynamic-in" outPortalName="dynamic-out">
        <div>Hej do</div>
      </InPortal>
    </div>
  );
}
