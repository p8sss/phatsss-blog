import React, { type JSX } from "react";
import { useBaseUrlUtils } from "@docusaurus/useBaseUrl";

import { LANDING_IMAGES, type LandingImageName } from "@/lib/landing-images";

interface LandingPictureProps {
  name: LandingImageName;
  alt: string;
  className?: string;
}

/** A 960px landing screenshot: WebP with a JPEG fallback, explicit size, lazy. */
export function LandingPicture({ name, alt, className }: LandingPictureProps): JSX.Element {
  const { withBaseUrl } = useBaseUrlUtils();
  const { width, height } = LANDING_IMAGES[name];
  const base = `/img/landing/960/${name}`;
  return (
    // `contents`: the <img> sizes against the card's aspect box, not the <picture>
    <picture className="contents">
      <source type="image/webp" srcSet={withBaseUrl(`${base}.webp`)} />
      <img
        src={withBaseUrl(`${base}.jpg`)}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
}
