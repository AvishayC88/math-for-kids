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
    // ARCHITECT NOTE: Replaced h-[100dvh] with fixed inset-0 for bulletproof mobile viewport locking.
    <div className="fixed inset-0 flex flex-col font-sans select-none bg-white overflow-hidden" dir="rtl">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full">
        
        {/* Layer 1: Header - Strictly Fixed */}
        <div className="text-center pt-4 sm:pt-6 pb-2 shrink-0 px-4">
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
              אלופה! אספת עוד 10 מטבעות! (סה"כ: {store.coinsCollected})
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
        {/* ARCHITECT NOTE: Removed aggressive padding bottom to prevent button clipping */}
        <div className="shrink-0 bg-white border-t-2 border-gray-100 p-4 sm:p-6 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <div className="max-w-sm mx-auto flex flex-col gap-3">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={store.interactionState === 'success'}
              placeholder="הקלידי כאן..."
              className="w-full text-center text-4xl sm:text-5xl font-black text-purple-700 bg-purple-50 border-4 border-purple-300 rounded-2xl py-3 focus:outline-none focus:border-purple-600 focus:ring-4 ring-purple-200 transition-all placeholder:text-purple-300 placeholder:text-2xl"
            />
            
            <button 
              onClick={handleSubmit}
              disabled={!inputValue || store.interactionState === 'success'}
              className="w-full py-3 sm:py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold text-xl sm:text-2xl rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              בדוק אותי!
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}