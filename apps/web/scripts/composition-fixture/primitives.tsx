import React, { useRef, useState } from "react";
import { CopyButton } from "../../components/ui/CopyButton";
import { Button } from "../../src/routes/library/button/-button";
import { EmailPopoverContent } from "../../components/ui/EmailLink";
import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
} from "../../components/ui/Tooltip";
import { Image } from "../../components/ui/Image";
import { LightBox } from "../../components/ui/LightboxImage";
import { useExpose } from "./controller";

// Deliberate consumer failures: the same production CopyButton and verifier exercise these.
function BrokenEndpoint({
  onClick,
  ref,
  ...props
}: React.ComponentPropsWithRef<"button">) {
  const fault = new URLSearchParams(location.search).get("fault");
  return (
    <button
      {...props}
      ref={fault === "ref" ? undefined : ref}
      onClick={fault === "click" ? undefined : onClick}
    />
  );
}
export function Primitives() {
  const [text, setText] = useState("");
  const textRef = useRef(text);
  textRef.current = text;
  const canceled = useRef(false);
  const clicks = useRef(0),
    errors = useRef(0),
    copied = useRef<string[]>([]);
  const ref = useRef<HTMLButtonElement>(null);
  const [tip, setTip] = useState(false);
  useExpose("copy", {
    setText,
    cancel: (value) => {
      canceled.current = value;
    },
    setTip,
    inspect: () => ({
      ref: ref.current?.dataset.testid === "copy-getter",
      clicks: clicks.current,
      copied: [...copied.current],
      errors: errors.current,
      text,
    }),
  });
  const fault = new URLSearchParams(location.search).get("fault");
  return (
    <>
      <CopyButton
        contentToCopy=""
        data-testid="copy-empty"
        icon={0}
        tooltipContent={false}
      >
        0
      </CopyButton>
      <CopyButton
        contentToCopy={() => textRef.current}
        data-testid="copy-getter"
        title="caller title"
        style={{ minWidth: 120 }}
        ref={ref}
        render={fault ? <BrokenEndpoint /> : <button />}
        onClick={(event) => {
          clicks.current++;
          if (canceled.current) event.preventDefault();
        }}
        onCopied={(value) => copied.current.push(value)}
        onCopyError={() => errors.current++}
      >
        copy draft
      </CopyButton>
      <CopyButton contentToCopy="default path" data-testid="copy-default" />
      <div data-testid="email">
        <EmailPopoverContent
          email=""
          aria-label="empty email"
          style={{ maxWidth: 280 }}
        />
      </div>
      <TooltipRoot open={tip} onOpenChange={setTip}>
        <TooltipTrigger render={<Button />} data-testid="tip-trigger">
          tooltip anchor
        </TooltipTrigger>
        <TooltipContent arrow={false} data-testid="tip">
          0
        </TooltipContent>
      </TooltipRoot>
    </>
  );
}
export const imageUrl = "/fixture-image.svg";
export function Images() {
  const [open, setOpen] = useState(false);
  const image = useRef<HTMLImageElement>(null),
    light = useRef<HTMLImageElement>(null);
  useExpose("images", {
    setOpen,
    inspect: () => ({
      open,
      refs: [
        image.current?.tagName === "IMG",
        light.current?.tagName === "IMG",
      ],
    }),
  });
  return (
    <>
      <Image
        ref={image}
        src={imageUrl}
        width={160}
        height={80}
        layout="fixed"
        unstyled
        alt="inline image"
        fallback="vercel"
        background="transparent"
        data-testid="image"
        className="rounded-[3px]"
      />
      <LightBox
        ref={light}
        src={imageUrl}
        width={160}
        height={80}
        alt="lightbox image"
        fallback="vercel"
        background="transparent"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
