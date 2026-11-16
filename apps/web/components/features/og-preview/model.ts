export const defaultOgText = "hello, *world*\nthis is a new line";

export function generateOgUrl(text: string) {
  return `/api/og?text=${encodeURIComponent(text.replace(/\n/g, "/n"))}`;
}

/** A load belongs to one preview attempt. Failed loads never poison a shared URL cache. */
export function createImageLoad(
  src: string,
  createImage: () => HTMLImageElement = () => new Image(),
) {
  const image = createImage();
  const promise = new Promise<string>((resolve, reject) => {
    // Set handlers first: cached/data images may finish as soon as src is assigned.
    image.onload = () => resolve(src);
    image.onerror = () => reject(new Error(`Unable to load preview: ${src}`));
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
