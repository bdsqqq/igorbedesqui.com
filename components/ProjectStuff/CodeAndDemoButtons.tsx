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
        <LinkButton href={codeUrl}>
          <span>code</span>
          <span className="sr-only">Github</span>
          <GitHubLogoIcon height="18" width="18" />
        </LinkButton>
      )}
      {demoUrl && (
        <LinkButton href={demoUrl}>
          <span>live</span>
          <ArrowTopRightIcon height="18" width="18" />
        </LinkButton>
      )}
    </div>
  );
};

export default CodeAndDemoButtons;

import { LinkButton } from "@/ui/Button";
import { GitHubLogoIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
