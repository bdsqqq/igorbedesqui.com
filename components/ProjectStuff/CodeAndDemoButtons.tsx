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
        <LinkButton left={<GitHubLogoIcon />} href={codeUrl}>
          <span>code</span>
          <span className="sr-only">Github</span>
        </LinkButton>
      )}
      {demoUrl && (
        <LinkButton left={<ArrowTopRightIcon />} href={demoUrl}>
          live
        </LinkButton>
      )}
    </div>
  );
};

export default CodeAndDemoButtons;

import { LinkButton } from "@/ui/Button";
import { GitHubLogoIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
