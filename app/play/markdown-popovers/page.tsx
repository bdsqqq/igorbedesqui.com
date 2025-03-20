import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
export const dedent = (strings: TemplateStringsArray, ...values: any[]) => {
  let result = strings.reduce((acc, str, i) => {
    return acc + str + (values[i] || "");
  }, "");

  // Remove leading newline
  result = result.replace(/^\n/, "");

  // Find the smallest indent
  const match = result.match(/^[^\S\n]*(?=\S)/gm);
  const indent = match ? Math.min(...match.map((el) => el.length)) : 0;

  // Remove indentation from all lines
  return result.replace(RegExp(`^[^\\S\\n]{${indent}}`, "gm"), "").trim();
};

export default async function Page() {
  return (
    <Container backable backAnchor="library">
      <div className="grid min-h-dvh max-w-screen-sm place-items-center">
        <div className="flex flex-col gap-4">
          <MDX>
            {dedent`
          I often use popovers to explain things, and it feels super annoying to actually write \`<Popover>\` and \`</Popover>\` everywhere. So now markdown footnotes are automatically transformed into popovers in my MD content.
          
          Profile Menu [^standard]
          [^standard]: This is a standard footnote content.

          Profile Menu^[This is an inline footnote content.]

          `}
          </MDX>
        </div>
      </div>
    </Container>
  );
}
