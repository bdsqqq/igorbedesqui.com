import Band from "@/components/Band";
import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { grid, subGrid } from "@/components/ui/Grid";
import { Tile, TiledLayout } from "@/components/ui/tiledLayout";
import { cn } from "@/lib/styling";
import {
  cloneElement,
  ComponentProps,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  useId,
} from "react";
import jsxToString from "react-element-to-jsx-string";

export default function Page() {
  return (
    <Container backable backAnchor="library">
      <Band gridless id="">
        <div className={cn(grid(), "gap-y-8")}>
          <section
            className={cn(
              "prose flex flex-col gap-6",
              "col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-1 lg:col-end-17",
            )}
          >
            {otherUsages.map((usage) => {
              const formattedUsage = jsxToString(usage.code, {
                filterProps: ["data-display-name"],
                displayName(element) {
                  if (!isValidElement(element)) return "";

                  // console.log(element);
                  return element.props["data-display-name"] ?? "";
                },
              }).replace(/ /g, " "); // replace spaces with non-breaking spaces, otherwise they'll be collapsed and indentation will break
              // to debug the string, use:
              // .replace(/ /g, "·") // Regular space
              // .replace(/\t/g, "→") // Tab
              // .replace(/\n/g, "↵") // Line feed
              // .replace(/\r/g, "←") // Carriage return
              // .replace(/\f/g, "♦") // Form feed
              // .replace(/\v/g, "↕") // Vertical tab
              // .replace(/\u00A0/g, "°"); // Non-breaking space

              return (
                <div key={`${usage.title}-usage-fragment`}>
                  <MDX>{`### ${usage.title}`}</MDX>

                  <div
                    className={cn(
                      subGrid({
                        lg: 16,
                        md: 8,
                        sm: 4,
                      })({ mode: "narrow" }),
                    )}
                  >
                    <div className="col-start-1 col-end-5 md:col-start-1 md:col-end-5 lg:col-start-1 lg:col-end-8">
                      <MDX>{`\`\`\`${usage.ascii}\`\`\``}</MDX>

                      <MDX>
                        {`
                    \`\`\` jsx
                    ${formattedUsage}
                    \`\`\`
                    `}
                      </MDX>
                    </div>
                    <div
                      className={cn(
                        "col-start-1 col-end-5 md:col-start-5 md:col-end-9 lg:col-start-8 lg:col-end-17",
                      )}
                    >
                      {usage.code}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          <section
            className={cn(
              "prose flex flex-col gap-6",
              "col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-1 lg:col-end-17",
            )}
          >
            {usages.map((usage) => {
              const formattedUsage = jsxToString(usage.code, {
                filterProps: ["data-display-name"],
                displayName(element) {
                  if (!isValidElement(element)) return "";

                  // console.log(element);
                  return element.props["data-display-name"] ?? "";
                },
              }).replace(/ /g, " "); // replace spaces with non-breaking spaces, otherwise they'll be collapsed and indentation will break
              // to debug the string, use:
              // .replace(/ /g, "·") // Regular space
              // .replace(/\t/g, "→") // Tab
              // .replace(/\n/g, "↵") // Line feed
              // .replace(/\r/g, "←") // Carriage return
              // .replace(/\f/g, "♦") // Form feed
              // .replace(/\v/g, "↕") // Vertical tab
              // .replace(/\u00A0/g, "°"); // Non-breaking space

              return (
                <div key={`${usage.title}-usage-fragment`}>
                  <MDX>
                    {`
                    ### ${usage.title}                    `}
                  </MDX>
                  <div
                    className={cn(
                      subGrid({
                        lg: 16,
                        md: 8,
                        sm: 4,
                      })({ mode: "narrow" }),
                    )}
                  >
                    <div className="col-start-1 col-end-5 md:col-start-1 md:col-end-5 lg:col-start-1 lg:col-end-8">
                      <MDX>
                        {`
                    \`\`\` jsx
                    ${formattedUsage}
                    \`\`\`
                    `}
                      </MDX>
                    </div>
                    <div
                      className={cn(
                        "col-start-1 col-end-5 md:col-start-5 md:col-end-9 lg:col-start-8 lg:col-end-17",
                      )}
                    >
                      {usage.code}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </Band>
    </Container>
  );
}

// MOCK COMPONENTS
const Box = ({ children, className }: ComponentProps<"div">) => {
  return (
    <div className={cn("border border-gray-A05 bg-gray-A02", className)}>
      {children}
    </div>
  );
};

const MockNav = ({
  variant = "primary",
}: {
  variant?: "primary" | "secondary";
}) => {
  return (
    <Box className="flex w-full items-center justify-between gap-2 p-1">
      {variant === "primary" ? (
        <>
          <div className="flex gap-2">
            <Box className="aspect-square h-6" />
            <Box className="h-6 w-24" />
            <Box className="h-6 w-24" />
            <Box className="h-6 w-24" />
            <Box className="h-6 w-24" />
          </div>

          <div className="flex gap-2">
            <Box className="h-6 w-24" />
            <Box className="aspect-square h-6" />
          </div>
        </>
      ) : null}

      {variant === "secondary" ? (
        <>
          <div className="flex gap-2">
            <Box className="h-6 w-24" />
          </div>

          <div className="flex gap-2">
            <Box className="h-6 w-16" />
            <Box className="h-6 w-16" />
          </div>
        </>
      ) : null}
    </Box>
  );
};

const MockPage = ({
  className,
  ...props
}: ComponentProps<typeof TiledLayout>) => {
  return (
    <TiledLayout className={className} {...props}>
      <Tile data-tile-size="fitContent">
        <MockNav />
      </Tile>
      <Tile data-tile-size="fitContent">
        <MockNav variant="secondary" />
      </Tile>
      <Tile data-tile-size="remainingSpace">
        <MockMainWithSidebar />
      </Tile>
    </TiledLayout>
  );
};

const MockMainWithSidebar = ({
  className,
  ...props
}: Omit<ComponentProps<typeof TiledLayout>, "direction">) => {
  return (
    <TiledLayout
      className={cn("h-96", className)}
      direction="horizontal"
      {...props}
    >
      <Tile data-tile-size="fitContent">
        <Box className="w-40" />
      </Tile>
      <Tile data-tile-size="remainingSpace">
        <MockFlowsContent />
      </Tile>
    </TiledLayout>
  );
};

const MockFlowsContent = ({
  className,
  ...props
}: Omit<ComponentProps<typeof TiledLayout>, "direction">) => {
  return (
    <TiledLayout
      direction="vertical"
      className={cn("h-full", className)}
      {...props}
    >
      <Tile data-tile-size="remainingSpace">
        <Box className="h-full" data-display-name="Nav" />
      </Tile>
      <Tile data-tile-size="fitContent">
        <Box className="h-24" data-display-name="Nav" />
      </Tile>
    </TiledLayout>
  );
};

const usages = [
  {
    title: "flows AKA: main nav, top nav, main with sidebar and content",
    code: (
      <TiledLayout
        className="h-96"
        direction="vertical"
        data-display-name="TiledLayout"
      >
        <MockNav data-display-name="Nav" />
        <MockNav data-display-name="Nav" variant="secondary" />
        <Tile asChild data-display-name="Tile" data-tile-size="remainingSpace">
          <TiledLayout data-display-name="Main" direction="horizontal">
            <Tile asChild data-display-name="Tile" data-tile-size="fitContent">
              <Box data-display-name="sidebar" className="h-full w-40" />
            </Tile>
            <Tile
              asChild
              data-display-name="Tile"
              data-tile-size="remainingSpace"
            >
              <TiledLayout direction="vertical" data-display-name="Main">
                <Tile data-display-name="Tile" data-tile-size="remainingSpace">
                  <Box className="h-full" data-display-name="Box" />
                </Tile>
                <Tile data-display-name="Tile" data-tile-size="fitContent">
                  <Box className="h-24" data-display-name="Box" />
                </Tile>
              </TiledLayout>
            </Tile>
          </TiledLayout>
        </Tile>
      </TiledLayout>
    ),
  },
  {
    title:
      "Usage with ReactNodes that are not ReactElements, AKA: undefined, null, string, number, boolean",
    code: (
      <TiledLayout
        className="h-96"
        direction="vertical"
        data-display-name="TiledLayout"
      >
        <Tile data-display-name="Tile" data-tile-size="fitContent">
          <MockNav data-display-name="Nav" />
        </Tile>
        <Tile data-display-name="Tile" data-tile-size="fitContent">
          <MockNav data-display-name="Nav" variant="secondary" />
        </Tile>
        {undefined}
        {null}
        {"string"}
        {42}
        {true}
        <Tile data-display-name="Tile" asChild data-tile-size="remainingSpace">
          <Box data-display-name="Box" />
        </Tile>
      </TiledLayout>
    ),
  },
];

const otherUsages = [
  {
    title: "Horizontal layout with sidebar and main content",
    ascii: `
┌─────────────────────────────────────────────┐
│                   TopNav                    │
├───────────┬─────────────────────────────────┤
│           │                                 │
│           │                                 │
│  Sidebar  │           Main Content          │
│           │                                 │
│           │                                 │
└───────────┴─────────────────────────────────┘
`,
    code: (
      <TiledLayout
        className="h-96"
        direction="vertical"
        data-display-name="TiledLayout"
      >
        <Tile data-display-name="Tile" data-tile-size="fitContent">
          <MockNav data-display-name="Nav" />
        </Tile>
        <TiledLayout
          className="h-96"
          direction="horizontal"
          data-display-name="TiledLayout"
        >
          <Tile data-display-name="Tile" asChild data-tile-size="fitContent">
            <Box className="w-40" data-display-name="Box" />
          </Tile>
          <Tile
            data-display-name="Tile"
            asChild
            data-tile-size="remainingSpace"
          >
            <Box data-display-name="Box" />
          </Tile>
        </TiledLayout>
      </TiledLayout>
    ),
  },
];
