import React, { useState } from 'react';
import { X, Plus, CreditCard, Building, User, Hash, Eye, EyeOff } from 'lucide-react';
import { useLocalStorage } from '../../utils/helpers';
import { formatCurrency } from '../../utils/formatters/formatters';

const BankAccountManager = ({ isOpen, onClose, bankAccounts, setBankAccounts }) => {
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    initialBalance: '',
  });

  const [showAccountNumber, setShowAccountNumber] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.bankName || !formData.accountName || !formData.accountNumber) return;

    const newAccount = {
      id: `bank_${Date.now()}`, // Generate unique ID for the bank account
      name: formData.name,
      bankName: formData.bankName,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      initialBalance: parseFloat(formData.initialBalance) || 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBankAccounts(prev => [...prev, newAccount]);
    
    // Reset form
    setFormData({
      name: '',
      bankName: '',
      accountName: '',
      accountNumber: '',
      initialBalance: '',
    });
    
    // Close the modal
    onClose();
  };

  const handleDeleteAccount = (accountId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rekening ini? Transaksi terkait tidak akan dihapus.')) {
      setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Kelola Rekening Bank</h3>
              <p className="text-xs sm:text-sm text-gray-600">Tambah atau edit informasi rekening bank Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Add New Bank Account Form */}
          <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
            <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Tambah Rekening Baru</h4>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Rekening</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: Tabungan Utama, Kartu Kredit, dll"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: BCA, Mandiri, BNI, dll"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nama pada Rekening</label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Contoh: John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nomor Rekening</label>
                <div className="relative">
                  <input
                    type={showAccountNumber ? "text" : "password"}
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 text-sm"
                    placeholder="Nomor rekening"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccountNumber(!showAccountNumber)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-sm"
                  >
                    {showAccountNumber ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Saldo Awal (Opsional)</label>
                <input
                  type="text"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="0"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Rekening
              </button>
            </form>
          </div>

          {/* Existing Bank Accounts List */}
          {bankAccounts.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Daftar Rekening Bank</h4>
              <div className="space-y-2 sm:space-y-3">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{account.name}</h5>
                        <p className="text-xs sm:text-sm text-gray-600">{account.bankName}</p>
                        <p className="text-xs sm:text-sm text-gray-700 mt-1">a.n. {account.accountName}</p>
                        <p className="text-xs sm:text-sm text-gray-700">No. Rek: ****{account.accountNumber.slice(-4)}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus rekening"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankAccountManager;