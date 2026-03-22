import { blurhashToCssGradientString } from "@unpic/placeholder";
import {
  Image as UnpicImage,
  type ImageProps as UnpicImageProps,
} from "@unpic/react";
import { isStaticImageData, type StaticImageData } from "@/lib/static-image";

type StaticImageProps = Omit<UnpicImageProps, "src" | "width" | "height"> & {
  blurhash?: string;
  src: StaticImageData;
  width?: UnpicImageProps["width"];
  height?: UnpicImageProps["height"];
};

type StringImageProps = UnpicImageProps & {
  blurhash?: string;
};

export type ImageProps = StringImageProps | StaticImageProps;

export function Image({
  blurhash,
  background,
  fallback,
  priority,
  src,
  width,
  height,
  layout,
  aspectRatio,
  ...props
}: ImageProps) {
  const resolvedBackground =
    background ??
    (blurhash
      ? blurhashToCssGradientString(blurhash)
      : !import.meta.env.DEV && !priority
        ? "auto"
        : undefined);
  const resolvedFallback =
    fallback ?? (!import.meta.env.DEV ? "vercel" : undefined);

  if (isStaticImageData(src)) {
    if (layout === "fullWidth") {
      return (
        <UnpicImage
          {...props}
          src={src.src}
          layout="fullWidth"
          height={height}
          aspectRatio={aspectRatio ?? src.w / src.h}
          priority={priority}
          background={resolvedBackground}
          fallback={resolvedFallback}
        />
      );
    }

    if (aspectRatio !== undefined && width !== undefined) {
      return (
        <UnpicImage
          {...props}
          src={src.src}
          layout={layout}
          width={width}
          aspectRatio={aspectRatio}
          priority={priority}
          background={resolvedBackground}
          fallback={resolvedFallback}
        />
      );
    }

    if (aspectRatio !== undefined && height !== undefined) {
      return (
        <UnpicImage
          {...props}
          src={src.src}
          layout={layout}
          height={height}
          aspectRatio={aspectRatio}
          priority={priority}
          background={resolvedBackground}
          fallback={resolvedFallback}
        />
      );
    }

    return (
      <UnpicImage
        {...props}
        src={src.src}
        layout={layout}
        width={width ?? src.w}
        height={height ?? src.h}
        priority={priority}
        background={resolvedBackground}
        fallback={resolvedFallback}
      />
    );
  }

  if (layout === "fullWidth") {
    return (
      <UnpicImage
        {...props}
        src={src}
        layout="fullWidth"
        height={height}
        aspectRatio={aspectRatio}
        priority={priority}
        background={resolvedBackground}
        fallback={resolvedFallback}
      />
    );
  }

  if (aspectRatio !== undefined && width !== undefined) {
    return (
      <UnpicImage
        {...props}
        src={src}
        layout={layout}
        width={width}
        aspectRatio={aspectRatio}
        priority={priority}
        background={resolvedBackground}
        fallback={resolvedFallback}
      />
    );
  }

  if (aspectRatio !== undefined && height !== undefined) {
    return (
      <UnpicImage
        {...props}
        src={src}
        layout={layout}
        height={height}
        aspectRatio={aspectRatio}
        priority={priority}
        background={resolvedBackground}
        fallback={resolvedFallback}
      />
    );
  }

  if (layout === "fixed") {
    return (
      <UnpicImage
        {...props}
        src={src}
        layout="fixed"
        width={width!}
        height={height!}
        priority={priority}
        background={resolvedBackground}
        fallback={resolvedFallback}
      />
    );
  }

  return (
    <UnpicImage
      {...props}
      src={src}
      layout={layout}
      width={width!}
      height={height!}
      priority={priority}
      background={resolvedBackground}
      fallback={resolvedFallback}
    />
  );
}
