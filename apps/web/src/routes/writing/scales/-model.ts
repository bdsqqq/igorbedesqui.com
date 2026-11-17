export type ScalePreset = { name: string; value: string };
export type ScalesValues = { ratio: string; scaleLength: string; f0: string };

// Formula: https://spencermortensen.com/articles/typographic-scale/
export const scalePresets: readonly ScalePreset[] = [
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

export const scaleDefaults = {
  ratio: scalePresets[0].value,
  scaleLength: 14,
  f0: 1,
};

// The original editor starts at ratio 1; invalid ratio previews use 2.
export const initialScalesValues: ScalesValues = {
  ratio: "1",
  scaleLength: "14",
  f0: "1",
};
export function resolveScales(values: ScalesValues) {
  const ratio = parseFloat(values.ratio.replace(",", "."));
  const scaleLength = parseFloat(values.scaleLength);
  const f0 = parseFloat(values.f0);
  return {
    ratio: Number.isNaN(ratio) ? 2 : ratio,
    scaleLength: Number.isNaN(scaleLength)
      ? scaleDefaults.scaleLength
      : Math.floor(scaleLength),
    f0: Number.isNaN(f0) ? scaleDefaults.f0 : f0,
    invalid: {
      ratio: Number.isNaN(ratio),
      scaleLength: Number.isNaN(scaleLength),
      f0: Number.isNaN(f0),
    },
  };
}
export function getScaleFrequency(
  i: number,
  ratio: number,
  scaleLength: number,
  f0: number,
) {
  return f0 * Math.pow(ratio * 10, i / scaleLength);
}
export function filterScalePresets(
  presets: readonly ScalePreset[],
  value: string,
) {
  return presets.filter(
    (scale) =>
      scale.name.toLowerCase().replace(".", "").includes(value.toLowerCase()) ||
      scale.value
        .toLowerCase()
        .replace(".", "")
        .includes(value.toLowerCase().replace(",", "")) ||
      scale.name.toLowerCase().includes(value.toLowerCase()) ||
      scale.value.toLowerCase().includes(value.toLowerCase()),
  );
}
