import React from "react";
import Link from "next/link";
import InlineImage from "../InlineImage";
import ArrowSymbol from "../ArrowSymbol";

type InlineLinkProps = {
  text: string;
  href: string;
  image?: string;
  newTab?: boolean;
};

// ↗︎
// →

const InlineLink: React.FC<InlineLinkProps> = ({
  text,
  href,
  image,
  newTab,
}) => (
  <Link
    href={href}
    target={newTab ? "_blank" : undefined}
    className="underline"
  >
    {image && (
      <>
        <InlineImage image={image} alt={text} />
        {" "}
      </>
    )}
    {text}
  </Link>
);

export default InlineLink;
