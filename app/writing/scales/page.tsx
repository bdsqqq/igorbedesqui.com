"use client";

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
      inputsSetAsDefault.filter((input) => input.name !== name),
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
    setState: (value: number) => void,
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

  const comboboxStore = useComboboxStore({
    defaultValue: "1", // default value 1 allows the user to see all the others options in the combobox while being a good starting point too
  });
  const comboboxValue = useStoreState(comboboxStore, "value");

  const [filteredPreDefinedScales, setFilteredPreDefinedScales] =
    useState(preDefinedScales);

  useEffect(() => {
    const valueWithoutComma = comboboxValue.replace(",", ".");
    if (numberInputIsValid(valueWithoutComma)) {
      setRatio(parseFloat(valueWithoutComma));
      removeFromInputsSetAsDefault(Object.keys(defaultValues)[0]);
    } else {
      setRatio(2);
      addToInputsSetAsDefault("Ratio", Object.keys(defaultValues)[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comboboxValue]);

  useEffect(() => {
    setFilteredPreDefinedScales(
      preDefinedScales.filter((scale) => {
        return (
          scale.name
            .toLowerCase()
            .replace(".", "")
            .includes(comboboxValue.toLowerCase()) ||
          scale.value
            .toLowerCase()
            .replace(".", "")
            .includes(comboboxValue.toLowerCase().replace(",", "")) ||
          scale.name
            .toLowerCase()
            .includes(comboboxValue.toLowerCase()) ||
          scale.value.toLowerCase().includes(comboboxValue.toLowerCase())
        );
      }),
    );
  }, [comboboxValue]);

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
        <p className="lg:max-w-prose">
          {`Recently I've been curious about Design and its relation to website development. During one of my usual rabbit hole deep dives, I stumbled upon a blog post by spencer Mortensen. It was a fascinating read that went into detail about the history of the typographic scale. But more importantly to me, it presented a mathematical formula that can generate harmonic scales.`}
          <br />
          <br />
          {`Spencer Mortensen himself made a tool to calculate type scales, but after the subject lingered in my head for a while, I decided to implement my version of it.`}
        </p>
      </Band>
      <Band headline={{ bold: "01", thin: "Title" }}>
        <Formula
          ratio={
            <span className="row-start-2 row-end-4 w-fit text-3xl leading-none">
              r
            </span>
          }
          f0={
            <span className="row-start-2 row-end-4 w-fit text-3xl leading-none">
              𝑓
              <span className="text-base">0</span>
            </span>
          }
          scaleLength={<div>𝑛</div>}
        />
        <Formula
          ratio={
            <>
              <Combobox
                className={inputVariants()}
                style={{
                  width: `calc(${
                    refs.ratio?.current?.value.toString().length || 1
                  }ch + 0.5rem)`,
                }}
                ref={refs.ratio}
                id={Object.keys(defaultValues)[0]}
                name="Ratio"
                autoComplete="list"
                autoSelect
                store={comboboxStore}
                placeholder="1"
              />
              {filteredPreDefinedScales.length > 0 && (
                <ComboboxPopover
                  store={comboboxStore}
                  gutter={4}
                  sameWidth={false}
                  fitViewport
                  className={cn(
                    "bg-gray-02 border-gray-07 z-10 transform rounded-sm border text-gray-12 shadow-sm transition-all duration-fast-02",
                    "data-[placement=bottom-start]:origin-top-left",
                    "data-[placement=top-start]:origin-bottom",
                    "data-[enter]:ease-productive-enter data-[enter]:opacity-100",
                    "data-[leave]:opacity-0 data-[leave]:ease-productive-exit",
                    "data-[enter]:translate-y-0",
                    "data-[placement=bottom-start]:data-[leave]:-translate-y-2",
                    "data-[placement=top-start]:data-[leave]:translate-y-2",
                  )}
                >
                  {filteredPreDefinedScales.map((scale) => (
                    <ComboboxItem
                      key={`${scale.name}_ComboboxItem`}
                      className="hover:bg-gray-04 focus:bg-gray-04 aria-selected:bg-gray-05 cursor-pointer rounded-sm border-none px-3 py-1 duration-fast-01 ease-productive-standard motion-safe:transition-colors"
                      value={scale.value}
                    >
                      {scale.name}
                    </ComboboxItem>
                  ))}
                </ComboboxPopover>
              )}
            </>
          }
          f0={
            <input
              className={inputVariants()}
              style={{
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
            <input
              className={inputVariants({ size: "sm" })}
              style={{
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
      <Band gridless options={{ padding: "none" }} id="results">
        {inputsSetAsDefault.length > 0 && (
          <ul>
            {inputsSetAsDefault.map((input) => (
              <li key={`${input.name}_InputSetAsDefault`}>
                {input.label} is not a valid number. Using the default value:{" "}
                {Object.keys(defaultValues)
                  .filter((key) => key === input.name)
                  .map(
                    (key) => defaultValues[key as keyof typeof defaultValues],
                  )}
              </li>
            ))}
          </ul>
        )}
        <div className="overflow-x-auto">
          <div className="relative w-full overflow-y-hidden overflow-x-visible whitespace-nowrap pb-8 text-center">
            {[...Array(scaleLength + 2)].map((_, i) => {
              let f = getFi(i - 1, ratio, scaleLength, f0);
              return (
                <span
                  key={`${i}_Scale`}
                  style={{
                    userSelect: "none",
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
                      userSelect: "all",
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
          </div>
        </div>
      </Band>
    </Container>
  );
};

const inputVariants = cva(
  "relative focus-within:z-10 p-1 bg-gray-03 text-gray-12 text-center border-none rounded-sm outline outline-1 outline-transparent hover:bg-gray-04 focus:gray-05 focus:outline-gray-08 !ring-0 !ring-offset-0 focus-v motion-safe:transition-colors duration-fast-01 ease-productive-standard",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
const Formula: React.FC<{
  ratio: ReactNode;
  f0: ReactNode;
  scaleLength: ReactNode;
}> = ({ ratio, f0, scaleLength }) => {
  return (
    <div className="grid w-min grid-rows-3">
      <span className="row-start-2 row-end-4 text-3xl leading-none">𝑓</span>
      <span className="row-start-3 row-end-4 w-fit">𝑖</span>
      <span className="row-start-2 row-end-4 flex w-fit items-center text-3xl">
        <span>=</span>
      </span>
      <span className="row-start-2 row-end-4 mx-0.5 place-self-center text-2xl leading-none">
        {f0}
      </span>
      <div className="row-start-2 row-end-4 flex flex-col content-center justify-center">
        <div className="w-4">
          <Cross2Icon />
        </div>
      </div>
      <span className="row-start-2 row-end-4 mx-0.5 place-self-center">
        {ratio}
      </span>
      <div className="col-start-[99] row-start-1 row-end-3 flex w-fit flex-col items-center justify-end leading-[0.8em]">
        <div className="min-w-[2.5ch] pb-1 text-center">𝑖</div>
        <div className="my-0.5 w-1/2 border-b border-current" />
        <div>{scaleLength}</div>
      </div>
    </div>
  );
};

export default Scales;

import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxStore,
  useStoreState,
} from "@ariakit/react";

import Container from "@/components/Container";
import Band from "@/components/Band";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/styling";
