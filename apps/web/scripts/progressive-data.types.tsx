import { Button, Combobox, FormInput } from "@ariakit/react";
import { copyText, type ClipboardWriter } from "../lib/clipboard";
import { createImageLoad } from "../src/routes/play/og-preview/-model";

export async function invokeOperations(
  writer: ClipboardWriter,
  imageFactory: () => HTMLImageElement,
) {
  const copied = await copyText("", writer);
  if (copied.status === "error") copied.reason.toUpperCase();
  else {
    // @ts-expect-error success has no failure reason
    copied.reason;
  }
  const load = createImageLoad("/supplied.png", imageFactory);
  const image = await load.promise;
  if (image.status === "ready") image.src.toUpperCase();
  else image.error.message.toUpperCase();
  load.dispose();
}
import {
  AxiomStory,
  AxiomTimeline,
  AxiomCollection,
  useAxiomInteraction,
  type AxiomCollectionState,
} from "../src/routes/work/axiom/-story";
import {
  Scales,
  ScalesInputs,
  ScalesResults,
  useScales,
  initialScalesValues,
} from "../src/routes/writing/scales/-scales";
import {
  OgPreview,
  OgTextEditor,
  OgImagePreview,
  OgGeneratedUrl,
  useOgPreview,
} from "../src/routes/play/og-preview/-preview";

function CallerRatio() {
  const { comboboxStore } = useScales();
  return <Combobox store={comboboxStore} aria-label="ratio" />;
}
function CallerText() {
  const { form, inputId } = useOgPreview();
  return (
    <FormInput store={form} id={inputId} name="text" render={<textarea />} />
  );
}
function CallerSelection() {
  const { selectedId, select } = useAxiomInteraction();
  return (
    <Button
      onClick={() => {
        if (selectedId !== null) select(selectedId);
      }}
    >
      clear selection
    </Button>
  );
}
export const customParts = (
  <>
    <Scales presets={[]}>
      <CallerRatio />
      <ScalesResults />
    </Scales>
    <OgPreview defaultText="" previewUrl="/supplied.svg">
      <CallerText />
    </OgPreview>
    <AxiomStory beats={[]}>
      <CallerSelection />
    </AxiomStory>
  </>
);

const collection: AxiomCollectionState = {
  hoveredId: null,
  previewId: null,
  selectedId: null,
  receiptOrder: [],
};
<AxiomStory beats={[]} />;
<AxiomStory
  beats={[]}
  value={collection}
  onValueChange={(next) => next.receiptOrder}
/>;
<AxiomStory beats={[]} defaultValue={collection}>
  <AxiomCollection />
  <AxiomTimeline />
</AxiomStory>;
// @ts-expect-error caller must supply the beats, including []
<AxiomStory />;
// @ts-expect-error controlled collection requires a change callback
<AxiomStory beats={[]} value={collection} />;
// @ts-expect-error conflicting collection owners
<AxiomStory
  beats={[]}
  value={collection}
  defaultValue={collection}
  onValueChange={() => {}}
/>;

<Scales />;
<Scales presets={[]} defaultValues={initialScalesValues} />;
<Scales
  values={initialScalesValues}
  onValuesChange={(next) => next.ratio.toUpperCase()}
>
  <ScalesResults />
  <ScalesInputs />
</Scales>;
// @ts-expect-error controlled values require a change callback
<Scales values={initialScalesValues} />;
// @ts-expect-error conflicting form owners
<Scales
  values={initialScalesValues}
  defaultValues={initialScalesValues}
  onValuesChange={() => {}}
/>;
// @ts-expect-error raw text is required so incomplete drafts survive
<Scales defaultValues={{ ratio: 1, scaleLength: "14", f0: "1" }} />;

<OgPreview />;
<OgPreview defaultText="" previewUrl="/fixture.png" />;
<OgPreview
  preview={{
    url: "data:image/png;base64,fixture",
    alt: "fixture",
    displayUrl: "caller preview",
  }}
/>;
<OgPreview
  text="draft"
  onTextChange={(next) => next.toUpperCase()}
  generatePreviewUrl={(text) => `/caller?text=${encodeURIComponent(text)}`}
/>;
<OgPreview>
  <OgImagePreview />
  <OgTextEditor />
  <OgGeneratedUrl />
</OgPreview>;
// @ts-expect-error controlled draft requires a change callback
<OgPreview text="" />;
// @ts-expect-error conflicting draft owners
<OgPreview text="" defaultText="" onTextChange={() => {}} />;
// @ts-expect-error conflicting preview owners
<OgPreview previewUrl="/fixture.png" generatePreviewUrl={() => "/other.png"} />;
// @ts-expect-error conflicting supplied preview forms
<OgPreview preview={{ url: "/one.png" }} previewUrl="/two.png" />;
