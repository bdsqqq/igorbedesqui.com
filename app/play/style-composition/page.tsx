import Container from "@/components/Container";
import { Stage, StagesWrap } from "@/components/Stage";
import { Button } from "@/components/ui/Button";
import { CVAWithPerms } from "@/lib/CVAPermutations";
import { ArrowRightIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/styling";
import { Border } from "@/components/ui/Border";
import Image from "next/image";
import Band from "@/components/Band";
import Tooltip from "@/components/ui/Tooltip";

const Page = () => {
  return (
    <Container>
      <div className="flex flex-col gap-16">
        <div className="grid min-h-[80vh] place-items-center">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="rounded bg-gray-1 p-2">
                <pre className="w-28">
                  {`<Box />
<Image />`}
                </pre>
              </div>
              <div className="h-4 w-4 text-base">
                <ArrowRightIcon />
              </div>
              <div className="flex flex-col gap-2 rounded border border-gray-A6 p-4">
                <div className="h-20 w-20 rounded-sm bg-gradient-to-br from-gray-2 to-gray-7" />
                <div className="h-20 w-20 rounded-sm bg-[url(https://images.unsplash.com/photo-1536311312982-31ed42ebc0f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=30)] bg-contain" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded bg-gray-1 p-2">
                <pre className="w-28">
                  {`<Border>
  <Box />
</Border>

<Border>
  <Image />
</Border>
`}
                </pre>
              </div>
              <div className="h-4 w-4 text-base">
                <ArrowRightIcon />
              </div>
              <div className="flex flex-col gap-2 rounded border border-gray-A6 p-4">
                <Border>
                  <div className="h-20 w-20 rounded-sm bg-gradient-to-br from-gray-2 to-gray-7" />
                </Border>
                <Border>
                  <div className="h-20 w-20 rounded-sm bg-[url(https://images.unsplash.com/photo-1536311312982-31ed42ebc0f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=30)] bg-contain" />
                </Border>
              </div>
            </div>
            <p className="text-right">
              <span className="inline-flex items-center gap-1">
                Inspect the boxes <ArrowUpIcon />
              </span>
              <br />
              No weird wrappers or helper divs!
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Page;
