'use client';

import { useEffect, useState } from 'react';

/** Step state for a scripted diagram. Never starts on its own; playing stops at the last step. */
export const useStepper = (length: number, interval = 2600) => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const atEnd = step >= length - 1;
  const isPlaying = playing && !atEnd;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => setStep((value) => Math.min(value + 1, length - 1)), interval);
    return () => clearTimeout(timer);
  }, [isPlaying, step, length, interval]);

  return {
    step,
    playing: isPlaying,
    atEnd,
    goTo: (value: number) => {
      setPlaying(false);
      setStep(Math.max(0, Math.min(value, length - 1)));
    },
    prev: () => {
      setPlaying(false);
      setStep((value) => Math.max(0, value - 1));
    },
    next: () => {
      setPlaying(false);
      setStep((value) => Math.min(length - 1, value + 1));
    },
    toggle: () => {
      if (atEnd) {
        setStep(0);
        setPlaying(true);
      } else setPlaying((value) => !value);
    },
    reset: () => {
      setPlaying(false);
      setStep(0);
    },
  };
};

export type Stepper = ReturnType<typeof useStepper>;
