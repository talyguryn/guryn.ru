'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsPopupVisible(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
      <button onClick={() => setIsPopupVisible(true)}>Click me</button>
      {isPopupVisible && (
        <div>
          <h1>Popup</h1>
          <p>Press ESC to close</p>
        </div>
      )}
    </>
  );
}
