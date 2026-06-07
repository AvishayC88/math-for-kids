import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { MontessoriBlock } from './MontessoriBlock';

export function RecognizeScreen() {
  const store = useGameStore();
  const [inputValue, setInputValue] = useState('');

  // Clear input when the target number changes (new round)
  useEffect(() => {
    setInputValue('');
  }, [store.currentTargetNumber]);

  const handleSubmit = () => {
    const num = parseInt(inputValue, 10);
    if (!isNaN(num)) {
      store.checkRecognizeAnswer(num);
    }
  };

  const unitsBlocks = store.placedBlocks.filter(b => b.type === 'unit');
  const tensBlocks = store.placedBlocks.filter(b => b.type === 'ten');
  const hundredsBlocks = store.placedBlocks.filter(b => b.type === 'hundred');
  const thousandsBlocks = store.placedBlocks.filter(b => b.type === 'thousand');

  return (
    // ARCHITECT NOTE: Replaced fixed inset-0 with h-full w-full.
    // This allows the screen to sit properly underneath the App.tsx navbar.
    <div className="h-full w-full pt-4 flex flex-col font-sans select-none bg-white overflow-hidden" dir="rtl">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full">
        
        {/* Layer 1: Header - Strictly Fixed */}
        <div className="text-center pt-2 sm:pt-4 pb-2 shrink-0 px-4">
          <h1 className="text-2xl sm:text-5xl font-extrabold text-gray-800 mb-2">
            איזה מספר כתוב כאן?
          </h1>
          
          {store.interactionState === 'error' && store.feedbackMessage && (
            <div className="mt-1 p-2 sm:p-4 max-w-lg mx-auto bg-orange-100 text-orange-800 rounded-xl border border-orange-200 shadow-sm animate-bounce">
              <span className="font-bold text-sm sm:text-xl">{store.feedbackMessage}</span>
            </div>
          )}

          {store.interactionState === 'success' && (
            <div className="mt-1 p-2 sm:p-4 max-w-lg mx-auto bg-green-100 text-green-800 rounded-xl shadow-sm text-sm sm:text-2xl font-bold">
              {store.feedbackMessage}
            </div>
          )}
        </div>

        {/* Layer 2: Blocks Area - The ONLY scrollable region */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 pb-4">
          
          <div 
            dir="ltr" 
            className="w-full flex flex-row gap-2 sm:gap-6 justify-center items-end bg-gray-50 p-4 sm:p-6 rounded-3xl border-2 border-gray-100 min-h-[150px]"
          >
            {/* ARCHITECT NOTE: Using flex-col-reverse and flex-wrap-reverse ensures that the "incomplete" 
                rows or blocks are always placed at the top, mimicking physical building blocks. */}
            
            {thousandsBlocks.length > 0 && (
              <div className="flex flex-col-reverse gap-2 items-center">
                {thousandsBlocks.map(b => <MontessoriBlock key={b.id} id={b.id} type="thousand" />)}
              </div>
            )}
            
            {hundredsBlocks.length > 0 && (
              <div className="flex flex-col-reverse gap-2 items-center">
                {hundredsBlocks.map(b => <MontessoriBlock key={b.id} id={b.id} type="hundred" />)}
              </div>
            )}
            
            {tensBlocks.length > 0 && (
              <div className="flex flex-row flex-wrap-reverse gap-1 justify-center content-start w-20 sm:w-28">
                {tensBlocks.map(b => <MontessoriBlock key={b.id} id={b.id} type="ten" />)}
              </div>
            )}
            
            {unitsBlocks.length > 0 && (
              <div className="flex flex-row flex-wrap-reverse gap-1 justify-center content-start w-16 sm:w-24">
                {unitsBlocks.map(b => <MontessoriBlock key={b.id} id={b.id} type="unit" />)}
              </div>
            )}
          </div>
        </div>

        {/* Layer 3: Input Area - Fixed at the bottom, elevated above scroll */}
        <div className="shrink-0 bg-white border-t-2 border-gray-100 p-4 sm:p-6 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
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
              className="w-full py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-xl sm:text-2xl rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              בדוק אותי!
            </button>
            {/* ARCHITECT ADDITION: Strict Economy Skip Button */}
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
                דלגו על השלב (עולה 10 ⭐)
              </button>
              
              {store.coinsCollected < 10 && store.interactionState !== 'success' && (
                <span className="text-xs font-bold text-red-500 text-center px-2 animate-pulse mt-1">
                  אין מספיק כוכבים! שחקו במסכים אחרים כדי להרוויח עוד.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}