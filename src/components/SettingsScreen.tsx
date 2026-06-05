import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { DifficultyLevel, MathDifficultyLevel } from '../domain/types';

interface Props {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: Props) {
  const gameMode = useGameStore((state) => state.gameMode);
  
  const difficulty = useGameStore((state) => state.difficulty);
  const setDifficulty = useGameStore((state) => state.setDifficulty);
  
  const mathDifficulty = useGameStore((state) => state.mathDifficulty);
  const setMathDifficulty = useGameStore((state) => state.setMathDifficulty);
  
  const lockedLevels = useGameStore((state) => state.lockedLevels);
  const toggleLevelLock = useGameStore((state) => state.toggleLevelLock);
  
  const [secretTaps, setSecretTaps] = useState(0);

  const isMathMode = gameMode === 'math';
  const optionType = isMathMode ? 'math' : 'build';

  // ARCHITECT FIX: Explicit full Tailwind class names to prevent PurgeCSS from deleting them.
  const buildOptions: { id: DifficultyLevel, label: string, selectedClass: string, hoverClass: string }[] = [
    { id: 'tens', label: 'עשרות', selectedClass: 'bg-blue-500 border-blue-600 text-white scale-105 shadow-md', hoverClass: 'hover:border-blue-300' },
    { id: 'hundreds', label: 'מאות', selectedClass: 'bg-red-500 border-red-600 text-white scale-105 shadow-md', hoverClass: 'hover:border-red-300' },
    { id: 'thousands', label: 'אלפים', selectedClass: 'bg-emerald-600 border-emerald-700 text-white scale-105 shadow-md', hoverClass: 'hover:border-emerald-300' },
  ];

  const mathOptions: { id: MathDifficultyLevel, label: string, selectedClass: string, hoverClass: string }[] = [
    { id: 'upTo10', label: 'עד 10', selectedClass: 'bg-purple-500 border-purple-600 text-white scale-105 shadow-md', hoverClass: 'hover:border-purple-300' },
    { id: 'upTo20', label: 'עד 20', selectedClass: 'bg-purple-500 border-purple-600 text-white scale-105 shadow-md', hoverClass: 'hover:border-purple-300' },
    { id: 'upTo100', label: 'עד 100', selectedClass: 'bg-purple-500 border-purple-600 text-white scale-105 shadow-md', hoverClass: 'hover:border-purple-300' },
    { id: 'upTo1000', label: 'עד 1000', selectedClass: 'bg-purple-500 border-purple-600 text-white scale-105 shadow-md', hoverClass: 'hover:border-purple-300' },
  ];

  const currentOptions = isMathMode ? mathOptions : buildOptions;
  const currentSelected = isMathMode ? mathDifficulty : difficulty;

  const handleSelect = (id: string) => {
    if (lockedLevels[id]) return;
    if (isMathMode) setMathDifficulty(id as MathDifficultyLevel);
    else setDifficulty(id as DifficultyLevel);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col font-sans select-none" dir="rtl">
      <div className="bg-white border-b-2 border-gray-100 p-4 flex justify-between items-center shrink-0 shadow-sm">
        <h2 
          onClick={() => setSecretTaps(prev => prev + 1)}
          className="text-2xl font-extrabold text-gray-800 transition-colors active:text-gray-400"
        >
          הגדרות קושי
        </h2>
        <button onClick={onClose} className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition-colors">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        
        {/* Contextual Developer Menu */}
        {secretTaps >= 5 && (
          <div className="w-full max-w-sm mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex flex-col items-center gap-2 animate-fade-in">
            <span className="text-red-700 font-bold text-lg">בקרת הורים סודית 🕵️‍♂️</span>
            <span className="text-xs text-red-500 mb-2 font-bold">לחצי כדי לנעול/לפתוח (חובה להשאיר רמה אחת)</span>
            
            <div className="flex flex-wrap gap-2 justify-center" dir="rtl">
               {currentOptions.map(opt => {
                 const isLocked = !!lockedLevels[opt.id];
                 return (
                   <button 
                     key={`dev-${opt.id}`} 
                     onClick={() => toggleLevelLock(opt.id, optionType)} 
                     className={`px-4 py-2 rounded-full font-bold text-sm text-white transition-all active:scale-95 shadow-sm ${isLocked ? 'bg-red-500' : 'bg-green-500'}`}
                   >
                     {opt.label} {isLocked ? '🔒' : '✅'}
                   </button>
                 );
               })}
            </div>
          </div>
        )}

        <div className="w-full max-w-sm flex flex-col gap-4 mt-4">
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold text-gray-500 mb-2">{isMathMode ? 'רמת תרגילים' : 'רמת המספרים'}</h3>
            <p className="text-sm text-gray-400">{isMathMode ? 'בחרו את גבול התוצאה לתרגילים' : 'בחרו אילו מספרים יופיעו במשחק'}</p>
          </div>

          {currentOptions.map(opt => {
            const isLocked = !!lockedLevels[opt.id];
            const isSelected = currentSelected === opt.id;
            
            // Apply styles based on precise pre-defined strings
            let styleClass = '';
            if (isLocked) {
              styleClass = 'bg-gray-100 border-gray-200 text-gray-400 opacity-60';
            } else if (isSelected) {
              styleClass = opt.selectedClass;
            } else {
              styleClass = `bg-white border-gray-200 text-gray-600 ${opt.hoverClass}`;
            }

            return (
              <button 
                key={opt.id}
                onClick={() => handleSelect(opt.id)} 
                disabled={isLocked}
                className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all border-4 flex justify-center items-center gap-2 ${styleClass}`}
              >
                {opt.label}
                {isLocked && <span className="text-xl">🔒</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}