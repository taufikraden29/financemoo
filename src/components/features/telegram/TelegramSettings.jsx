import React, { useState, useEffect } from 'react';
import { Settings, Wifi, WifiOff, Send } from 'lucide-react';
import { sendTelegramNotification } from '../../hooks/business/useTransactions';

const TelegramSettings = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [isLoading, setIsLoading] = useState(false);

  // Check connection status when component mounts
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = () => {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      // Try to get bot info to verify connection
      fetch(`https://api.telegram.org/bot${botToken}/getMe`)
        .then(response => response.json())
        .then(data => {
          if (data.ok) {
            setIsConnected(true);
            setConnectionStatus('Connected');
          } else {
            setIsConnected(false);
            setConnectionStatus('Connection failed');
          }
        })
        .catch(error => {
          console.error('Error checking Telegram connection:', error);
          setIsConnected(false);
          setConnectionStatus('Connection error');
        });
    } else {
      setIsConnected(false);
      setConnectionStatus('Not configured');
    }
  };

  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      await sendTelegramNotification('test', {
        message: 'Test notification from MoneyPro app',
        timestamp: new Date().toISOString()
      });
      setConnectionStatus('Test message sent successfully!');
      setTimeout(() => {
        checkConnectionStatus(); // Reset status after a moment
      }, 3000);
    } catch (error) {
      console.error('Error sending test notification:', error);
      setConnectionStatus('Failed to send test message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Settings className="w-5 h-5 text-blue-60" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Pengaturan Telegram Bot</h3>
          <p className="text-sm text-gray-600">Kelola integrasi notifikasi ke Telegram</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="font-medium">Status Koneksi</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-70'
          }`}>
            {connectionStatus}
          </span>
        </div>

        {/* Test Button */}
        <button
          onClick={handleTestNotification}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isConnected
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Mengirim...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kirim Notifikasi Uji
            </>
          )}
        </button>

        {/* Configuration Info */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Informasi Konfigurasi</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Bot Token: {import.meta.env.VITE_TELEGRAM_BOT_TOKEN ? 'Sudah diatur' : 'Belum diatur'}</li>
            <li>• Chat ID: {import.meta.env.VITE_TELEGRAM_CHAT_ID ? 'Sudah diatur' : 'Belum diatur'}</li>
          </ul>
          <p className="text-xs text-blue-700 mt-2">
            Pastikan .env file telah diupdate dengan token dan chat ID yang benar.
          </p>
        </div>
      </div>
    </div>
  );
};

