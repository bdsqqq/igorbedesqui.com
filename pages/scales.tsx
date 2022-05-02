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

const defaultValues = {
  ratio: preDefinedScales[0].value,
  scaleLength: 2,
  f0: 1, // f0 == fundamental frequency. Usually this is 12pt(1 pica) for print but using 1(rem) makes sense since it's equivalent to 16px.
};

const Scales = () => {
  const [ratio, setRatio] = useState(parseFloat(defaultValues.ratio));
  const [scaleLength, setScaleLength] = useState(defaultValues.scaleLength);
  const [f0, setF0] = useState(defaultValues.f0);
  const [inputsSetAsDefault, setInputsSetAsDefault] = useState<
    { label: string; name: string }[]
  >([]);

  // add name to inputsSetAsDefault if it's not already there
  const addToInputsSetAsDefault = (label: string, name: string) => {
    if (inputsSetAsDefault.findIndex((i) => i.name === name) === -1) {
      setInputsSetAsDefault([...inputsSetAsDefault, { label, name }]);
    }
  };

  // remove name from inputsSetAsDefault if it's there
  const removeFromInputsSetAsDefault = (name: string) => {
    setInputsSetAsDefault(
      inputsSetAsDefault.filter((input) => input.name !== name)
    );
  };

  const getFi = (i: number, ratio: number, scaleLength: number, f0: number) => {
    return f0 * Math.pow(ratio, i / scaleLength);
  };

  const numberInputIsValid = (value: string) => {
    return !isNaN(parseFloat(value));
  };

  // handle input on change, if the input is valid, set the state. if not, set the state to the provided defualt value and add the input name to the error array.
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    defaultValue: number,
    setState: (value: number) => void
  ) => {
    const value = event.target.value;
    if (numberInputIsValid(value)) {
      setState(parseFloat(value));
      removeFromInputsSetAsDefault(event.target.id);
    } else {
      setState(defaultValue);
      addToInputsSetAsDefault(event.target.name, event.target.id);
    }
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
    if (numberInputIsValid(valueWithoutComma)) {
      setRatio(parseFloat(valueWithoutComma));
      removeFromInputsSetAsDefault(Object.keys(defaultValues)[0]);
    } else {
      setRatio(2);
      addToInputsSetAsDefault("Ratio", Object.keys(defaultValues)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <label htmlFor={Object.keys(defaultValues)[0]}>
            Ratio:
            <StyledComboBox
              id={Object.keys(defaultValues)[0]}
              name="Ratio"
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

          <label htmlFor={Object.keys(defaultValues)[1]}>
            Scale Length:
            <StyledInput
              id={Object.keys(defaultValues)[1]}
              name="Scale Length"
              type="number"
              defaultValue={defaultValues.scaleLength}
              onChange={(event) => {
                handleInputChange(
                  event,
                  defaultValues.scaleLength,
                  setScaleLength
                );
              }}
            />
          </label>

          <label htmlFor={Object.keys(defaultValues)[2]}>
            Fundamental frequency (f0):
            <StyledInput
              id={Object.keys(defaultValues)[2]}
              name="Fundamental frequency (f0)"
              type="number"
              defaultValue={defaultValues.f0}
              onChange={(event) => {
                handleInputChange(event, defaultValues.f0, setF0);
              }}
            />
          </label>
        </form>
      </Band>
      <Band gridless smolPadding id="results">
        {inputsSetAsDefault.length > 0 && (
          <ul>
            {inputsSetAsDefault.map((input) => (
              <li key={`${input.name}_InputSetAsDefault`}>
                {input.label} is not a valid number. Using the default value:{" "}
                {Object.keys(defaultValues)
                  .filter((key) => key === input.name)
                  .map(
                    (key) => defaultValues[key as keyof typeof defaultValues]
                  )}
              </li>
            ))}
          </ul>
        )}
        <ul>
          {[...Array(scaleLength + 2)].map((_, i) => {
            let f = getFi(i - 1, ratio, scaleLength, f0);
            return (
              <ol key={`${i}_Scale`}>
                <sub>{i + 1}</sub>
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
