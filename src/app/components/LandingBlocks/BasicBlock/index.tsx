type BasicBlockProps = {
  children: React.ReactNode;
  className?: string;
};

const BasicBlock: React.FC<BasicBlockProps> = ({ children, className }) => {
  const classes = `w-full p-4 pb-8 rounded-xl ${className || ''}`;

  return <div className={classes}>{children}</div>;
};

export default BasicBlock;
