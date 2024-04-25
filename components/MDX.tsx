import { MDXRemote } from "next-mdx-remote/rsc";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
import { Children, HTMLProps, ReactNode, createElement } from "react";
import { Border } from "@/components/ui/Border";
import { highlight } from "sugar-high";
import { MDXProvider } from "@mdx-js/react";
import { SerializeOptions } from "next-mdx-remote/dist/types";
import { cn } from "@/lib/styling";

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
    <code
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      className={cn(
        "rounded bg-gray-02 font-mono [&:not(pre_*)]:px-1 [&:not(pre_*)]:py-0.5",
        className,
      )}
      {...props}
    />
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
  pre: (props: HTMLProps<HTMLPreElement>) => (
    <pre
      className="-mx-4 my-2 overflow-x-auto rounded bg-gray-02 p-4 text-sm"
      {...props}
    />
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
  // LiveCode,
};

export function MDX({
  children,
  components: propComponents,
  ...passthrough
}: { children: string } & {
  // TODO: allow children OR source
  options?: SerializeOptions | undefined;
  components?: React.ComponentProps<typeof MDXProvider>["components"];
}) {
  return (
    <MDXRemote
      {...passthrough}
      source={children}
      // @ts-ignore I copied from leerob, pretend this doesn't break lmao
      components={{ ...defaultComponents, ...(propComponents || {}) }}
    />
  );
}
