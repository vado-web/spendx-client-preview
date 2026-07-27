import type { CSSProperties, ImgHTMLAttributes } from "react";

type StaticImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
};

export default function StaticImage({
  src,
  fill,
  priority,
  unoptimized: _unoptimized,
  style,
  ...props
}: StaticImageProps) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const resolvedSrc = src.startsWith("/") ? `${base}${src}` : src;
  const fillStyle: CSSProperties | undefined = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        ...style,
      }
    : style;

  return (
    <img
      {...props}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      src={resolvedSrc}
      style={fillStyle}
    />
  );
}
