import React from 'react';
import { Trash2, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { CleaningOption } from '../types';

interface CleanerOptionsProps {
  options: CleaningOption[];
  onToggle: (id: string) => void;
  isScanning: boolean;
}

const CleanerOptions: React.FC<CleanerOptionsProps> = ({ options, onToggle, isScanning }) => {
  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} ГБ`;
    }
    return `${sizeInMB.toLocaleString()} МБ`;
  };

  const getRiskLevel = (optionId: string) => {
    const highRisk = ['prefetch', 'update_cache', 'system_logs'];
    const mediumRisk = ['browser_cache', 'thumbnail_cache'];
    
    if (highRisk.includes(optionId)) return 'high';
    if (mediumRisk.includes(optionId)) return 'medium';
    return 'low';
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-error-500" />;
      case 'medium':
        return <Info className="w-4 h-4 text-warning-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-success-500" />;
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'Высокий риск';
      case 'medium':
        return 'Средний риск';
      default:
        return 'Безопасно';
    }
  };

  return (
    <div className="space-y-4">
      {options.map((option) => {
        const risk = getRiskLevel(option.id);
        
        return (
          <div
            key={option.id}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
              option.enabled
                ? 'border-primary-300 bg-gradient-to-r from-primary-50 to-primary-100'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
            onClick={() => onToggle(option.id)}
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  checked={option.enabled}
                  onChange={() => onToggle(option.id)}
                  className="checkbox-custom"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-slate-600" />
                    {option.name}
                  </h4>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs">
                      {getRiskIcon(risk)}
                      <span className={`font-medium ${
                        risk === 'high' ? 'text-error-600' :
                        risk === 'medium' ? 'text-warning-600' :
                        'text-success-600'
                      }`}>
                        {getRiskText(risk)}
                      </span>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isScanning
                        ? 'bg-slate-200 text-slate-500'
                        : option.size > 0
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isScanning ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                          Сканирование...
                        </div>
                      ) : (
                        formatSize(option.size)
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {option.description}
                </p>

                {risk === 'high' && (
                  <div className="mt-2 p-2 bg-error-50 border border-error-200 rounded-lg">
                    <p className="text-xs text-error-700">
                      ⚠️ Внимание: Эта операция может повлиять на производительность системы
                    </p>
                  </div>
                )}
              </div>
            </div>

            {option.enabled && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CleanerOptions;