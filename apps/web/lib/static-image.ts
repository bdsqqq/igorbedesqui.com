export type StaticImageData = {
  src: string;
  w: number;
  h: number;
  srcset?: string;
};

export function isStaticImageData(value: unknown): value is StaticImageData {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeImage = value as Partial<StaticImageData>;

  return (
    typeof maybeImage.src === "string" &&
    typeof maybeImage.w === "number" &&
    typeof maybeImage.h === "number"
  );
}
