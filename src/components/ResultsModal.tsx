import React from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Download, Share2 } from 'lucide-react';
import { CleaningResult } from '../types';

interface ResultsModalProps {
  results: CleaningResult[];
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ results, onClose }) => {
  const totalFreed = results.reduce((sum, result) => sum + result.freedSpace, 0);
  const successCount = results.filter(r => r.status === 'success').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(1)} ГБ`;
    }
    return `${sizeInMB.toLocaleString()} МБ`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-error-600" />;
      default:
        return null;
    }
  };

  const generateReport = () => {
    const report = `
Отчет об очистке Windows Cleaner Pro
=====================================
Дата: ${new Date().toLocaleString('ru-RU')}

Общие результаты:
- Всего освобождено: ${formatSize(totalFreed)}
- Успешно: ${successCount} операций
- С предупреждениями: ${warningCount} операций
- Ошибки: ${errorCount} операций

Детальные результаты:
${results.map(result => `
- ${result.name}
  Статус: ${result.status === 'success' ? 'Успешно' : result.status === 'warning' ? 'Предупреждение' : 'Ошибка'}
  Освобождено: ${formatSize(result.freedSpace)}
  Детали: ${result.details}
`).join('')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaner-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-success-500 to-success-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Очистка завершена!</h2>
              <p className="text-success-100 mt-1">
                Освобождено {formatSize(totalFreed)} дискового пространства
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="p-6 border-b border-slate-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-success-50 rounded-xl">
              <div className="text-2xl font-bold text-success-600">{successCount}</div>
              <div className="text-sm text-success-700">Успешно</div>
            </div>
            <div className="text-center p-4 bg-warning-50 rounded-xl">
              <div className="text-2xl font-bold text-warning-600">{warningCount}</div>
              <div className="text-sm text-warning-700">Предупреждения</div>
            </div>
            <div className="text-center p-4 bg-error-50 rounded-xl">
              <div className="text-2xl font-bold text-error-600">{errorCount}</div>
              <div className="text-sm text-error-700">Ошибки</div>
            </div>
          </div>
        </div>

        {/* Результаты */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Детальные результаты</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 ${
                  result.status === 'success'
                    ? 'border-success-200 bg-success-50'
                    : result.status === 'warning'
                    ? 'border-warning-200 bg-warning-50'
                    : 'border-error-200 bg-error-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{result.name}</div>
                    <div className="text-sm text-slate-600 mt-1">{result.details}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">
                      {formatSize(result.freedSpace)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Действия */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generateReport}
              className="btn-secondary flex items-center justify-center gap-2 flex-1"
            >
              <Download className="w-4 h-4" />
              Скачать отчет
            </button>
            <button
              onClick={onClose}
              className="btn-primary flex items-center justify-center gap-2 flex-1"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;