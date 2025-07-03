import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { CleaningOption } from '../types';

interface CleaningProgressProps {
  options: CleaningOption[];
}

const CleaningProgress: React.FC<CleaningProgressProps> = ({ options }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentIndex < options.length) {
      const timer = setTimeout(() => {
        setCompletedItems(prev => new Set([...prev, currentIndex]));
        setCurrentIndex(prev => prev + 1);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, options.length]);

  const progress = (completedItems.size / options.length) * 100;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Процесс очистки</h3>
        <div className="text-sm text-slate-600">
          {completedItems.size} из {options.length} завершено
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 mb-2">
          <span>Общий прогресс</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isCompleted = completedItems.has(index);
          const isCurrent = index === currentIndex && !isCompleted;
          const isPending = index > currentIndex;

          return (
            <div
              key={option.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-success-50 to-success-100 border border-success-200'
                  : isCurrent
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200'
                  : 'bg-slate-50 border border-slate-200'
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-success-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                ) : (
                  <div className="w-6 h-6 border-2 border-slate-300 rounded-full" />
                )}
              </div>

              <div className="flex-1">
                <div className="font-medium text-slate-800">{option.name}</div>
                <div className="text-sm text-slate-600">
                  {isCompleted
                    ? `Очищено ${option.size.toLocaleString()} МБ`
                    : isCurrent
                    ? 'Очистка в процессе...'
                    : `${option.size.toLocaleString()} МБ к очистке`
                  }
                </div>
              </div>

              {isCurrent && (
                <div className="flex-shrink-0">
                  <div className="animate-pulse text-primary-600 text-sm font-medium">
                    Обработка...
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CleaningProgress;