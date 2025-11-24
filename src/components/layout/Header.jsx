import React from 'react';
import {
  Wallet,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';

const Header = ({ onExportData, hideBalance, setHideBalance, setShowCashAccountModal, setShowTransferModal, setShowAddModal }) => {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 md:p-2 rounded-lg md:rounded-xl">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                MoneyTrack
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Kelola keuanganmu dengan mudah
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExportData}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Data"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {hideBalance ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setShowCashAccountModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Tambah Dompet Cash"
            >
              <Wallet className="w-5 h-5 text-green-600" />
            </button>
            <button
              onClick={() => setShowTransferModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Transfer Cash"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h6l-4 4M4 12m0-6l4 4m0 6h6l-4-4M4-4"
                />
              </svg>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg md:rounded-xl flex items-center space-x-2 hover:shadow-lg transition-all duration-200 active:scale-95 md:hover:scale-105"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m0 0h6m0 0v1M8 5l3 3h-3m0 0v1m-3-3h-3m0 0v1"
                />
              </svg>
              <span className="font-medium hidden md:block">Tambah</span>
              <span className="font-medium md:hidden">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
