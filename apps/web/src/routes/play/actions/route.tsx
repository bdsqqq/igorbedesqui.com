import { createFileRoute } from "@tanstack/react-router";
import * as Ariakit from "@ariakit/react";
import { Button } from "~/routes/library/button/-button";

const menuItemClass =
  "ak-layer ak-layer-transparent ak-frame ak-frame-field/1.5 px-3 hover:ak-state-6 data-active-item:ak-state-6 disabled:ak-ink-0 cursor-default";

function Example() {
  const menu = Ariakit.useMenuStore();
  const placement = Ariakit.useStoreState(menu, "currentPlacement");
  return (
    <Ariakit.MenuProvider store={menu}>
      <Ariakit.MenuButton render={<Button />}>
        Actions
        <Ariakit.MenuButtonArrow />
      </Ariakit.MenuButton>
      <Ariakit.Menu
        data-side={placement.split("-")[0]}
        gutter={8}
        className="surface-popover ak-layer ak-layer-lighten-6 ak-frame ak-frame-card/1 ak-frame-border min-w-40 shadow-lg"
      >
        <Ariakit.MenuItem
          className={menuItemClass}
          onClick={() => alert("Edit")}
        >
          Edit
        </Ariakit.MenuItem>
        <Ariakit.MenuItem className={menuItemClass}>Share</Ariakit.MenuItem>
        <Ariakit.MenuItem className={menuItemClass} disabled>
          Delete
        </Ariakit.MenuItem>
        <Ariakit.MenuSeparator className="my-1 border-t border-(--ak-edge)" />
        <Ariakit.MenuItem className={menuItemClass}>Report</Ariakit.MenuItem>
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
