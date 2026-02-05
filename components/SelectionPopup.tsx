
import React, { useState, useEffect, useRef } from 'react';

interface SelectionPopupProps {
  onSearch: (text: string) => void;
}

const SelectionPopup: React.FC<SelectionPopupProps> = ({ onSearch }) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // Small delay to let selection update
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim();

        if (text && text.length > 1) {
          const range = selection?.getRangeAt(0);
          const rect = range?.getBoundingClientRect();

          if (rect) {
            setPosition({
              x: rect.left + rect.width / 2 + window.scrollX,
              y: rect.top + window.scrollY - 50,
            });
            setSelectedText(text);
          }
        } else {
          // Check if we clicked outside the popup
          if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
            setPosition(null);
          }
        }
      }, 10);
    };

    const handleMouseDown = (e: MouseEvent) => {
      // If we didn't click the popup, hide it
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPosition(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedText);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDictionary = () => {
    onSearch(selectedText);
    setPosition(null);
  };

  if (!position) return null;

  return (
    <div
      ref={popupRef}
      className="fixed z-[9999] flex gap-1 bg-slate-900 text-white p-1 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)',
      }}
    >
      <button
        onClick={handleDictionary}
        className="w-10 h-10 flex items-center justify-center hover:bg-blue-600 rounded-lg transition-colors group"
        title="Lookup Term"
      >
        <i className="fa-solid fa-book-medical group-hover:scale-110 transition-transform"></i>
      </button>
      <div className="w-px h-6 bg-slate-700 self-center"></div>
      <button
        onClick={handleSpeak}
        className="w-10 h-10 flex items-center justify-center hover:bg-orange-500 rounded-lg transition-colors group"
        title="Speak Text"
      >
        <i className="fa-solid fa-volume-high group-hover:scale-110 transition-transform"></i>
      </button>
    </div>
  );
};

export default SelectionPopup;
