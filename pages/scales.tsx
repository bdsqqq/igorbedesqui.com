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
  scaleLength: 14,
  f0: 1, // f0 == fundamental frequency. Usually this is 12pt(1 pica) for print but using 1(rem) makes sense since it's equivalent to 16px.
};

const Scales = () => {
  const [ratio, setRatio] = useState(parseFloat(defaultValues.ratio));
  const [scaleLength, setScaleLength] = useState(defaultValues.scaleLength);
  const [f0, setF0] = useState(defaultValues.f0);
  const [inputsSetAsDefault, setInputsSetAsDefault] = useState<
    { label: string; name: string }[]
  >([]);

  const ratioRef = useRef<HTMLInputElement>(null);
  const scaleLengthRef = useRef<HTMLInputElement>(null);
  const f0Ref = useRef<HTMLInputElement>(null);

  const refs = {
    ratio: ratioRef,
    scaleLength: scaleLengthRef,
    f0: f0Ref,
  };

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
    return f0 * Math.pow(ratio * 10, i / scaleLength);
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
    fitViewport: true,
    focusLoop: true,
    flip: false,
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
  // + allow the user to select from pre-defined values.
  // + allow the user to enter a custom value.
  // + fallback to a default value if the user enters an invalid value.
  // - - display a hint if the user enters an invalid value.
  // + display the results of the scale and preview them using a letter, see: https://spencermortensen.com/articles/typographic-scale/.
  // - - Allow the user to somehow export the font-sizes generated?
  // - - - This is low priority as I think of this page more as a playground than as a tool. But having the functionality could definitelly open the possibility to make this into a standalone thing.

  return (
    <Container>
      <Band headline={{ bold: "01", thin: "what's this?" }}>
        <Text
          as="p"
          css={{
            "@lg": {
              maxWidth: "50ch",
            },
          }}
        >
          {`Recently I've been curious about Design and its relation to website development. During one of my usual rabbit hole deep dives, I stumbled upon a blog post by spencer Mortensen. It was a fascinating read that went into detail about the history of the typographic scale. But more importantly to me, it presented a mathematical formula that can generate harmonic scales.`}
          <br />
          <br />
          {`Spencer Mortensen himself made a tool to calculate type scales, but after the subject lingered in my head for a while, I decided to implement my version of it.`}
        </Text>
      </Band>
      <Band smolPadding headline={{ bold: "01", thin: "Title" }}>
        <Formula
          ratio={
            <Box
              as="span"
              css={{
                width: "fit-content",
                gridRow: "2 / 4",
                fontSize: "2rem",
              }}
            >
              r
            </Box>
          }
          f0={
            <Box
              as="span"
              css={{
                width: "fit-content",
                gridRow: "2 / 4",
                fontSize: "2rem",
              }}
            >
              𝑓
              <Box
                as="span"
                css={{
                  fontSize: "1rem",
                }}
              >
                0
              </Box>
            </Box>
          }
          scaleLength={<Box>𝑛</Box>}
        />
        <Formula
          ratio={
            <>
              <StyledComboBox
                css={{
                  width: `calc(${
                    refs.ratio?.current?.value.toString().length || 1
                  }ch + 0.5rem)`,
                  fontSize: "1.5rem",
                }}
                ref={refs.ratio}
                id={Object.keys(defaultValues)[0]}
                name="Ratio"
                autoComplete="list"
                autoSelect
                state={comboboxState}
                placeholder="1"
              />
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
            </>
          }
          f0={
            <StyledInput
              css={{
                width: `calc(${
                  refs.f0?.current?.value.length || 1
                }ch + 0.5rem)`,
              }}
              ref={refs.f0}
              id={Object.keys(defaultValues)[2]}
              name="Fundamental frequency (f0)"
              inputMode="numeric"
              defaultValue={defaultValues.f0}
              placeholder="1"
              onChange={(event) => {
                handleInputChange(event, defaultValues.f0, setF0);
              }}
            />
          }
          scaleLength={
            <StyledInput
              css={{
                width: `calc(${
                  refs.scaleLength?.current?.value.length || 1
                }ch + 0.5rem)`,
              }}
              ref={refs.scaleLength}
              id={Object.keys(defaultValues)[1]}
              name="Scale Length"
              inputMode="numeric"
              defaultValue={defaultValues.scaleLength}
              placeholder="14"
              maxLength={2}
              onChange={(event) => {
                handleInputChange(event, defaultValues.scaleLength, (value) => {
                  // TODO: add specific error message for if this is not an integer.
                  setScaleLength(Math.floor(value));
                });
              }}
            />
          }
        />
      </Band>
      <Band gridless padless fullBleed id="results">
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
        <Box
          css={{
            overflowX: "scroll",
          }}
        >
          <Box
            css={{
              position: "relative",
              overflowX: "visible",
              overflowY: "hidden",
              whiteSpace: "nowrap",
              width: "100%",
              textAlign: "center",
              paddingBottom: "2rem",
            }}
          >
            {[...Array(scaleLength + 2)].map((_, i) => {
              let f = getFi(i - 1, ratio, scaleLength, f0);
              return (
                <span
                  key={`${i}_Scale`}
                  style={{
                    position: "relative",
                    lineHeight: `.4em`,
                    fontSize: `${f}rem`,
                    height: `.6em`,
                    width: `.48em`,
                    minWidth: `1.5rem`,
                    textAlign: "center",
                    overflow: "visible",
                    display: "inline-block",
                  }}
                >
                  <span>a</span>

                  <sub
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",

                      position: "absolute",
                      top: "calc(100% + 0.2rem)",

                      width: "100%",
                      height: "1rem",
                      lineHeight: "1rem",
                      textAlign: "center",

                      fontSize: ".7937rem",
                    }}
                  >
                    {(f * 16).toFixed(0)}
                  </sub>
                </span>
              );
            })}
          </Box>
        </Box>
      </Band>
    </Container>
  );
};

const StyledComboBox = styled(Combobox, {
  padding: "$spacing-02",
  backgroundColor: "$mauve3",

  color: "$mauve12",

  textAlign: "center",

  border: "none",
  borderRadius: "$sm",
  outlineRing: "",
  outlineColor: "transparent",

  "&:hover": {
    backgroundColor: "$mauve4",
  },

  "&:focus": {
    backgroundColor: "$mauve5",
  },

  "@motionOk": {
    transitionProperty: "outline-color, background-color",
    transitionDuration: duration.fast01,
    transitionTimingFunction: timingFunction.productive.standard,
  },
  length: 0,
});

const StyledComboboxPopover = styled(ComboboxPopover, {
  backgroundColor: "$mauve2",
  width: "max-content",
  padding: "$spacing-02",
  borderRadius: "$sm",
  zIndex: "1",

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
  length: 0,
});

const StyledComboBoxItem = styled(ComboboxItem, {
  cursor: "pointer",
  padding: "$spacing-02 $spacing-04",

  border: "none",
  borderRadius: "$sm",
  outlineRing: "none",

  "&:hover": {
    backgroundColor: "$mauve4",
  },

  "&[aria-selected=true]": {
    backgroundColor: "$mauve5",
  },

  "@motionOk": {
    transitionProperty: "background-color",
    transitionDuration: duration.fast01,
    transitionTimingFunction: timingFunction.productive.standard,
  },
  length: 0,
});

const StyledInput = styled("input", {
  appearance: "textfield",
  backgroundColor: "$mauve3",
  color: "$mauve12",

  textAlign: "center",
  padding: "$spacing-02",

  border: "none",
  borderRadius: "$sm",
  outlineRing: "",
  outlineColor: "transparent",

  "&:hover": {
    backgroundColor: "$mauve4",
  },

  "&:focus": {
    backgroundColor: "$mauve5",
  },

  "@motionOk": {
    transitionProperty: "outline-color, background-color",
    transitionDuration: duration.fast01,
    transitionTimingFunction: timingFunction.productive.standard,
  },

  length: 0,
});

const Formula: React.FC<{
  ratio: ReactNode;
  f0: ReactNode;
  scaleLength: ReactNode;
}> = ({ ratio, f0, scaleLength }) => {
  return (
    <Box
      css={{
        display: "grid",
        gridTemplateRows: "repeat(3, 1fr)",
        gridAutoColumns: "min-content",
        width: "min-content",
      }}
    >
      <Box
        as="span"
        css={{
          gridRow: "2 / 4",
          fontSize: "2rem",
        }}
      >
        𝑓
      </Box>
      <Box
        as="span"
        css={{
          width: "fit-content",
          gridRow: "3 / 4",
        }}
      >
        𝑖
      </Box>
      <Box
        as="span"
        css={{
          width: "fit-content",
          gridRow: "2 / 4",
          fontSize: "2rem",
        }}
      >
        =
      </Box>
      <Box
        as="span"
        css={{
          marginX: "$spacing-01",
          gridRow: "2 / 4",
          placeSelf: "center",
          fontSize: "1.5rem",
        }}
      >
        {f0}
      </Box>
      <Box
        as="div"
        css={{
          gridRow: "2 / 4",
          display: "flex",
          alignContent: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          css={{
            width: "15px",
          }}
        >
          <Cross2Icon />
        </Box>
      </Box>
      <Box
        as="span"
        css={{
          marginX: "$spacing-01",
          gridRow: "2 / 4",
          placeSelf: "center",
        }}
      >
        {ratio}
      </Box>
      <Box
        as="div"
        css={{
          width: "fit-content",
          gridRow: "1 / 3",
          gridColumn: "99",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "-0.2em",
          lineHeight: "0.8em",
        }}
      >
        <Box>𝑖</Box>
        <Box
          css={{
            width: "50%",
            borderBottom: "1px solid currentColor",
            marginY: "$spacing-01",
          }}
        />
        <Box>{scaleLength}</Box>
      </Box>
    </Box>
  );
};

export default Scales;

import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxState,
} from "ariakit/combobox";
import { styled } from "stitches.config";

import {
  duration,
  scaleIn,
  scaleOut,
  slideDown,
  slideUp,
  timingFunction,
} from "@/animations";
import Container from "@/components/Container";
import Band from "@/components/Band";
import { Box } from "@/components/ui/primitives";
import Text from "@/components/ui/Text";
import { Cross2Icon } from "@radix-ui/react-icons";
