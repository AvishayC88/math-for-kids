import { useGameStore } from '../store/useGameStore';
import { DifficultyLevel, MathDifficultyLevel } from '../domain/types';

interface Props {
  onClose: () => void;
}

export function SettingsScreen({ onClose }: Props) {
  const gameMode = useGameStore((state) => state.gameMode);
  
  // States for Build/Recognize
  const difficulty = useGameStore((state) => state.difficulty);
  const setDifficulty = useGameStore((state) => state.setDifficulty);
  
  // States for Math Mode
  const mathDifficulty = useGameStore((state) => state.mathDifficulty);
  const setMathDifficulty = useGameStore((state) => state.setMathDifficulty);

  const handleSelectBuild = (level: DifficultyLevel) => {
    setDifficulty(level);
    onClose();
  };

  const handleSelectMath = (level: MathDifficultyLevel) => {
    setMathDifficulty(level);
    onClose();
  };

  const isMathMode = gameMode === 'math';

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] flex flex-col font-sans select-none" dir="rtl">
      <div className="bg-white border-b-2 border-gray-100 p-4 flex justify-between items-center shrink-0 shadow-sm">
        <h2 className="text-2xl font-extrabold text-gray-800">הגדרות קושי</h2>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-bold text-xl hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-sm flex flex-col gap-4 mt-4">
          
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              {isMathMode ? 'רמת תרגילים' : 'רמת המספרים'}
            </h3>
            <p className="text-sm text-gray-400">
              {isMathMode ? 'בחרי את גבול התוצאה לתרגילים' : 'בחרי אילו מספרים יופיעו במשחק'}
            </p>
          </div>

          {!isMathMode ? (
            // Classical Build/Recognize Settings
            <>
              <button onClick={() => handleSelectBuild('tens')} className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${difficulty === 'tens' ? 'bg-blue-500 border-blue-600 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}>עשרות</button>
              <button onClick={() => handleSelectBuild('hundreds')} className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${difficulty === 'hundreds' ? 'bg-red-500 border-red-600 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-red-300'}`}>מאות</button>
              <button onClick={() => handleSelectBuild('thousands')} className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${difficulty === 'thousands' ? 'bg-emerald-600 border-emerald-700 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}`}>אלפים</button>
            </>
          ) : (
            // New Math Settings
            <>
              <button onClick={() => handleSelectMath('upTo10')} className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${mathDifficulty === 'upTo10' ? 'bg-purple-500 border-purple-600 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'}`}>עד 10</button>
              <button onClick={() => handleSelectMath('upTo20')} className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${mathDifficulty === 'upTo20' ? 'bg-purple-500 border-purple-600 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'}`}>עד 20</button>
              <button onClick={() => handleSelectMath('upTo100')} className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${mathDifficulty === 'upTo100' ? 'bg-purple-500 border-purple-600 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'}`}>עד 100</button>
              <button onClick={() => handleSelectMath('upTo1000')} className={`w-full py-4 rounded-2xl font-bold text-2xl transition-all shadow-sm border-4 ${mathDifficulty === 'upTo1000' ? 'bg-purple-500 border-purple-600 text-white scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'}`}>עד 1000</button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}