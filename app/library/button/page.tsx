import Band from "@/components/Band";
import Container from "@/components/Container";
import { MDX } from "@/components/MDX";
import { Stage } from "@/components/Stage";
import {
  buttonPermutations,
  Button,
  LinkButton,
  ButtonGroup,
} from "@/components/ui/Button";
import { grid, subGrid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  FontRomanIcon,
  StrikethroughIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { promises as fs } from "fs";
import { Fragment, isValidElement } from "react";
import jsxToString from "react-element-to-jsx-string";

export default async function Page() {
  const ButtonSource = await fs.readFile(
    process.cwd() + "/components/ui/Button/ClientButton.tsx",
    "utf8",
  );

  return (
    <Container backable backAnchor="library">
      <Band gridless id="">
        <div className={cn(grid(), "gap-y-8")}>
          <div
            className={
              "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-2 lg:col-end-9"
            }
          >
            <section className="prose space-y-4">
              <MDX>
                {`
              # The last Button primitive

              A \`Button\` is usually the first component you'll create, and the one your users will interact with the most. Given it's importance, I find it important to use a primitive with good defaults and a few extra details.
              `}
              </MDX>
            </section>
          </div>

          <section className="col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15">
            <ButtonPermutations />
            <Button
              loading
              icon={{
                left: <ArrowLeftIcon />,
                right: <ArrowRightIcon />,
              }}
            />
            <Button loading icon={<CodeIcon />} />
            <Button
              loading
              icon={{
                left: <ArrowLeftIcon />,
              }}
            />
            <Button
              loading
              icon={{
                right: <ArrowRightIcon />,
              }}
            />
            <Button
              icon={{
                left: <ArrowLeftIcon />,
                right: <ArrowRightIcon />,
              }}
            />
            <Button icon={<CodeIcon />} />
            <Button
              icon={{
                left: <ArrowLeftIcon />,
              }}
            />
            <Button
              icon={{
                right: <ArrowRightIcon />,
              }}
            />

            <Button
              icon={{
                left: <ArrowLeftIcon />,
                right: <ArrowRightIcon />,
              }}
            >
              Hej
            </Button>
            <Button icon={<CodeIcon />}>Hej</Button>
            <Button
              icon={{
                left: <ArrowLeftIcon />,
              }}
            >
              Hej
            </Button>
            <Button
              icon={{
                right: <ArrowRightIcon />,
              }}
            >
              Hej
            </Button>

            <Button
              loading
              icon={{
                left: <ArrowLeftIcon />,
                right: <ArrowRightIcon />,
              }}
            >
              Hej
            </Button>
            <Button loading icon={<CodeIcon />}>
              Hej
            </Button>
            <Button
              loading
              icon={{
                left: <ArrowLeftIcon />,
              }}
            >
              Hej
            </Button>
            <Button
              loading
              icon={{
                right: <ArrowRightIcon />,
              }}
            >
              Hej
            </Button>
          </section>

          <section
            className={
              "prose col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-3 lg:col-end-15"
            }
          >
            <MDX>
              {`
\`\`\`jsx
${ButtonSource}
\`\`\``.trim()}
            </MDX>
          </section>

          <section
            className={cn(
              "prose flex flex-col gap-6",
              "col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-3 lg:col-end-15",
            )}
          >
            {usages.map((usage) => {
              const formattedUsage = jsxToString(usage.code, {
                filterProps: ["data-display-name"],
                displayName(element) {
                  if (!isValidElement(element)) return "";
                  return (element as { props: { 'data-display-name'?: string } })?.props?.['data-display-name'] ?? "";
                },
              }).replace(/ /g, " "); // replace spaces with non-breaking spaces, otherwise they'll be collapsed and indentation will break
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
                    ### ${usage.title}

                    ${usage.description ? usage.description : ""}
                    `}
                  </MDX>
                  <div
                    className={cn(
                      subGrid({
                        lg: 12,
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
                        "col-start-1 col-end-5 md:col-start-5 md:col-end-9 lg:col-start-8 lg:col-end-13",
                        "grid place-items-center",
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

const usages = [
  {
    title: "As a button",
    code: <Button data-display-name="Button">Run</Button>,
  },
  {
    title: "As a link",
    code: (
      <LinkButton data-display-name="LinkButton" href="#as-a-link">
        Navigate
      </LinkButton>
    ),
  },
  {
    title: "As a toggle",
    description: "With the `toggle` prop, a button becomes a two-state toggle.",
    code: (
      <Button
        data-display-name="Button"
        toggle
        icon={<CodeIcon data-display-name="CodeIcon" />}
      />
    ),
  },
  {
    title: "As part of a button group",
    description:
      "Using `ButtonGroup`, borders and border radii of `Button`s are updated, to prevent double borders or rounded corners in the inner buttons.",
    code: (
      <ButtonGroup data-display-name="ButtonGroup" orientation="horizontal">
        <Button
          toggle
          data-display-name="Button"
          icon={<FontItalicIcon data-display-name="FontItalicIcon" />}
        />
        <Button
          toggle
          data-display-name="Button"
          icon={<FontBoldIcon data-display-name="FontBoldIcon" />}
        />
        <Button
          toggle
          data-display-name="Button"
          icon={<StrikethroughIcon data-display-name="StrikethroughIcon" />}
        />
      </ButtonGroup>
    ),
  },
  {
    title: "As part of a toggle group",
    description:
      "By composing primitives, you can extend behaviour. For example, a group of toggle buttons where only one can be active simultaneously.",
    code: (
      <ToggleGroup
        data-display-name="ToggleGroup"
        toggleMultiple={false}
        defaultValue={["left"]}
      >
        <ButtonGroup data-display-name="ButtonGroup" orientation="horizontal">
          <Button
            data-display-name="Button"
            toggle
            icon={<TextAlignLeftIcon data-display-name="TextAlignLeftIcon" />}
          />
          <Button
            data-display-name="Button"
            toggle
            icon={
              <TextAlignCenterIcon data-display-name="TextAlignCenterIcon" />
            }
          />
          <Button
            data-display-name="Button"
            toggle
            icon={
              <TextAlignRightIcon data-display-name="TextAlignRightIcon" />
            }
          />
        </ButtonGroup>
      </ToggleGroup>
    ),
  },
];

const ButtonPermutations = () => {
  return (
    <div className="flex items-center gap-6">
      <div className="max-w-sm">
        <pre className="">{JSON.stringify(buttonPermutations, null, 2)}</pre>
      </div>
      <div className="h-4 w-4 text-base">
        <ArrowRightIcon />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        {buttonPermutations &&
          buttonPermutations.map((permutation) => (
            <Stage
              key={`${Object.values(permutation).join(" ")}`}
              title={`${Object.values(permutation).join(" ")}`}
            >
              <Button {...permutation}>Hej do</Button>
            </Stage>
          ))}
      </div>
    </div>
  );
};
