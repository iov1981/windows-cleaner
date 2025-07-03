import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Shield className="w-10 h-10 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Windows Cleaner Pro
              </h1>
              <p className="text-primary-100 text-sm">
                Профессиональная очистка системы
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-primary-100">Версия</div>
              <div className="font-semibold">2.0.0</div>
            </div>
            <div className="w-px h-8 bg-primary-400"></div>
            <div className="text-right">
              <div className="text-sm text-primary-100">Статус</div>
              <div className="font-semibold text-green-300">Активна</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;