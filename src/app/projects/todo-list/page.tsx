'use client';

import './styles.css';
import { useEffect, useState } from 'react';
import { LocalStorageDatabase } from '@/utils/db';

import Confetti from './confetti';

interface Step {
  text: string;
  isDone: boolean;
}

interface Project {
  name: string;
  description?: string;
  descBenefit?: string;
  descMethod?: string;
  descProof?: string;
  steps: Step[];
}

export default function Page() {
  const db = new LocalStorageDatabase('camp-beta-1');

  const [name, setName] = useState('');
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);

  let isDbLoading = false;

  useEffect(() => {
    isDbLoading = true;

    db.get('steps')
      .then((storedSteps) => {
        if (
          !storedSteps ||
          !Array.isArray(storedSteps) ||
          storedSteps.length === 0
        ) {
          storedSteps = [{ text: '', isDone: false }];
        }

        setSteps(storedSteps as Step[]);
      })
      .then(() => db.get('name'))
      .then((storedName) => {
        if (storedName) {
          setName(storedName as string);
        }
      })
      .finally(() => {
        isDbLoading = false;
      });
  }, []);

  useEffect(() => {
    if (steps.length === 0) {
      setSteps([{ text: '', isDone: false }]);
    }

    const calculatedProgress = (() => {
      const totalSteps = steps.length;
      const doneSteps = steps.filter((step) => step.isDone).length;

      return totalSteps === 0 ? 0 : (doneSteps / totalSteps) * 100;
    })();

    if (calculatedProgress === 100) {
      new Confetti();
    }

    setProgress(calculatedProgress);

    if (!isDbLoading) db.set('steps', steps);
  }, [steps]);

  useEffect(() => {
    if (!isDbLoading) db.set('name', name);
  }, [name]);

  return (
    <>
      <div className="max-w-3xl mt-30 mb-60 mx-auto p-4 flex flex-col">
        <div className="flex items-center justify-between mt-16 mb-8 w-full gap-4">
          <input
            className="text-3xl font-bold w-full outline-none"
            placeholder="Что делаем?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {progress !== 0 && (
            <div className="bg-gray-200 h-4 rounded-full w-96">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${progress}%`, transition: 'width 0.5s' }}
              ></div>
            </div>
          )}
        </div>

        <div className="flex flex-col py-4">
          <ol className="relative border-l border-gray-200 ml-4">
            {steps &&
              steps.map((step, index) => (
                <li key={index} className="mb-8 ml-6 flex items-center w-full">
                  <span
                    className={`absolute flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full -left-4 ring-4 ring-white  ${
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
                      onChange={() => {
                        setSteps((prevSteps) =>
                          prevSteps.map((s, i) =>
                            i === index ? { ...s, isDone: !s.isDone } : s
                          )
                        );
                      }}
                    />
                    {step.isDone && (
                      <svg
                        className="w-5 h-5 text-white "
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
                      className={`w-full text-lg font-medium outline-none ${
                        step.isDone
                          ? 'line-through text-gray-500'
                          : 'text-gray-900'
                      }`}
                      placeholder="Шаг к цели"
                      value={step.text}
                      onChange={(e) => {
                        const newText = e.target.value;
                        setSteps((prevSteps) =>
                          prevSteps.map((s, i) =>
                            i === index ? { ...s, text: newText } : s
                          )
                        );
                      }}
                      onKeyDown={(e) => {
                        const inputElements = document.querySelectorAll(
                          'input[placeholder="Шаг к цели"]'
                        );

                        // if enter pressed create new step
                        if (e.key === 'Enter') {
                          e.preventDefault();

                          setSteps((prevSteps) => [
                            ...prevSteps.slice(0, index + 1),
                            { text: '', isDone: false },
                            ...prevSteps.slice(index + 1),
                          ]);

                          setTimeout(() => {
                            const nextInput = document.querySelectorAll(
                              'input[placeholder="Шаг к цели"]'
                            );

                            if (nextInput.length > index + 1) {
                              (
                                nextInput[index + 1] as HTMLInputElement
                              ).focus();
                            }
                          }, 50);
                        }

                        if (e.key === 'Backspace' && step.text === '') {
                          e.preventDefault();

                          setSteps((prevSteps) =>
                            prevSteps.filter((_, i) => i !== index)
                          );

                          setTimeout(() => {
                            const prevInput = document.querySelectorAll(
                              'input[placeholder="Шаг к цели"]'
                            );

                            if (prevInput.length > index) {
                              (prevInput[index] as HTMLInputElement).focus();
                            }
                          }, 50);
                        }
                      }}
                    />

                    <div className="flex items-center">
                      <button
                        className="ml-4 opacity-10 hover:opacity-100 hover:cursor-pointer"
                        onClick={() => {
                          setSteps((prevSteps) =>
                            prevSteps.filter((_, i) => i !== index)
                          );
                        }}
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
              ))}
          </ol>
          <div
            className={`flex items-center justify-start mt-2 ${
              progress !== 100 ? 'opacity-10' : ''
            }`}
          >
            <svg
              className={`w-8 h-8 text-gray-500 ${
                progress === 100 ? 'text-yellow-500' : ''
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
            <p className="ml-4 text-2xl font-bold text-gray-900">
              {progress === 0 && <>Сделайте первый шаг</>}
              {progress > 0 && progress < 40 && <>Супер! Продолжайте!</>}
              {progress >= 40 && progress < 70 && <>Вы отлично движетесь!</>}
              {progress >= 70 && progress < 100 && (
                <>Осталось совсем чуть-чуть</>
              )}
              {progress === 100 && <>Цель достигнута! Вы герой!</>}
            </p>
          </div>

          {progress === 100 && (
            <div className="mt-16">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => {
                  setSteps((prevSteps) => [{ text: '', isDone: false }]);
                  setName('');

                  setTimeout(() => {
                    const nameInput = document.querySelector(
                      'input[placeholder="Что делаем?"]'
                    ) as HTMLInputElement;
                    if (nameInput) {
                      nameInput.focus();
                    }
                  }, 50);
                }}
              >
                Поставить новую цель
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
