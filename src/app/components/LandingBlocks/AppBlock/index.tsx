import InlineImage from "@/components/InlineImage";
import BasicBlock from "../BasicBlock";

interface AppBlockProps {
  title: string;
  logo: string;
  description: React.ReactNode;
  image: string;
}

const AppBlock: React.FC<AppBlockProps> = ({
  title,
  logo,
  description,
  image,
}) => {
  return (
    <BasicBlock>
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4">
            <InlineImage image={logo} alt={title} /> {title}
          </h2>
          {description}
        </div>
        <div className="md:w-1/2">
          <img src={image} alt={title} />
        </div>
      </div>
    </BasicBlock>
  );
};

export default AppBlock;
