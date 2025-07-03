import React from 'react';
import { HardDrive, Cpu, MemoryStick, RefreshCw } from 'lucide-react';
import { SystemStats } from '../types';

interface SystemInfoProps {
  stats: SystemStats;
  isScanning: boolean;
  onRescan: () => void;
}

const SystemInfo: React.FC<SystemInfoProps> = ({ stats, isScanning, onRescan }) => {
  const usagePercentage = (stats.usedSpace / stats.totalSpace) * 100;
  
  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} ГБ`;
    }
    return `${sizeInMB.toLocaleString()} МБ`;
  };

  return (
    <div className="space-y-6">
      {/* Основная информация о диске */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-primary-600" />
            Диск C:
          </h3>
          <button
            onClick={onRescan}
            disabled={isScanning}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-slate-600 ${isScanning ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Использовано</span>
              <span>{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  usagePercentage > 90 ? 'bg-gradient-to-r from-error-500 to-error-600' :
                  usagePercentage > 75 ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
                  'bg-gradient-to-r from-success-500 to-success-600'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-slate-600">Общий объем</div>
              <div className="font-semibold text-slate-800">{formatSize(stats.totalSpace)}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-slate-600">Свободно</div>
              <div className="font-semibold text-success-600">{formatSize(stats.freeSpace)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика временных файлов */}
      <div className="card">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary-600" />
          Анализ системы
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <span className="text-slate-700">Временные файлы</span>
            <span className="font-semibold text-blue-700">{formatSize(stats.tempSize)}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <span className="text-slate-700">Кэш системы</span>
            <span className="font-semibold text-purple-700">{formatSize(stats.cacheSize)}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <span className="text-slate-700">Файлы логов</span>
            <span className="font-semibold text-orange-700">{formatSize(stats.logsSize)}</span>
          </div>
        </div>
      </div>

      {/* Рекомендации */}
      <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
        <h3 className="text-lg font-bold text-primary-800 mb-3 flex items-center gap-2">
          <MemoryStick className="w-5 h-5" />
          Рекомендации
        </h3>
        
        <div className="space-y-2 text-sm text-primary-700">
          {usagePercentage > 90 && (
            <div className="flex items-center gap-2 p-2 bg-error-100 rounded-lg">
              <div className="w-2 h-2 bg-error-500 rounded-full"></div>
              <span>Критически мало места на диске</span>
            </div>
          )}
          
          {stats.tempSize > 1000 && (
            <div className="flex items-center gap-2 p-2 bg-warning-100 rounded-lg">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              <span>Много временных файлов</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 p-2 bg-success-100 rounded-lg">
            <div className="w-2 h-2 bg-success-500 rounded-full"></div>
            <span>Регулярная очистка рекомендуется</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;