import { createRef } from "react";
import { Button } from "../components/ui/Button";
import { CopyButton } from "../components/ui/CopyButton";
import EmailLink, { EmailPopoverContent } from "../components/ui/EmailLink";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogHeader,
} from "../components/ui/Dialog";
import { Popover, PopoverTrigger } from "../components/ui/Popover";
import Tooltip, {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/Tooltip";
import { Border } from "../components/ui/Border";
import { Lock } from "../components/ui/Lock";
import { LightBox } from "../components/ui/LightboxImage";
import {
  PortalStoreProvider,
  OutPortal,
  createPortalStore,
} from "../components/ui/Portal";
import { copyText } from "../lib/clipboard";

/** Compile-only consumer contracts; the primary's integrated tsc includes this file. */
export function primitiveContracts() {
  const ref = createRef<HTMLButtonElement>();
  const change = (_open: boolean) => {};
  const content = () => "latest state";
  return (
    <>
      <CopyButton
        contentToCopy=""
        ref={ref}
        title="copy"
        onClick={(event) => event.preventDefault()}
      />
      <CopyButton
        contentToCopy={content}
        render={(props) => <button {...props} />}
        onCopyError={(error) => console.error(error)}
        onCopied={(text) => text.toUpperCase()}
      >
        copy
      </CopyButton>
      <CopyButton contentToCopy={content} render={<Button ref={ref} />} />
      <Button icon={0}>{0}</Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={ref}>open</Button>
        </DialogTrigger>
        <DialogClose render={<Button ref={ref} />}>close</DialogClose>
        <DialogHeader ref={createRef<HTMLDivElement>()} />
      </Dialog>
      <Dialog open={false} onOpenChange={change} />
      <Popover defaultOpen={false} onOpenChange={change}>
        <PopoverTrigger render={<Button />} />
      </Popover>
      <Tooltip content={false}>
        <Button>anchor</Button>
      </Tooltip>
      <TooltipRoot open={false} onOpenChange={change}>
        <TooltipTrigger render={<Button />} />
        <TooltipContent arrow={false}>{0}</TooltipContent>
      </TooltipRoot>
      <EmailLink
        email=""
        contentProps={{ ref: createRef<HTMLDivElement>() }}
        triggerProps={{ render: <Button ref={ref} /> }}
      >
        {0}
      </EmailLink>
      <EmailPopoverContent
        email=""
        ref={createRef<HTMLDivElement>()}
        copyButtonProps={{
          onCopied: (text) => text.toUpperCase(),
          render: <Button />,
        }}
        sendLinkProps={{ render: <a />, ref: createRef<HTMLAnchorElement>() }}
      />
      <Border title="border" ref={createRef<HTMLSpanElement>()}>
        <span />
      </Border>
      <Border asWrapper>{false}</Border>
      <Border asWrapper>{0}</Border>
      <Lock
        locked={false}
        lockedFeedback={0}
        ref={ref}
        onClick={(event) => event.preventDefault()}
      >
        <Button />
      </Lock>
      <LightBox
        src="/image.png"
        alt="sample"
        width={10}
        height={10}
        open={false}
        onOpenChange={change}
      />
      <PortalStoreProvider store={createPortalStore()}>
        <OutPortal name="owned" ref={createRef<HTMLDivElement>()} />
      </PortalStoreProvider>
      {/* @ts-expect-error controlled roots require a change callback */}
      <Dialog open={false} />
      {/* @ts-expect-error conflicting state owners */}
      <Dialog open={false} defaultOpen={false} onOpenChange={change} />
      {/* @ts-expect-error conflicting state owners */}
      <Popover open={false} defaultOpen={false} onOpenChange={change} />
      {/* @ts-expect-error conflicting state owners */}
      <TooltipRoot open={false} defaultOpen={false} onOpenChange={change} />
      {/* @ts-expect-error asChild and render cannot both own the endpoint */}
      <DialogTrigger asChild render={<Button />}>
        <Button />
      </DialogTrigger>
      {/* @ts-expect-error asChild and render cannot both own the endpoint */}
      <DialogClose asChild render={<Button />}>
        <Button />
      </DialogClose>
      {/* @ts-expect-error asChild and render cannot both own the endpoint */}
      <PopoverTrigger asChild render={<Button />}>
        <Button />
      </PopoverTrigger>
      {/* @ts-expect-error asChild requires one element */}
      <TooltipTrigger asChild>text</TooltipTrigger>
      {/* @ts-expect-error controlled convenience tooltip requires a change callback */}
      <Tooltip open={false} content="tip">
        <Button />
      </Tooltip>
      {/* @ts-expect-error controlled email requires a change callback */}
      <EmailLink open={false}>email</EmailLink>
      {/* @ts-expect-error conflicting lightbox state owners */}
      <LightBox
        src="/image.png"
        alt="sample"
        width={10}
        height={10}
        open={false}
        defaultOpen={false}
        onOpenChange={change}
      />
      {/* @ts-expect-error copy data must be text or a text getter */}
      <CopyButton contentToCopy={0} />
      {/* @ts-expect-error shell-free border cloning requires an element */}
      <Border>{0}</Border>
    </>
  );
}

void copyText("", {
  writeText: async (text) => {
    text.toUpperCase();
  },
});
