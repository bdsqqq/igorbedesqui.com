import StyledLinkWithIcon from "@/components/ui/StyledLink";
import { HTMLProps, createElement } from "react";
import { Border } from "@/components/ui/Border";
import { highlight } from "sugar-high";
import { MDXProvider } from "@mdx-js/react";
import { cn } from "@/lib/styling";
import { CopyButton } from "@/components/ui/CopyButton";
import remarkGfm from "remark-gfm";
import { ScrollBar, ScrollArea } from "@/components/ui/ScrollArea";
import { visit } from "unist-util-visit";

import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { PopoverProvider } from "@/components/ui/Popover";

function Table({
  data,
}: {
  data: {
    headers: string[];
    rows: string[][];
  };
}) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function Code({
  children,
  className,
  ...props
}: Omit<HTMLProps<HTMLElement>, "children"> & {
  children: string;
}) {
  const codeHTML = highlight(children);
  return (
    <>
      <CopyButton
        className="absolute right-0 top-0 [&:not(pre_*)]:hidden"
        contentToCopy={children?.toString() || ""}
      />
      <code
        dangerouslySetInnerHTML={{ __html: codeHTML }}
        className={cn(
          "rounded border-gray-06 bg-gray-02 font-mono [&:not(pre_*)]:border [&:not(pre_*)]:px-1 [&:not(pre_*)]:py-0.5",
          className,
        )}
        {...props}
      />
    </>
  );
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const HeadingComponent = ({ children }: { children: string }) => {
    let slug = slugify(children);
    return createElement(`h${level}`, { id: slug }, [
      createElement(
        "a",
        {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: cn("anchor"),
        },
        children,
      ),
    ]);
  };
  HeadingComponent.displayName = `H${level}`;
  return HeadingComponent;
}

function remarkPopovers() {
  return (tree: any) => {
    const footnotes = new Map();

    // First pass: collect all footnote definitions
    visit(tree, "footnoteDefinition", (node) => {
      footnotes.set(node.identifier, node);
    });

    // Second pass: transform footnote references to popovers
    visit(tree, "footnoteReference", (node, index, parent) => {
      const footnote = footnotes.get(node.identifier);
      if (footnote) {
        parent.children[index] = {
          type: "element",
          name: "Popover",
          data: {
            hName: "Popover",
            hProperties: {
              trigger: node.label,
              content: footnote.children,
            },
          },
        };
      }
    });
  };
}

const defaultComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  strong: (props: HTMLProps<HTMLElement>) => (
    <strong className="font-bold text-gray-12" {...props} />
  ),
  pre: ({ children, ...passthorugh }: HTMLProps<HTMLPreElement>) => (
    <Border>
      <pre
        className="relative -mx-4 my-2 rounded-sm bg-gray-02 text-sm"
        {...passthorugh}
      >
        <ScrollArea className={cn("p-4")}>
          {children}
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </pre>
    </Border>
  ),
  img: (props: HTMLProps<HTMLImageElement>) => (
    <Border className="-mx-4 rounded-sm">
      {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
      <img className="rounded-inherit" {...props} />
    </Border>
  ), // @ts-ignore
  a: (props) => <StyledLinkWithIcon {...props} />,
  code: Code,
  Table,
  Popover: PopoverProvider,
  // LiveCode,
};

export async function MDX({
  children,
  components: propComponents,
  ...passthrough
}: { children: string } & {
  components?: React.ComponentProps<typeof MDXProvider>["components"];
}) {
  const mdxSource = children;

  const code = String(
    await compile(mdxSource, {
      outputFormat: "function-body",
      remarkPlugins: [remarkGfm, remarkPopovers],
    }),
  );

  const { default: MDXContent } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return (
    <MDXContent
      components={{ ...defaultComponents, ...(propComponents || {}) }}
      {...passthrough}
    />
  );
}
