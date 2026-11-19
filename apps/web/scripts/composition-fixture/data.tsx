import React, { useState } from "react";
import { Button, Combobox, FormInput } from "@ariakit/react";
import {
  AxiomStory,
  AxiomTimeline,
  AxiomCollection,
  useAxiomInteraction,
  type AxiomBeat,
  type AxiomCollectionState,
} from "../../src/routes/work/axiom/-story";
import {
  Scales,
  ScalesInputs,
  ScalesResults,
  useScales,
  initialScalesValues,
  type ScalesValues,
} from "../../src/routes/writing/scales/-scales";
import {
  OgPreview,
  OgImagePreview,
  OgGeneratedUrl,
  useOgPreview,
} from "../../src/routes/play/og-preview/-preview";
import { useExpose } from "./controller";

function CustomRatio() {
  const { comboboxStore } = useScales();
  return (
    <Combobox
      store={comboboxStore}
      aria-label="Ratio"
      data-testid="custom-ratio"
    />
  );
}
function CustomOgEditor() {
  const { form, inputId } = useOgPreview();
  return (
    <>
      <label htmlFor={inputId}>caller editor</label>
      <FormInput
        store={form}
        name="text"
        id={inputId}
        render={<textarea rows={3} />}
        data-testid="custom-editor"
      />
    </>
  );
}
function ClearSelection() {
  const { selectedId, select } = useAxiomInteraction();
  return (
    <Button
      onClick={() => {
        if (selectedId !== null) select(selectedId);
      }}
    >
      clear caller selection
    </Button>
  );
}

const empty = (): AxiomCollectionState => ({
  hoveredId: null,
  previewId: null,
  selectedId: null,
  receiptOrder: [],
});
const beats: readonly AxiomBeat[] = [
  {
    id: "overlapping-beat",
    label: "caller story",
    period: "fixture period",
    receipts: ["one", "two"].map((id) => ({
      id,
      kind: "commit",
      label: `receipt ${id}`,
      detail: `caller detail ${id}`,
      source: "fixture supplied data",
    })),
    story: {
      trigger: "reveal details",
      receiptIds: ["one", "two"],
      content: ["caller reveal content"],
    },
  },
];
export function Axiom() {
  const [present, setBeats] = useState(false);
  const [first, setFirst] = useState(empty);
  const [second, setSecond] = useState(empty);
  useExpose("axiom", { setBeats, setFirst, inspect: () => [first, second] });
  return (
    <>
      <section data-testid="story-a">
        <AxiomStory
          beats={present ? beats : []}
          value={first}
          onValueChange={setFirst}
        >
          {present && <ClearSelection />}
          <AxiomCollection style={{ paddingTop: 64 }} />
          <AxiomTimeline />
        </AxiomStory>
      </section>
      <section data-testid="story-b">
        <AxiomStory
          beats={present ? beats : []}
          defaultValue={empty()}
          onValueChange={setSecond}
        >
          <AxiomTimeline />
          <AxiomCollection style={{ paddingTop: 64 }} />
        </AxiomStory>
      </section>
    </>
  );
}
const blank: ScalesValues = { ratio: "", scaleLength: "", f0: "" };
export function ScaleEditors() {
  const [values, setValues] = useState(blank);
  const [defaults, setDefaults] = useState(false);
  useExpose("scales", {
    defaults: () => setDefaults(true),
    setValues,
    inspect: () => values,
  });
  return (
    <>
      <section data-testid="scales-a">
        <Scales values={values} onValuesChange={setValues} presets={[]}>
          <ScalesResults />
          <ScalesInputs />
        </Scales>
      </section>
      <section data-testid="scales-b">
        <Scales defaultValues={blank} presets={[]}>
          <CustomRatio />
          <ScalesResults />
        </Scales>
      </section>
      {defaults && (
        <section data-testid="scales-default">
          <Scales defaultValues={initialScalesValues} />
        </section>
      )}
    </>
  );
}
export function Og() {
  const [mode, setMode] = useState<"supplied" | "url" | "custom" | "default">(
    "supplied",
  );
  const [url, setUrl] = useState("/fixture-image.svg?source=one");
  const [text, setText] = useState("");
  useExpose("og", {
    mode: setMode,
    url: setUrl,
    text: setText,
    inspect: () => text,
  });
  const source =
    mode === "supplied"
      ? {
          preview: {
            url,
            alt: "caller supplied preview",
            displayUrl: "caller supplied display",
          },
        }
      : mode === "url"
        ? { previewUrl: url }
        : mode === "custom"
          ? {
              generatePreviewUrl: (value: string) =>
                `/custom-image?text=${encodeURIComponent(value)}`,
            }
          : {};
  return (
    <section data-testid="og">
      <OgPreview {...source} text={text} onTextChange={setText}>
        <OgImagePreview />
        <CustomOgEditor />
        <OgGeneratedUrl />
      </OgPreview>
    </section>
  );
}
