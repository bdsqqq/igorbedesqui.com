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
  const [intervals, setIntervals] = useState(3);

  const getFi = (i: number, ratio: number, scaleLength: number, f0: number) => {
    return f0 * Math.pow(ratio, i / scaleLength);
  };

  const comboboxState = useComboboxState({
    defaultValue: "1", // default value 1 allows the user to see all the others options in the combobox while being a good starting point too
    gutter: 8,
    sameWidth: false,
    animated: true,
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
  // - allow the user to select from pre-defined values.
  // - allow the user to enter a custom value.
  // - fallback to a default value if the user enters an invalid value.
  // - - display a hint if the user enters an invalid value.
  // - display the results of the scale and preview them using a letter, see: https://spencermortensen.com/articles/typographic-scale/.

  return (
    <Container>
      <Band smolPadding headline={{ bold: "01", thin: "Title" }}>
        <form style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="ratio">
            Ratio:
            <StyledComboBox
              autoComplete="list"
              autoSelect
              state={comboboxState}
              placeholder="e.g., Golden ratio"
            />
          </label>
          {filteredPreDefinedScales.length > 0 && (
            <StyledComboboxPopover
              data-placement={comboboxState.currentPlacement}
              state={comboboxState}
            >
              {filteredPreDefinedScales.map((scale) => (
                <StyledComboBoxItem
                  key={`${scale.name}_ComboboxItem`}
                  className="combobox-item"
                  value={scale.value}
                >
                  {scale.name}
                </StyledComboBoxItem>
              ))}
            </StyledComboboxPopover>
          )}

          <label htmlFor="scaleLength">
            Scale Length:
            <StyledInput
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
            <StyledInput
              name="fundamentalFrequency"
              type="number"
              value={f0}
              onChange={(event) => {
                setF0(parseFloat(event.target.value));
              }}
            />
          </label>

          <label htmlFor="intervals">
            Intervals:
            <StyledInput
              name="intervals"
              type="number"
              value={intervals}
              onChange={(event) => {
                setIntervals(parseFloat(event.target.value));
              }}
            />
          </label>
        </form>
      </Band>
      <Band gridless smolPadding id="results">
        <ul>
          {[...Array(scaleLength * intervals)].map((_, i) => {
            let f = getFi(i - scaleLength, ratio, scaleLength, f0);
            return (
              <ol className="hej" key={`${i}_Scale`}>
                <sub>{i - scaleLength + 1}</sub>
                <span
                  style={{
                    fontSize: `${f}rem`,
                  }}
                >
                  a
                </span>
                <sub>{`${f.toFixed(2)}rem`}</sub>
              </ol>
            );
          })}
        </ul>
      </Band>
    </Container>
  );
};

const StyledComboBox = styled(Combobox, {
  padding: "$spacing-02",
  width: "16ch",
  backgroundColor: "transparent",

  border: "none",
  borderRadius: "$sm",
  outlineRing: "",
  outlineColor: "transparent",

  "@motionOk": {
    transitionProperty: "outline-color",
    transitionDuration: "110ms",
    transitionTimingFunction: "cubic-bezier(0, 0, 0.3, 1)",

    "&:focus-visible": {
      transitionTimingFunction: "cubic-bezier(0.4, 0.14, 1, 1)",
    },
  },
});

const StyledComboboxPopover = styled(ComboboxPopover, {
  backgroundColor: "$mauve2",
  width: "max-content",
  padding: "$spacing-02",
  borderRadius: "$sm",

  border: "1px solid $mauve7",

  "@motionOk": {
    "&[data-placement='top-start']": {
      transformOrigin: "bottom",
      animationName: `${scaleIn}, ${slideUp}`,
      animationDuration: "150ms",
      animationTimingFunction: "cubic-bezier(0, 0, 0.3, 1)",

      "&[data-leave]": {
        animationName: `${slideDown}, ${scaleOut}`,
        animationDuration: "150ms",
        animationTimingFunction: "cubic-bezier(0.4, 0.14, 1, 1)",
      },
    },

    "&[data-placement='bottom-start']": {
      transformOrigin: "top",
      animationName: `${scaleIn}, ${slideDown}`,
      animationDuration: "150ms",
      animationTimingFunction: "cubic-bezier(0, 0, 0.3, 1)",

      "&[data-leave]": {
        animationName: `${slideUp}, ${scaleOut}`,
        animationDuration: "150ms",
        animationTimingFunction: "cubic-bezier(0.4, 0.14, 1, 1)",
      },
    },
  },
});

const StyledComboBoxItem = styled(ComboboxItem, {
  padding: "$spacing-02 $spacing-04",

  border: "none",
  borderRadius: "$sm",
  outlineRing: "none",

  "&[aria-selected=true]": {
    backgroundColor: "$mauve8",
  },
});

const StyledInput = styled("input", {
  appearance: "textfield",
  backgroundColor: "transparent",

  padding: "$spacing-02",
  width: "8ch",

  border: "none",
  borderRadius: "$sm",
  outlineRing: "",
  outlineColor: "transparent",

  "@motionOk": {
    transitionProperty: "outline-color",
    transitionDuration: "110ms",
    transitionTimingFunction: "cubic-bezier(0, 0, 0.3, 1)",

    "&:focus-visible": {
      transitionTimingFunction: "cubic-bezier(0.4, 0.14, 1, 1)",
    },
  },
});

export default Scales;

import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from "ariakit/combobox";
import { styled } from "stitches.config";
import { scaleIn, scaleOut, slideDown, slideUp } from "@/animations";

import Band from "@/components/Band";
import Container from "@/components/Container";
