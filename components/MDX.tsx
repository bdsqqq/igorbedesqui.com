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
import { Popover, PopoverContent } from "@/components/ui/Popover";

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

// Helper function to convert markdown to HTML
function markdownToHTML(markdown: string): string {
  // Simple markdown to HTML conversion for common elements
  return (
    markdown
      // Convert links: [text](url) -> <a href="url">text</a>
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="underline underline-offset-2 hover:text-gray-12">$1</a>',
      )
      // Convert bold: **text** -> <strong>text</strong>
      .replace(
        /\*\*([^*]+)\*\*/g,
        '<strong class="font-bold text-gray-12">$1</strong>',
      )
      // Convert italic: *text* -> <em>text</em>
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      // Convert inline code: `text` -> <code>text</code>
      .replace(
        /`([^`]+)`/g,
        '<code class="rounded border-gray-06 bg-gray-02 font-mono px-1 py-0.5">$1</code>',
      )
      // Convert lists: - item -> <ul><li>item</li></ul>
      .replace(/^- (.+)$/gm, "<ul><li>$1</li></ul>")
      // Convert ordered lists: 1. item -> <ol><li>item</li></ol>
      .replace(/^\d+\. (.+)$/gm, "<ol><li>$1</li></ol>")
      // Convert code blocks: ```lang\ncode\n``` -> <pre><code>code</code></pre>
      .replace(
        /```([^`]*?)```/gs,
        '<pre class="rounded-sm bg-gray-02 p-2"><code>$1</code></pre>',
      )
  );
}

// Create a simple MDX wrapper component for footnote content
function FootnoteContent({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none">
      <MDX>{content}</MDX>
    </div>
  );
}

function remarkPopovers() {
  return (tree: any, source: any) => {
    const rawMdString = source.value;
    const footnotes = new Map();

    // First pass: collect all footnote definitions
    visit(tree, "footnoteDefinition", (node) => {
      footnotes.set(node.identifier, node);
    });

    // Helper function to extract markdown content from footnotes
    const extractMarkdownContent = (footnoteNode: any): string => {
      // If the footnote has children, extract their content
      if (footnoteNode.children && footnoteNode.children.length > 0) {
        return footnoteNode.children
          .map((child: any) => {
            if (child.type === "paragraph") {
              return child.children
                .map((c: any) => {
                  // Handle links specially
                  if (c.type === "link") {
                    return `[${c.children.map((linkChild: any) => linkChild.value || "").join("")}](${c.url})`;
                  }
                  // Handle emphasis (italic)
                  else if (c.type === "emphasis") {
                    return `*${c.children.map((emphChild: any) => emphChild.value || "").join("")}*`;
                  }
                  // Handle strong (bold)
                  else if (c.type === "strong") {
                    return `**${c.children.map((strongChild: any) => strongChild.value || "").join("")}**`;
                  }
                  // Handle code
                  else if (c.type === "inlineCode") {
                    return `\`${c.value}\``;
                  }
                  // Default to plain text
                  return c.value || "";
                })
                .join("");
            }
            // Handle lists
            else if (child.type === "list") {
              return child.children
                .map((item: any, i: number) => {
                  const prefix = child.ordered ? `${i + 1}. ` : "- ";
                  return (
                    prefix +
                    item.children
                      .map((itemChild: any) => {
                        if (itemChild.type === "paragraph") {
                          return itemChild.children
                            .map((c: any) => c.value || "")
                            .join("");
                        }
                        return itemChild.value || "";
                      })
                      .join("")
                  );
                })
                .join("\n");
            }
            // Handle code blocks
            else if (child.type === "code") {
              return `\`\`\`${child.lang || ""}\n${child.value}\n\`\`\``;
            }
            return child.value || "";
          })
          .join("\n\n");
      }

      // Fallback to plain text if no children
      return "No content available";
    };

    // Handle standard footnote references
    visit(tree, "footnoteReference", (node, index, parent) => {
      const footnote = footnotes.get(node.identifier);

      if (footnote && index !== undefined) {
        // Extract the footnote content as markdown string
        const markdownContent = extractMarkdownContent(footnote);

        // Find the text node before this footnote reference
        let triggerText = "";
        let textNodeIndex = -1;

        // Look for the nearest text node before this footnote reference
        for (let i = index - 1; i >= 0; i--) {
          if (parent.children[i].type === "text") {
            textNodeIndex = i;
            triggerText = parent.children[i].value;
            break;
          }
        }

        // If we found a text node, use it as the trigger
        if (textNodeIndex >= 0) {
          // Remove the text node as we'll include it in the popover
          parent.children.splice(textNodeIndex, 1);

          // Adjust the index if we removed a node before the current one
          if (textNodeIndex < index) {
            index--;
          }
        } else {
          // If no text node was found, use the footnote identifier as fallback
          triggerText = `[^${node.identifier}]`;
        }

        // Replace the footnote reference with a Popover
        parent.children[index] = {
          type: "element",
          name: "FootnotePopover",
          data: {
            hName: "FootnotePopover",
            hProperties: {
              children: triggerText,
              content: markdownContent,
            },
          },
        };
      }
    });

    // Handle inline footnotes
    visit(tree, "text", (node, index, parent) => {
      if (!node.value || !parent || index === undefined) return;

      // Look for inline footnote pattern: ^[footnote content]
      // This matches Pandoc's exact syntax for better degradation
      const inlineFootnoteRegex = /^(.*?)(\S+)?(\s+)?\^\[(.*?)\](.*)$/s;
      const match = node.value.match(inlineFootnoteRegex);

      if (match) {
        const [_, textBefore, triggerWord, space, footnoteContent, textAfter] =
          match;
        const newNodes = [];

        // Add text before the trigger word if it exists
        if (textBefore) {
          newNodes.push({
            type: "text",
            value: textBefore,
          });
        }

        // Add the trigger word if it exists, otherwise use a default
        if (triggerWord) {
          newNodes.push({
            type: "element",
            name: "FootnotePopover",
            data: {
              hName: "FootnotePopover",
              hProperties: {
                children: triggerWord,
                content: footnoteContent,
              },
            },
          });

          // Add the space after the trigger word if it exists
          if (space) {
            newNodes.push({
              type: "text",
              value: space,
            });
          }
        } else {
          // If no trigger word, use the footnote content as a self-referential popover
          newNodes.push({
            type: "element",
            name: "FootnotePopover",
            data: {
              hName: "FootnotePopover",
              hProperties: {
                children: "Note",
                content: footnoteContent,
              },
            },
          });
        }

        // Add text after the inline footnote if it exists
        if (textAfter) {
          newNodes.push({
            type: "text",
            value: textAfter,
          });
        }

        // Replace the current node with the new nodes
        if (newNodes.length > 0) {
          parent.children.splice(index, 1, ...newNodes);
        }
      }
    });

    // Handle multi-word inline footnotes: [text^][footnote content]
    visit(tree, "text", (node, index, parent) => {
      if (!node.value || !parent || index === undefined) return;

      // Look for multi-word inline footnote patterns:
      // 1. [text^][footnote content] - Custom syntax
      // 2. [text][^id] - More Pandoc-like syntax (will be handled if footnote definitions exist)
      const multiWordInlineFootnoteRegex = /\[(.*?)(?:\^)?\]\[(.*?)\]/g;
      let match;
      let lastIndex = 0;
      const newNodes = [];

      while ((match = multiWordInlineFootnoteRegex.exec(node.value)) !== null) {
        const [fullMatch, triggerText, footnoteContent] = match;
        const textBefore = node.value.substring(lastIndex, match.index);

        // Add text before the match if it exists
        if (textBefore) {
          newNodes.push({
            type: "text",
            value: textBefore,
          });
        }

        // Check if this is a reference to a footnote definition (starts with ^)
        const isFootnoteRef = footnoteContent.startsWith("^");
        let content = footnoteContent;

        // If it's a footnote reference and we have that footnote definition, use its content
        if (isFootnoteRef && footnotes.has(footnoteContent.substring(1))) {
          const footnote = footnotes.get(footnoteContent.substring(1));
          content = extractMarkdownContent(footnote);
        }

        // Add the popover
        newNodes.push({
          type: "element",
          name: "FootnotePopover",
          data: {
            hName: "FootnotePopover",
            hProperties: {
              children: triggerText,
              content: content,
            },
          },
        });

        lastIndex = match.index + fullMatch.length;
      }

      // Add any remaining text after the last match
      if (lastIndex < node.value.length) {
        newNodes.push({
          type: "text",
          value: node.value.substring(lastIndex),
        });
      }

      // Replace the current node with the new nodes if we found any matches
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });

    // Remove footnote definitions since we've already processed them
    visit(tree, "footnoteDefinition", (node, index, parent) => {
      if (index !== undefined && parent) {
        parent.children.splice(index, 1);
      }
    });
  };
}

// Define a type for MDX content
interface MDXContent {
  type: string;
  value: string;
}

// Create a custom Popover wrapper that can handle MDX content
function PopoverWithMDX({
  children,
  content,
}: {
  children: React.ReactNode;
  content: React.ReactNode | MDXContent;
}) {
  // Check if content is an MDX object
  if (
    content &&
    typeof content === "object" &&
    "type" in content &&
    (content as MDXContent).type === "mdx"
  ) {
    // Render MDX content
    const mdxContent = (content as MDXContent).value;
    return (
      <Popover
        content={
          <div className="prose prose-sm max-w-none">
            <MDX>{mdxContent}</MDX>
          </div>
        }
      >
        {children}
      </Popover>
    );
  }

  // Regular content
  return <Popover content={content as React.ReactNode}>{children}</Popover>;
}

// Create a custom Footnote Popover component
function FootnotePopover({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <Popover
      content={
        <div className="prose prose-sm max-w-none">
          <MDX>{content}</MDX>
        </div>
      }
    >
      {children}
    </Popover>
  );
}

export const defaultComponents = {
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
  Popover: PopoverWithMDX,
  FootnotePopover,
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
