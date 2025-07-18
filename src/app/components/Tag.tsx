export default function Tag({ tag, count }: { tag: string; count?: number }) {
  return (
    <a
      href={`/notes/tags/${tag}`}
      key={tag}
      className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 pb-1.5 rounded-full text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors not-underlined flex items-baseline gap-1"
    >
      <div className="">{tag}</div>
      {count !== undefined && (
        <div className="font-semibold opacity-60">{count}</div>
      )}
    </a>
  );
}
