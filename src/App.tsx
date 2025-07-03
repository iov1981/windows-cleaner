import React, { useState, useEffect } from 'react';
import { Trash2, HardDrive, Shield, Settings, CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react';
import CleanerOptions from './components/CleanerOptions';
import SystemInfo from './components/SystemInfo';
import CleaningProgress from './components/CleaningProgress';
import ResultsModal from './components/ResultsModal';
import Header from './components/Header';
import { CleaningOption, SystemStats, CleaningResult } from './types';

function App() {
  const [selectedOptions, setSelectedOptions] = useState<CleaningOption[]>([
    { id: 'temp_user', name: 'Временные файлы пользователя (%TEMP%)', enabled: true, size: 0, description: 'Очистка временных файлов текущего пользователя' },
    { id: 'temp_windows', name: 'Временные файлы Windows', enabled: true, size: 0, description: 'Очистка системных временных файлов' },
    { id: 'recycle_bin', name: 'Корзина', enabled: true, size: 0, description: 'Полная очистка корзины' },
    { id: 'prefetch', name: 'Папка Prefetch', enabled: false, size: 0, description: 'Очистка кэша предзагрузки приложений' },
    { id: 'update_cache', name: 'Кэш обновлений Windows', enabled: false, size: 0, description: 'Очистка загруженных файлов обновлений' },
    { id: 'browser_cache', name: 'Кэш браузеров', enabled: false, size: 0, description: 'Очистка кэша популярных браузеров' },
    { id: 'system_logs', name: 'Системные логи', enabled: false, size: 0, description: 'Очистка старых файлов журналов' },
    { id: 'thumbnail_cache', name: 'Кэш миниатюр', enabled: false, size: 0, description: 'Очистка кэша изображений проводника' }
  ]);

  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalSpace: 500000,
    freeSpace: 150000,
    usedSpace: 350000,
    tempSize: 2500,
    cacheSize: 1800,
    logsSize: 450
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [cleaningResults, setCleaningResults] = useState<CleaningResult[]>([]);
  const [scanProgress, setScanProgress] = useState(0);

  // Симуляция сканирования системы
  const scanSystem = async () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const scanSteps = [
      'Анализ временных файлов...',
      'Проверка кэша браузеров...',
      'Сканирование системных логов...',
      'Подсчет размера корзины...',
      'Анализ кэша обновлений...',
      'Завершение сканирования...'
    ];

    for (let i = 0; i < scanSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanProgress((i + 1) / scanSteps.length * 100);
    }

    // Обновляем размеры файлов
    setSelectedOptions(prev => prev.map(option => ({
      ...option,
      size: Math.floor(Math.random() * 5000) + 100
    })));

    setIsScanning(false);
  };

  // Симуляция процесса очистки
  const startCleaning = async () => {
    setIsCleaning(true);
    const enabledOptions = selectedOptions.filter(opt => opt.enabled);
    const results: CleaningResult[] = [];

    for (const option of enabledOptions) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const freedSpace = Math.floor(option.size * (0.7 + Math.random() * 0.3));
      results.push({
        name: option.name,
        freedSpace,
        status: Math.random() > 0.1 ? 'success' : 'warning',
        details: Math.random() > 0.1 ? 
          `Успешно очищено ${freedSpace} МБ` : 
          `Частично очищено ${freedSpace} МБ (некоторые файлы заблокированы)`
      });
    }

    setCleaningResults(results);
    setIsCleaning(false);
    setShowResults(true);

    // Обновляем статистику системы
    const totalFreed = results.reduce((sum, result) => sum + result.freedSpace, 0);
    setSystemStats(prev => ({
      ...prev,
      freeSpace: prev.freeSpace + totalFreed,
      usedSpace: prev.usedSpace - totalFreed
    }));
  };

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => 
      prev.map(opt => 
        opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
      )
    );
  };

  useEffect(() => {
    // Автоматическое сканирование при загрузке
    scanSystem();
  }, []);

  const totalSelectedSize = selectedOptions
    .filter(opt => opt.enabled)
    .reduce((sum, opt) => sum + opt.size, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Информация о системе */}
          <div className="lg:col-span-1">
            <SystemInfo 
              stats={systemStats}
              isScanning={isScanning}
              onRescan={scanSystem}
            />
          </div>

          {/* Правая колонка - Опции очистки */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <Settings className="w-7 h-7 text-primary-600" />
                  Параметры очистки
                </h2>
                
                {totalSelectedSize > 0 && (
                  <div className="bg-gradient-to-r from-primary-100 to-primary-200 px-4 py-2 rounded-xl">
                    <span className="text-primary-800 font-semibold">
                      К очистке: {totalSelectedSize.toLocaleString()} МБ
                    </span>
                  </div>
                )}
              </div>

              <CleanerOptions
                options={selectedOptions}
                onToggle={toggleOption}
                isScanning={isScanning}
              />

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={startCleaning}
                  disabled={isCleaning || isScanning || totalSelectedSize === 0}
                  className="btn-primary flex items-center justify-center gap-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isCleaning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Очистка в процессе<span className="loading-dots"></span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Начать очистку
                    </>
                  )}
                </button>

                <button
                  onClick={scanSystem}
                  disabled={isScanning || isCleaning}
                  className="btn-secondary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HardDrive className="w-5 h-5" />
                  Пересканировать
                </button>
              </div>

              {isScanning && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Сканирование системы</span>
                    <span className="text-sm font-medium text-slate-600">{Math.round(scanProgress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Прогресс очистки */}
        {isCleaning && (
          <div className="mt-8">
            <CleaningProgress 
              options={selectedOptions.filter(opt => opt.enabled)}
            />
          </div>
        )}

        {/* Модальное окно с результатами */}
        {showResults && (
          <ResultsModal
            results={cleaningResults}
            onClose={() => setShowResults(false)}
          />
        )}
      </main>
    </div>
  );
}

export default App;