export enum colorType {
  blue = 'blue',
  red = 'red',
}

const colors = {
  [colorType.blue]:
    'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700',
  [colorType.red]:
    'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700',
};

export default function Tag({
  tag,
  count,
  color,
}: {
  tag: string;
  count?: number;
  color?: colorType;
}) {
  const tagColor = color ? colors[color] : colors.blue;

  return (
    <a
      href={`/notes/tags/${tag}`}
      key={tag}
      className={`${tagColor} px-3 py-1 pb-1.5 rounded-full text-sm cursor-pointer transition-colors not-underlined flex items-baseline gap-2`}
    >
      <div className="">{tag}</div>
      {count !== undefined && (
        <div className="font-semibold opacity-40 text-[12px]">{count}</div>
      )}
    </a>
  );
}
