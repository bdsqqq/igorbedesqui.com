import { Stage, StagesWrap } from "@/components/Stage";
import { Button } from "@/components/ui/Button";
import {
  CVAWithPerms
} from "@/lib/CVAPermutations";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { variantOutsideCva} from "@/ui/Button"
import { cva } from "class-variance-authority";
//        ^?


const [a, b] = CVAWithPerms("", variantOutsideCva);
//     ^?

const c = cva("", variantOutsideCva);
//    ^?

if(a) {
  a()
}

c({

})

function replaceLeafValuesWithDots(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result[key] = replaceLeafValuesWithDots(obj[key]);
    } else {
      result[key] = "...";
    }
  }

  return result;
}

const variantsPlaceholder = replaceLeafValuesWithDots(variantOutsideCva);


const Page = () => {
  return (
    <div className="grid min-h-screen place-items-center px-6">
      {/* <StagesWrap>
        <Stage title="Hej do">
          <Button>Hej do</Button>
        </Stage>
        <Stage title="Hej do">
          <Button>Hej do</Button>
        </Stage>
        <Stage title="Hej do">
          <Button>Hej do</Button>
        </Stage>
      </StagesWrap> */}
      <div className="flex gap-6 items-center">
        <div className="max-w-sm">
          <pre className="">{JSON.stringify(variantsPlaceholder, null, 2)}</pre>
        </div>
        <div className="w-4 h-4 text-base">
          <ArrowRightIcon />
        </div>
        <div className="">
          <pre>{JSON.stringify(b, null, 2)}</pre>
        </div>
        <div className="w-4 h-4 text-base">
          <ArrowRightIcon />
        </div>
        <StagesWrap>
          {b && b.map((x) => (
          <Stage key={`${Object.values(x).join(" ")}`} className="" title={`${Object.values(x).join(" ")}`}>
            <Button {...x}>Hej do</Button>
          </Stage>
          ))}
        </StagesWrap>
      </div>
    </div>
  );
};
export default Page;
