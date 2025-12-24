"use client";

// TODO: move this to HeroBand, it's the only place that will use it
const CodeAndDemoButtons = ({
  codeUrl,
  demoUrl,
}: {
  codeUrl?: string;
  demoUrl?: string;
}) => {
  return (
    // -ml-2 align text to the grid instead of the button container
    <div className="-ml-2 flex gap-2">
      {codeUrl && (
        <Button
          icon={<GitHubLogoIcon />}
          render={<UnstyledLink href={codeUrl} />}
        >
          <span>code</span>
        </Button>
      )}
      {demoUrl && (
        <Button icon={<ImageIcon />} render={<UnstyledLink href={demoUrl} />}>
          live
        </Button>
      )}
    </div>
  );
};

export default CodeAndDemoButtons;

import { UnstyledLink } from "@/components/ui/primitives";
import { Button } from "@/ui/Button";
import { GitHubLogoIcon, ImageIcon } from "@radix-ui/react-icons";
