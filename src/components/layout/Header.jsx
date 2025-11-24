import React from 'react';
import {
  Wallet,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';

const Header = ({ onExportData, hideBalance, setHideBalance, setShowCashAccountModal, setShowTransferModal, setShowAddModal, setShowBankAccountManager }) => {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg">
              <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                MoneyPro
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden md:block">
                Kelola keuanganmu dengan mudah
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={onExportData}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Data"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sembunyikan Saldo"
            >
              {hideBalance ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setShowBankAccountManager(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Kelola Rekening Bank"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600">
                <rect width="20" height="15" x="2" y="7" rx="2" ry="2"></rect>
                <path d="M16 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3"></path>
                <path d="M8 11h7"></path>
                <path d="M8 15h5"></path>
              </svg>
            </button>
            <button
              onClick={() => setShowCashAccountModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Tambah Dompet Cash"
            >
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </button>
            <button
              onClick={() => setShowTransferModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Transfer Antar Dompet"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
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
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg flex items-center space-x-1 sm:space-x-2 hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
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
              <span className="font-medium hidden sm:block text-sm">Tambah</span>
              <span className="font-medium sm:hidden text-sm">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
