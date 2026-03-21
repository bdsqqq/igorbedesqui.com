import { createFileRoute } from "@tanstack/react-router";
import * as Ariakit from "@ariakit/react";

function Example() {
  return (
    <Ariakit.MenuProvider>
      <Ariakit.MenuButton className="button">
        Actions
        <Ariakit.MenuButtonArrow />
      </Ariakit.MenuButton>
      <Ariakit.Menu gutter={8} className="menu">
        <Ariakit.MenuItem className="menu-item" onClick={() => alert("Edit")}>
          Edit
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item">Share</Ariakit.MenuItem>
        <Ariakit.MenuItem className="menu-item" disabled>
          Delete
        </Ariakit.MenuItem>
        <Ariakit.MenuSeparator className="separator" />
        <Ariakit.MenuItem className="menu-item">Report</Ariakit.MenuItem>
      </Ariakit.Menu>
    </Ariakit.MenuProvider>
  );
}

function ActionsPlayPage() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <div className="grid w-96 grid-cols-3 gap-8">
        <Example />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/play/actions")({
  component: ActionsPlayPage,
  head: () => ({
    meta: [{ title: "Actions — Play — Igor Bedesqui" }],
  }),
});
