export const defaultOgText = "hello, *world*\nthis is a new line";

export function generateOgUrl(text: string) {
  return `/api/og?text=${encodeURIComponent(text.replace(/\n/g, "/n"))}`;
}

export type ImageLoadResult =
  | { status: "ready"; src: string }
  | { status: "error"; error: Error };

/** A load belongs to one preview attempt. Expected image errors are values, not a poisoned cache. */
export function createImageLoad(
  src: string,
  createImage: () => HTMLImageElement = () => new Image(),
) {
  const image = createImage();
  const promise = new Promise<ImageLoadResult>((resolve) => {
    // Set handlers first: cached/data images may finish as soon as src is assigned.
    image.onload = () => resolve({ status: "ready", src });
    image.onerror = () =>
      resolve({
        status: "error",
        error: new Error(`Unable to load preview: ${src}`),
      });
    image.src = src;
  });
  return {
    promise,
    dispose() {
      image.onload = null;
      image.onerror = null;
    },
  };
}
