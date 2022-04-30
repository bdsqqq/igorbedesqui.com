// This is based in the article by spencer mortensen at https://spencermortensen.com/articles/typographic-scale/

const preDefinedScales = [
  {
    name: "1.067 – Minor Second",
    value: "1.067",
  },
  {
    name: "1.125 – Major Second",
    value: "1.125",
  },
  {
    name: "1.200 – Minor Third",
    value: "1.200",
  },
  {
    name: "1.250 – Major Third",
    value: "1.250",
  },
  {
    name: "1.333 – Perfect Fourth",
    value: "1.333",
  },
  {
    name: "1.414 – Augmented Fourth",
    value: "1.414",
  },
  {
    name: "1.500 – Perfect Fifth",
    value: "1.500",
  },
  {
    name: "1.618 – Golden Ratio",
    value: "1.618",
  },
];

const Scales = () => {
  const [ratio, setRatio] = useState(parseFloat(preDefinedScales[0].value));
  const [scaleLength, setScaleLength] = useState(2);
  const [f0, setF0] = useState(1); // f0 == fundamental frequency. Usually this is 12pt(1 pica) for print but using 1(rem) makes sense since it's equivalent to 16px.

  const getFi = (i: number, ratio: number, scaleLength: number, f0: number) => {
    return f0 * Math.pow(ratio, i / scaleLength);
  };

  const comboboxState = useComboboxState({
    defaultValue: preDefinedScales[0].value,
    gutter: 8,
    sameWidth: true,
  });

  const [filteredPreDefinedScales, setFilteredPreDefinedScales] =
    useState(preDefinedScales);

  useEffect(() => {
    const valueWithoutComma = comboboxState.value.replace(",", ".");
    if (!isNaN(parseFloat(valueWithoutComma))) {
      setRatio(parseFloat(valueWithoutComma));
    } else {
      setRatio(2);
    }
  }, [comboboxState.value]);

  useEffect(() => {
    setFilteredPreDefinedScales(
      preDefinedScales.filter((scale) => {
        return (
          scale.name
            .toLowerCase()
            .replace(".", "")
            .includes(comboboxState.value.toLowerCase()) ||
          scale.value
            .toLowerCase()
            .replace(".", "")
            .includes(comboboxState.value.toLowerCase().replace(",", "")) ||
          scale.name
            .toLowerCase()
            .includes(comboboxState.value.toLowerCase()) ||
          scale.value.toLowerCase().includes(comboboxState.value.toLowerCase())
        );
      })
    );
  }, [comboboxState.value]);

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
            <Combobox
              autoComplete="list"
              autoSelect
              state={comboboxState}
              placeholder="e.g., Golden ratio"
            />
          </label>
          {filteredPreDefinedScales.length > 0 && (
            <ComboboxPopover state={comboboxState} className="popover">
              {filteredPreDefinedScales.map((scale) => (
                <ComboboxItem
                  key={`${scale.name}_ComboboxItem`}
                  className="combobox-item"
                  value={scale.value}
                >
                  {scale.name}
                </ComboboxItem>
              ))}
            </ComboboxPopover>
          )}

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

import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from "ariakit/combobox";
import { styled } from "stitches.config";

import Band from "@/components/Band";
import Container from "@/components/Container";
