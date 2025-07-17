// components/CopyButton.tsx
'use client';

import { useState } from 'react';

export default function CopyButton({
  textToCopy,
  children,
}: {
  textToCopy: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <button onClick={handleCopy} className="cursor-pointer" title="Скопировать">
      {children}
    </button>
  );
}
