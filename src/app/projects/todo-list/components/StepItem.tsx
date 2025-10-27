'use client';

import { Step } from '../types';

interface StepItemProps {
  step: Step;
  index: number;
  onToggle: () => void;
  onTextChange: (text: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  onBackspace: () => void;
}

export default function StepItem({
  step,
  index,
  onToggle,
  onTextChange,
  onDelete,
  onEnter,
  onBackspace,
}: StepItemProps) {
  return (
    <li className="mb-8 ml-6 flex items-center w-full">
      <span
        className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white transition-colors ${
          step.isDone ? 'bg-green-500' : 'bg-gray-200'
        }`}
      >
        <input
          className={`opacity-0 absolute w-full h-full outline-none cursor-pointer ${
            step.text === '' ? 'cursor-not-allowed' : ''
          }`}
          type="checkbox"
          checked={step.isDone}
          disabled={step.text === ''}
          onChange={onToggle}
        />
        {step.isDone && (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        )}
      </span>
      <div className="flex w-full justify-between pr-8">
        <input
          className={`w-full text-lg font-medium outline-none transition-colors ${
            step.isDone ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
          placeholder="Шаг к цели"
          value={step.text}
          onChange={(e) => onTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onEnter();
            }

            if (e.key === 'Backspace' && step.text === '') {
              e.preventDefault();
              onBackspace();
            }
          }}
        />

        <div className="flex items-center">
          <button
            className="ml-4 opacity-10 hover:opacity-100 hover:cursor-pointer transition-opacity"
            onClick={onDelete}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
}
