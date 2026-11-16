import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./fixture.css";
import { Button } from "../../components/ui/Button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "../../components/ui/Dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/Popover";
import { useExpose } from "./controller";
import { Primitives, Images } from "./primitives";
import { Game, Motion } from "./simulations";
import { Axiom, ScaleEditors, Og } from "./data";
import { Layouts } from "./layouts";

const params = new URLSearchParams(location.search);
const cases = {
  primitives: Primitives,
  images: Images,
  game: Game,
  motion: Motion,
  axiom: Axiom,
  scales: ScaleEditors,
  og: Og,
  layouts: Layouts,
};
const name = params.get("case") ?? "primitives";
const Scenario = cases[name as keyof typeof cases];
if (!Scenario) throw new Error(`unknown composition case: ${name}`);
function Host({ children }: React.PropsWithChildren) {
  const host = params.get("host") ?? "page";
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  useExpose("host", {
    setOpen,
    inspect: () => ({
      open,
      triggerRef: !!trigger.current,
      contentRef: !!content.current,
    }),
  });
  const body = (
    <div data-testid="scenario" style={{ minWidth: 0 }}>
      {children}
    </div>
  );
  const bounded = {
    width: "min(560px, calc(100vw - 32px))",
    maxWidth: "calc(100vw - 32px)",
    maxHeight: 340,
    overflow: "auto",
    padding: 16,
  } as const;
  if (host === "page")
    return (
      <section
        ref={content}
        aria-label="page host"
        style={{ maxWidth: 720, padding: 16 }}
      >
        {body}
      </section>
    );
  if (host === "dialog")
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />} ref={trigger}>
          open host
        </DialogTrigger>
        <DialogContent
          ref={content}
          aria-label="composition host"
          style={bounded}
          data-testid="bounded-host"
        >
          <DialogTitle>composition host</DialogTitle>
          <DialogClose render={<Button />}>close host</DialogClose>
          {body}
        </DialogContent>
      </Dialog>
    );
  if (host === "popover")
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button />} ref={trigger}>
          open host
        </PopoverTrigger>
        <PopoverContent
          ref={content}
          aria-label="composition host"
          style={bounded}
          side="bottom"
          data-testid="bounded-host"
        >
          {body}
        </PopoverContent>
      </Popover>
    );
  throw new Error(`unknown composition host: ${host}`);
}
createRoot(document.getElementById("root")!).render(
  <Host>
    <Scenario />
  </Host>,
);
