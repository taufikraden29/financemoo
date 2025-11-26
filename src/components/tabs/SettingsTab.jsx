import React from 'react';
import TelegramSettings from '../features/telegram/TelegramSettings';

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Aplikasi</h2>
        <p className="text-gray-600">Atur preferensi dan integrasi aplikasi Anda</p>
      </div>

      <TelegramSettings />
    </div>
  );
};

