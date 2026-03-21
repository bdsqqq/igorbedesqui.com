import { blurhashToCssGradientString } from "@unpic/placeholder";
import {
  Image as UnpicImage,
  type ImageProps as UnpicImageProps,
} from "@unpic/react";

export type ImageProps = UnpicImageProps & {
  blurhash?: string;
};

export function Image({
  blurhash,
  background,
  priority,
  ...props
}: ImageProps) {
  return (
    <UnpicImage
      {...props}
      priority={priority}
      background={
        background ??
        (blurhash
          ? blurhashToCssGradientString(blurhash)
          : !import.meta.env.DEV && !priority
            ? "auto"
            : undefined)
      }
      fallback={props.fallback ?? (!import.meta.env.DEV ? "vercel" : undefined)}
    />
  );
}
