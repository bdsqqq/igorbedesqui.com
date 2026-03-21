import { forwardRef } from "react";

type StaticImport = { src: string; height: number; width: number };

export type ImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> & {
  src: string | StaticImport;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  alt: string;
  /** @deprecated legacy next/image prop — normalized to width:100% */
  layout?: "responsive" | "fill" | "fixed" | "intrinsic";
  /** @deprecated legacy next/image prop — use style.objectFit */
  objectFit?: React.CSSProperties["objectFit"];
  /** @deprecated legacy next/image prop — use style.objectPosition */
  objectPosition?: React.CSSProperties["objectPosition"];
};

const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  {
    src,
    fill,
    quality: _quality,
    priority,
    placeholder: _placeholder,
    blurDataURL: _blurDataURL,
    unoptimized: _unoptimized,
    layout,
    objectFit,
    objectPosition,
    style,
    alt,
    ...rest
  },
  ref,
) {
  const resolvedSrc = typeof src === "string" ? src : src.src;

  const mergedStyle: React.CSSProperties = {
    ...(fill && {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }),
    ...(layout === "responsive" && { width: "100%", height: "auto" }),
    ...(objectFit && { objectFit }),
    ...(objectPosition && { objectPosition }),
    ...style,
  };

  return (
    <img
      ref={ref}
      src={resolvedSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      style={Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined}
      {...rest}
    />
  );
});

export default Image;
