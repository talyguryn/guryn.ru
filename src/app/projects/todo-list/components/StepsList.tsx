'use client';

import { Step } from '../types';
import StepItem from './StepItem';

interface StepsListProps {
  steps: Step[];
  onStepsChange: (steps: Step[]) => void;
}

export default function StepsList({ steps, onStepsChange }: StepsListProps) {
  const handleToggle = (index: number) => {
    onStepsChange(
      steps.map((s, i) => (i === index ? { ...s, isDone: !s.isDone } : s))
    );
  };

  const handleTextChange = (index: number, text: string) => {
    onStepsChange(steps.map((s, i) => (i === index ? { ...s, text } : s)));
  };

  const handleDelete = (index: number) => {
    onStepsChange(steps.filter((_, i) => i !== index));
  };

  const handleEnter = (index: number) => {
    onStepsChange([
      ...steps.slice(0, index + 1),
      { text: '', isDone: false },
      ...steps.slice(index + 1),
    ]);

    setTimeout(() => {
      const inputs = document.querySelectorAll(
        'input[placeholder="Шаг к цели"]'
      );
      if (inputs.length > index + 1) {
        (inputs[index + 1] as HTMLInputElement).focus();
      }
    }, 50);
  };

  const handleBackspace = (index: number) => {
    onStepsChange(steps.filter((_, i) => i !== index));

    setTimeout(() => {
      const inputs = document.querySelectorAll(
        'input[placeholder="Шаг к цели"]'
      );
      if (inputs.length > index - 1 && index > 0) {
        (inputs[index - 1] as HTMLInputElement).focus();
      }
    }, 50);
  };

  return (
    <ol className="relative border-l border-gray-200 ml-4">
      {steps.map((step, index) => (
        <StepItem
          key={index}
          step={step}
          index={index}
          onToggle={() => handleToggle(index)}
          onTextChange={(text) => handleTextChange(index, text)}
          onDelete={() => handleDelete(index)}
          onEnter={() => handleEnter(index)}
          onBackspace={() => handleBackspace(index)}
        />
      ))}
    </ol>
  );
}
