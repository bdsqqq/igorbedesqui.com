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
import {
  BUTTON_DISPLAY_NAME,
  BUTTON_GROUP_DISPLAY_NAME,
  LINK_BUTTON_DISPLAY_NAME,
} from "@/components/ui/Button/ClientButton";
import { grid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import { ArrowLeftIcon, ArrowRightIcon, CodeIcon } from "@radix-ui/react-icons";
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
        <div className={cn(grid(), " gap-y-8")}>
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
              "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15"
            }
          >
            <MDX>
              {`
\`\`\`jsx
${ButtonSource}
\`\`\``.trim()}
            </MDX>
          </section>

          <section className="col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15">
            {/* <MDX>
              {`
## Usage

### As a button

\`\`\`jsx
<Button>Hej</Button>
\`\`\`

### As a link

\`\`\`jsx
<LinkButton href="#">Hej</LinkButton>
\`\`\`

### As a toggle

\`\`\`jsx
<ToggleButton>Hej</ToggleButton>
\`\`\`

### As a button group

\`\`\`jsx
<ButtonGroup>
  <Button>Hej</Button>
  <Button>Hej</Button>
</ButtonGroup>
\`\`\`
`}
            </MDX> */}
            {Object.entries(usages).map(([name, usage]) => (
              <Fragment key={`${name}-usage-fragment`}>
                <MDX>
                  {`
                    ### ${name}

                    \`\`\`jsx
${jsxToString(usage, {
  filterProps: ["data-display-name"],
  displayName(element) {
    if (!isValidElement(element)) return "";

    console.log(element);
    return element.props["data-display-name"] ?? "";
  },
})}
                     \`\`\`
                  `}
                </MDX>
                {usage}
              </Fragment>
            ))}
          </section>
        </div>
      </Band>
    </Container>
  );
}

const usages = {
  "As a button": <Button data-display-name={BUTTON_DISPLAY_NAME}>Hej</Button>,
  "As a link": (
    <LinkButton data-display-name={LINK_BUTTON_DISPLAY_NAME} href="#">
      Hej
    </LinkButton>
  ),
  "As a toggle": (
    <Button data-display-name={BUTTON_DISPLAY_NAME} toggle>
      Hej
    </Button>
  ),
  "As part of a button group": (
    <ButtonGroup
      data-display-name={BUTTON_GROUP_DISPLAY_NAME}
      orientation="horizontal"
    >
      <Button data-display-name={BUTTON_DISPLAY_NAME}>Hej</Button>
      <Button data-display-name={BUTTON_DISPLAY_NAME}>Hej</Button>
    </ButtonGroup>
  ),
};

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
