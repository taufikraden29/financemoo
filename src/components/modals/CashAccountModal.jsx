import React, { useState } from 'react';
import { X, Wallet, Plus, Minus, Banknote } from 'lucide-react';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from '../../utils/formatters/formatters';

const CashAccountModal = ({ isOpen, onClose, onSubmit, currentBalance = 0, bankAccounts = [] }) => {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'add', // add or subtract
    description: '',
    accountType: 'cash', // cash or bank
    selectedBankAccount: bankAccounts.length > 0 ? bankAccounts[0].id : 'default', // Default to first bank account or 'default'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount) return;

    const transaction = {
      amount: parseFloat(formData.amount),
      type: formData.type,
      description: formData.description,
      accountType: formData.accountType, // cash or bank
      ...(formData.accountType === 'bank' && { bankAccountId: formData.selectedBankAccount }),
      timestamp: new Date().toISOString(),
    };

    onSubmit(transaction);
    setFormData({
      amount: '',
      type: 'add',
      description: '',
      accountType: 'cash',
      selectedBankAccount: bankAccounts.length > 0 ? bankAccounts[0].id : 'default'
    });
    onClose();
  };

  // Calculate new balance based on account type
  let newBalance = currentBalance;
  if (formData.amount) {
    if (formData.type === 'add') {
      newBalance = currentBalance + parseFloat(formData.amount);
    } else {
      newBalance = currentBalance - parseFloat(formData.amount);
    }
  }

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Kelola Saldo</h3>
              <p className="text-sm text-gray-600">Tambah atau kurangi saldo tunai atau rekening bank</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* Account Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Akun</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: 'cash' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  formData.accountType === 'cash'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Wallet className="w-4 h-4" />
                Tunai
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, accountType: 'bank' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  formData.accountType === 'bank'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Banknote className="w-4 h-4" />
                Bank
              </button>
            </div>
          </div>

          {/* Bank Account Selection (only shown when account type is bank) */}
          {formData.accountType === 'bank' && bankAccounts.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Rekening</label>
              <select
                value={formData.selectedBankAccount}
                onChange={(e) => setFormData({ ...formData, selectedBankAccount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Current Balance - Update label based on account type */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              {formData.accountType === 'cash' ? 'Saldo Tunai Saat Ini' : 'Saldo Rekening Saat Ini'}
            </p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(currentBalance)}</p>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'add' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  formData.type === 'add'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Plus className="w-4 h-4" />
                {formData.accountType === 'cash' ? 'Tambah' : 'Setor'}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'subtract' })}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                  formData.type === 'subtract'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Minus className="w-4 h-4" />
                {formData.accountType === 'cash' ? 'Kurangi' : 'Tarik'}
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Rp</span>
              <input
                type="text"
                value={formData.amount ? formatCurrencyInput(formData.amount) : ''}
                onChange={(e) => {
                  const numericValue = parseCurrencyInput(e.target.value);
                  setFormData({ ...formData, amount: numericValue });
                }}
                onFocus={(e) => {
                  const numericValue = parseCurrencyInput(e.target.value);
                  if (numericValue) {
                    e.target.value = numericValue.toString();
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    e.target.value = formatCurrencyInput(e.target.value);
                  }
                }}
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Contoh: Tarik ATM, Setor tunai, dll..."
            />
          </div>

          {/* New Balance Preview */}
          {formData.amount && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-700 mb-1">Saldo Setelah Transaksi</p>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(newBalance)}</p>
              <p className="text-xs text-blue-600 mt-1">
                {formData.type === 'add' ? '+' : '-'}{formatCurrency(parseFloat(formData.amount) || 0)}
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all text-sm"
          >
            {formData.type === 'add'
              ? (formData.accountType === 'cash' ? 'Tambah Tunai' : 'Setor ke Rekening')
              : (formData.accountType === 'cash' ? 'Kurangi Tunai' : 'Tarik dari Rekening')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CashAccountModal;
