import Container from "@/components/Container";
import { Stage, StagesWrap } from "@/components/Stage";
import { Button } from "@/components/ui/Button";
import {
  CVAWithPerms
} from "@/lib/CVAPermutations";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/styling";

function replaceLeafValuesWithDots(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null && Array.isArray(obj[key]) === false) {
      result[key] = replaceLeafValuesWithDots(obj[key]);
    } else {
      result[key] = "...";
    }
  }

  return result;
}

const cvaConfig = {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl",
    },
    intent: {
      primary: [
        "border-gray-A4",
        "shadow-gray-A3",
        "from-gray-A2 to-gray-A4",
        "hover:border-gray-A8",
        "focus-visible:border-gray-A8"
      ]
    },
  },
}

const [variants, permutations] = CVAWithPerms(
  cn(
    "select-none appearance-none",
    "relative rounded-sm px-2 py-1 inline-flex items-center gap-2 align-middle outline-none focus-within:outline-none",
    "motion-safe:duration-fast-01 motion-safe:ease-expressive-standard transition-all",
    "border",
    "shadow-input ",
    "bg-gradient-to-tr",
    "active:scale-95",
    "before:absolute before:inset-0 before:rounded before:shadow-lg before:shadow-gray-0/50 before:transition-all before:motion-safe:duration-fast-02 before:motion-safe:ease-expressive-standard"
  ),
  cvaConfig
);

const variantsPlaceholder = replaceLeafValuesWithDots(cvaConfig);


const Page = () => {
  return (
    <div className="grid min-h-screen place-items-center px-6 md:px-12">
      <div className="flex gap-6 items-center">
        <div className="max-w-sm">
          <pre className="">{JSON.stringify(variantsPlaceholder, null, 2)}</pre>
        </div>
        <div className="w-4 h-4 text-base">
          <ArrowRightIcon />
        </div>
        <div className="">
          <pre>{JSON.stringify(permutations, null, 2)}</pre>
        </div>
        <div className="w-4 h-4 text-base">
          <ArrowRightIcon />
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          {permutations && permutations.map((permutation) => (
            <Stage key={`${Object.values(permutation).join(" ")}`} className="" title={`${Object.values(permutation).join(" ")}`}>
              <Button {...permutation}>Hej do</Button>
            </Stage>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Page;
