'use client';

interface ProgressFooterProps {
  progress: number;
}

export default function ProgressFooter({ progress }: ProgressFooterProps) {
  const getMessage = () => {
    if (progress === 0) return 'Сделайте первый шаг';
    if (progress < 40) return 'Супер! Продолжайте!';
    if (progress < 70) return 'Вы отлично движетесь!';
    if (progress < 100) return 'Осталось совсем чуть-чуть';
    return 'Цель достигнута! Вы герой!';
  };

  return (
    <>
      <div
        className={`flex items-center justify-start mt-2 transition-opacity ${
          progress !== 100 ? 'opacity-10' : ''
        }`}
      >
        <svg
          className={`w-8 h-8 transition-colors ${
            progress === 100 ? 'text-yellow-500' : 'text-gray-500'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 3l4 4L12 3l3 4 4-4v18H5V3z"
          ></path>
        </svg>
        <p className="ml-4 text-2xl font-bold text-gray-900">{getMessage()}</p>
      </div>
    </>
  );
}
