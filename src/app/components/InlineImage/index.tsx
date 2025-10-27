import React from "react";
import Image from "next/image";

type InlineImageProps = {
  image: string;
  alt?: string;
};

const InlineImage: React.FC<InlineImageProps> = ({ image, alt }) => (
  <span
    className="relative flex-shrink-0 inline-block align-baseline"
    style={{ width: "1em", height: "1em" }}
  >
    <Image
      src={image}
      alt={alt || ""}
      fill
      className="rounded object-cover"
      style={{ marginTop: "0.125em" }}
    />
  </span>
);

export default InlineImage;
