import { MontessoriBlock } from './MontessoriBlock';

export function Toolbox() {
  return (
    <div className="w-full bg-gray-100 p-6 rounded-t-3xl shadow-inner border-t-4 border-gray-200 mt-8 flex justify-center gap-24 items-end">
      <div className="flex flex-col items-center gap-3">
        <MontessoriBlock id="source-ten" type="ten" isDraggable />
        <span className="text-lg font-bold text-gray-500">עשרות</span>
      </div>
      <div className="flex flex-col items-center gap-3">
        <MontessoriBlock id="source-unit" type="unit" isDraggable />
        <span className="text-lg font-bold text-gray-500">אחדות</span>
      </div>
    </div>
  );
}
