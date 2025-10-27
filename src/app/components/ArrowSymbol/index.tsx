type ArrowSymbolProps = {
  isExternalLink?: boolean;
  className?: string;
};

const ArrowSymbol: React.FC<ArrowSymbolProps> = ({
  isExternalLink,
  className,
}) => {
  return <span className={className}>{!isExternalLink ? "→" : "↗︎"}</span>;
};

export default ArrowSymbol;
