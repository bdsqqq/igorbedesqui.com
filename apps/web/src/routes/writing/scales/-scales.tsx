"use client";

import React, {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import {
  FormInput,
  useFormStore,
  Combobox,
  ComboboxItem,
  ComboboxPopover,
  useComboboxStore,
  useStoreState,
} from "@ariakit/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/styling";

import {
  scalePresets,
  scaleDefaults,
  initialScalesValues,
  resolveScales,
  getScaleFrequency,
  filterScalePresets,
  type ScalesValues,
  type ScalePreset,
} from "./-model";
export {
  scalePresets,
  scaleDefaults,
  initialScalesValues,
  resolveScales,
  getScaleFrequency,
} from "./-model";
export type { ScalesValues, ScalePreset } from "./-model";

type ValuesOwnership =
  | {
      values: ScalesValues;
      onValuesChange: (values: ScalesValues) => void;
      defaultValues?: never;
    }
  | {
      values?: never;
      defaultValues?: ScalesValues;
      onValuesChange?: (values: ScalesValues) => void;
    };
export type ScalesProps = ValuesOwnership & {
  presets?: readonly ScalePreset[];
  children?: ReactNode;
};

function useScalesState(props: ScalesProps) {
  const instanceId = useId();
  const [internal, setInternal] = useState(
    () => props.defaultValues ?? initialScalesValues,
  );
  const values = props.values ?? internal;
  const change = (next: ScalesValues) => {
    if (props.values === undefined) setInternal(next);
    props.onValuesChange?.(next);
  };
  const form = useFormStore({
    values: {
      "Fundamental frequency (f0)": values.f0,
      "Scale Length": values.scaleLength,
    },
    setValues: (next) =>
      change({
        ...values,
        f0: next["Fundamental frequency (f0)"],
        scaleLength: next["Scale Length"],
      }),
  });
  const comboboxStore = useComboboxStore({
    value: values.ratio,
    setValue: (ratio) => change({ ...values, ratio }),
  });
  const comboboxPlacement = useStoreState(comboboxStore, "currentPlacement");
  const numeric = resolveScales(values);
  const inputsSetAsDefault = (
    Object.keys(numeric.invalid) as (keyof ScalesValues)[]
  )
    .filter((name) => numeric.invalid[name])
    .map((name) => ({
      name,
      label: {
        ratio: "Ratio",
        scaleLength: "Scale Length",
        f0: "Fundamental frequency (f0)",
      }[name],
    }));
  return {
    instanceId,
    values,
    form,
    comboboxStore,
    comboboxPlacement,
    ...numeric,
    inputsSetAsDefault,
    filteredPreDefinedScales: filterScalePresets(
      props.presets ?? scalePresets,
      values.ratio,
    ),
  };
}
const ScalesContext = createContext<ReturnType<typeof useScalesState> | null>(
  null,
);
/** Custom parts share the root's draft and native form/combobox behavior. */
export function useScales() {
  const context = useContext(ScalesContext);
  if (!context) throw new Error("scales parts require Scales");
  return context;
}
/** Draft strings are independent of computed output. Defaults initialize once; key the root to reset.
 * Keep controlled/uncontrolled ownership stable. Supplied presets, including [], never fetch.
 */
export function Scales(props: ScalesProps) {
  const state = useScalesState(props);
  return (
    <ScalesContext.Provider value={state}>
      {props.children === undefined ? (
        <>
          <ScalesInputs />
          <ScalesResults />
        </>
      ) : (
        props.children
      )}
    </ScalesContext.Provider>
  );
}
export function ScalesInputs() {
  const {
    instanceId,
    values,
    form,
    comboboxStore,
    comboboxPlacement,
    filteredPreDefinedScales,
  } = useScales();
  return (
    <>
      <Formula
        ratio={
          <span className="row-start-2 row-end-4 w-fit text-3xl leading-none">
            r
          </span>
        }
        f0={
          <span className="row-start-2 row-end-4 w-fit text-3xl leading-none">
            𝑓<span className="text-base">0</span>
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
                width: `calc(${(values.ratio || "1").length}ch + 0.5rem)`,
              }}
              id={`${instanceId}-ratio`}
              name="Ratio"
              aria-label="Ratio"
              autoComplete="list"
              autoSelect
              store={comboboxStore}
              placeholder="1"
            />
            {filteredPreDefinedScales.length > 0 && (
              <ComboboxPopover
                store={comboboxStore}
                data-placement={comboboxPlacement}
                data-side={comboboxPlacement.split("-")[0]}
                style={{
                  transformOrigin: `var(--popover-transform-origin, ${comboboxPlacement.startsWith("top") ? "bottom left" : "top left"})`,
                }}
                gutter={4}
                sameWidth={false}
                fitViewport
                className={cn(
                  "surface-popover ak-layer ak-layer-lighten-6 ak-frame ak-frame-card/1 ak-frame-border z-10 shadow-sm",
                )}
              >
                {filteredPreDefinedScales.map((scale) => (
                  <ComboboxItem
                    key={`${scale.name}_ComboboxItem`}
                    className="ak-layer ak-layer-transparent ak-frame ak-frame-field/1 hover:ak-state-6 data-active-item:ak-state-6 aria-selected:ak-state-10 cursor-pointer px-3 duration-fast-01 ease-productive-standard motion-safe:transition-colors"
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
          <FormInput
            store={form}
            className={inputVariants()}
            style={{
              width: `calc(${(values.f0 || "1").length}ch + 0.5rem)`,
            }}
            id={`${instanceId}-f0`}
            name="Fundamental frequency (f0)"
            aria-label="Fundamental frequency (f0)"
            inputMode="numeric"
            placeholder="1"
          />
        }
        scaleLength={
          <FormInput
            store={form}
            className={inputVariants({ size: "sm" })}
            style={{
              width: `calc(${(values.scaleLength || "14").length}ch + 0.5rem)`,
            }}
            id={`${instanceId}-scaleLength`}
            name="Scale Length"
            aria-label="Scale length"
            inputMode="numeric"
            placeholder="14"
            maxLength={2}
          />
        }
      />
    </>
  );
}
export function ScalesResults() {
  const { inputsSetAsDefault, scaleLength, ratio, f0 } = useScales();
  return (
    <>
      {inputsSetAsDefault.length > 0 && (
        <ul className="ak-ink-70 [&>li]:py-2">
          {inputsSetAsDefault.map((input) => (
            <li key={`${input.name}_InputSetAsDefault`}>
              {input.label} is not a valid number. Using the default value:{" "}
              {scaleDefaults[input.name]}
            </li>
          ))}
        </ul>
      )}
      <div
        role="region"
        aria-label="Font size preview"
        tabIndex={0}
        className="min-w-0 max-w-full overflow-x-auto overflow-y-hidden"
      >
        <div className="relative w-full whitespace-nowrap pb-8 text-center">
          {[...Array(scaleLength + 2)].map((_, i) => {
            const f = getScaleFrequency(i - 1, ratio, scaleLength, f0);
            return (
              <span
                key={`${i}_Scale`}
                style={{
                  userSelect: "none",
                  position: "relative",
                  lineHeight: ".4em",
                  fontSize: `${f}rem`,
                  height: ".6em",
                  width: ".48em",
                  minWidth: "1.5rem",
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
    </>
  );
}
const inputVariants = cva(
  "relative ak-layer ak-layer-lighten-6 ak-frame ak-frame-field/1 text-center hover:ak-state-6 focus:ak-state-6 focus-visible:ak-outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-within:z-10 motion-safe:transition-colors duration-fast-01 ease-productive-standard",
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

export function Formula({
  ratio,
  f0,
  scaleLength,
}: {
  ratio: ReactNode;
  f0: ReactNode;
  scaleLength: ReactNode;
}) {
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
}
