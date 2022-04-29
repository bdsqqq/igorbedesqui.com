// This is based in the article by spencer mortensen at https://spencermortensen.com/articles/typographic-scale/

const Scales = () => {
  const [ratio, setRatio] = useState(1.618034);
  const [scaleLength, setScaleLength] = useState(2);
  const [f0, setF0] = useState(1); // f0 == fundamental frequency. Usually this is 12pt(1 pica) for print but using 1(rem) makes sense since it's equivalent to 16px.

  const getFi = (i: number, ratio: number, scaleLength: number, f0: number) => {
    return f0 * Math.pow(ratio, i / scaleLength);
  };

  // I want this page to:
  // - talk a bit about how scales
  // - implement tests for the scale properties
  // - - if f is a size in the scale, then rf must also be a size in the scale, where r is the ratio of the scale.
  // - display the formula for scales with the current values.
  // - display the current values of the scale.
  // - allow the user to change the values.
  // - allow the user to select from pre-defined values.
  // - display the results of the scale and preview them using a letter, see: https://spencermortensen.com/articles/typographic-scale/.

  return (
    <Container>
      <Band headline={{ bold: "01", thin: "Title" }}>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="ratio">
            Ratio:
            <input
              name="ratio"
              type="number"
              value={ratio}
              onChange={(event) => {
                setRatio(parseFloat(event.target.value));
              }}
            />
          </label>

          <label htmlFor="scaleLength">
            Scale Length:
            <input
              name="scaleLength"
              type="number"
              value={scaleLength}
              onChange={(event) => {
                setScaleLength(parseFloat(event.target.value));
              }}
            />
          </label>

          <label htmlFor="fundamentalFrequency">
            Fundamental frequency (f0):
            <input
              name="fundamentalFrequency"
              type="number"
              value={f0}
              onChange={(event) => {
                setF0(parseFloat(event.target.value));
              }}
            />
          </label>
        </form>
        {getFi(-1, ratio, scaleLength, f0)}
      </Band>
    </Container>
  );
};

export default Scales;

import { useState } from "react";
import Band from "@/components/Band";
import Container from "@/components/Container";
