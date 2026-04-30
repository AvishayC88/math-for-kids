import { useGameStore } from '../store/useGameStore';
import { DifficultyLevel } from '../domain/types';

interface Props {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: Props) {
  const difficulty = useGameStore((state) => state.difficulty);
  const setDifficulty = useGameStore((state) => state.setDifficulty);

  const handleSelect = (level: DifficultyLevel) => {
    setDifficulty(level);
    onClose();
  };

  return (
    // ARCHITECT NOTE: z-[100] guarantees it overlays everything including the App shell navbar
    <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col font-sans select-none" dir="rtl">
      
      <div className="bg-white border-b-2 border-gray-100 p-4 flex justify-between items-center shrink-0 shadow-sm">
        <h2 className="text-2xl font-extrabold text-gray-800">הגדרות משחק</h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-sm flex flex-col gap-6 mt-8">
          
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-500 mb-2">רמת קושי</h3>
            <p className="text-sm text-gray-400">בחרי אילו מספרים יופיעו במשחקים</p>
          </div>

          <button
            onClick={() => handleSelect('tens')}
            className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${
              difficulty === 'tens' 
                ? 'bg-blue-500 border-blue-600 text-white scale-105' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
            }`}
          >
            עשרות
          </button>

          <button
            onClick={() => handleSelect('hundreds')}
            className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${
              difficulty === 'hundreds' 
                ? 'bg-red-500 border-red-600 text-white scale-105' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'
            }`}
          >
            מאות
          </button>

          <button
            onClick={() => handleSelect('thousands')}
            className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${
              difficulty === 'thousands' 
                ? 'bg-emerald-600 border-emerald-700 text-white scale-105' 
                : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
            }`}
          >
            אלפים
          </button>

        </div>
      </div>
    </div>
  );
}