import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { MontessoriBlock } from './MontessoriBlock';

export function MathScreen() {
  const store = useGameStore();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => { setInputValue(''); }, [store.currentMathProblem]);

  const handleSubmit = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num)) store.checkMathAnswer(num);
  };

  if (!store.currentMathProblem) return null;
  const { num1, num2, operator } = store.currentMathProblem;

  return (
    <div className="h-full w-full pt-4 flex flex-col font-sans select-none bg-white overflow-hidden" dir="rtl">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full">
        
        {/* Header */}
        <div className="text-center pt-2 sm:pt-6 pb-2 shrink-0 px-4">
          <div dir="ltr" className="flex justify-center items-center gap-4 mb-4">
             <span className="text-6xl sm:text-8xl font-black text-gray-800">{num1}</span>
             <span className="text-4xl sm:text-6xl font-bold text-purple-500">{operator}</span>
             <span className="text-6xl sm:text-8xl font-black text-gray-800">{num2}</span>
             <span className="text-4xl sm:text-6xl font-bold text-purple-500">=</span>
             <span className="text-6xl sm:text-8xl font-black text-purple-200">?</span>
          </div>
          {store.interactionState === 'error' && store.feedbackMessage && (
            <div className="mt-1 p-2 sm:p-4 max-w-lg mx-auto bg-orange-100 text-orange-800 rounded-xl border border-orange-200 shadow-sm">
              <span className="font-bold text-sm sm:text-xl">{store.feedbackMessage}</span>
            </div>
          )}
          {store.interactionState === 'success' && store.feedbackMessage && (
            <div className="mt-1 p-2 sm:p-4 max-w-lg mx-auto bg-green-100 text-green-800 rounded-xl shadow-sm text-sm sm:text-2xl font-bold">
              {store.feedbackMessage}
            </div>
          )}
        </div>

        {/* Lifeline Area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 flex flex-col items-center">
          {!store.isLifelineUsed ? (
            <button onClick={store.useLifeline} className="mt-8 flex flex-col items-center gap-2 group">
              <div className="w-20 h-20 bg-blue-50 border-4 border-blue-200 rounded-3xl flex items-center justify-center text-4xl group-active:scale-90 transition-transform shadow-sm">
                🛟
              </div>
              <span className="text-blue-500 font-bold uppercase tracking-wide text-sm">גלגל הצלה</span>
            </button>
          ) : (
            <div className="w-full mt-4 flex justify-center">
              {operator === '+' && (
                <div dir="ltr" className="flex flex-row items-center justify-center gap-2 sm:gap-8 bg-blue-50/50 p-6 rounded-3xl border-2 border-blue-100 w-full">
                  <div className="bg-green-50/50 p-4 rounded-3xl border-2 border-green-100 flex flex-wrap gap-2 justify-center max-w-[42%]">
                    {store.placedBlocks.filter(b => b.groupId === 1).map((b, idx) => <MontessoriBlock key={`g1-${idx}`} id={b.id} type={b.type} />)}
                  </div>
                  <div className="text-4xl font-black text-purple-300 shrink-0">+</div>
                  <div className="bg-blue-50/50 p-4 rounded-3xl border-2 border-blue-100 flex flex-wrap gap-2 justify-center max-w-[42%]">
                    {store.placedBlocks.filter(b => b.groupId === 2).map((b, idx) => <MontessoriBlock key={`g2-${idx}`} id={b.id} type={b.type} />)}
                  </div>
                </div>
              )}

              {operator === '-' && (
                <div className="w-full flex flex-col items-center gap-4 bg-red-50/30 p-6 rounded-3xl border-2 border-red-100">
                  <div className="bg-white px-6 py-2 rounded-full border-2 border-red-200 text-red-600 font-bold shadow-sm animate-pulse">
                    החסירי {num2} קוביות (לחצי עליהן) 👇
                  </div>
                  <div dir="ltr" className="flex flex-row flex-wrap gap-2 justify-center">
                    {store.placedBlocks.map((b, idx) => (
                      <MontessoriBlock 
                        key={`sub-${idx}`} 
                        id={b.id} 
                        type={b.type} 
                        isGhosted={b.isGhosted}
                        onClick={() => store.toggleBlockGhostState(b.id)} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input & Actions Area */}
        <div className="shrink-0 bg-white border-t-2 border-gray-100 p-4 sm:p-6 z-20">
          <div className="max-w-sm mx-auto flex flex-col gap-3">
            <input 
              type="text" 
              inputMode="numeric" 
              pattern="[0-9]*" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              disabled={store.interactionState === 'success'} 
              placeholder="התשובה היא..." 
              className="w-full text-center text-4xl sm:text-4xl font-black text-purple-700 bg-purple-50 border-4 border-purple-300 rounded-2xl py-3 focus:outline-none" 
            />
            <button 
              onClick={handleSubmit} 
              disabled={!inputValue || store.interactionState === 'success'} 
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-2xl rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              בדוק אותי!
            </button>

            {/* Strict Economy Skip Button */}
            <div className="flex flex-col gap-1 mt-2">
              <button
                onClick={store.skipProblem}
                disabled={store.coinsCollected < 10 || store.interactionState === 'success'}
                className={`w-full py-3 rounded-2xl font-bold text-lg transition-all border-2 ${
                  store.coinsCollected >= 10 && store.interactionState !== 'success'
                    ? 'bg-orange-50 text-orange-700 border-orange-300 hover:bg-orange-100 active:scale-95 cursor-pointer'
                    : 'bg-gray-50 text-gray-400 border-gray-200 opacity-80 cursor-not-allowed'
                }`}
              >
                דלג על התרגיל (עולה 10 ⭐)
              </button>
              
              {store.coinsCollected < 10 && store.interactionState !== 'success' && (
                <span className="text-xs font-bold text-red-500 text-center px-2 animate-pulse mt-1">
                  אין מספיק כוכבים! שחקי במסכים אחרים כדי להרוויח עוד.
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}