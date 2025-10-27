'use client';

interface ProjectHeaderProps {
  name: string;
  progress: number;
  onNameChange: (name: string) => void;
}

export default function ProjectHeader({
  name,
  progress,
  onNameChange,
}: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between mt-16 mb-8 w-full gap-4">
      <input
        className="text-3xl font-bold w-full outline-none"
        placeholder="Что делаем?"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />

      {progress !== 0 && (
        <div className="bg-gray-200 h-4 rounded-full w-96">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
