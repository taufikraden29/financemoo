import React, { useState } from 'react';
import { X, ArrowRightLeft, Wallet, CreditCard, Banknote } from 'lucide-react';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from '../../utils/formatters/formatters';

const TransferModal = ({
  isOpen,
  onClose,
  onSubmit,
  cashBalance = 0,
  digitalBalance = 0,
  bankAccountBalances = [], // Updated to use bank account balances
  transactions = [] // Need to pass transactions to calculate bank account balances
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    from: 'cash',
    to: bankAccountBalances.length > 0 ? bankAccountBalances[0].id : 'digital',
    description: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || formData.from === formData.to) return;

    const transfer = {
      amount: parseFloat(formData.amount),
      from: formData.from,
      to: formData.to,
      description: formData.description,
      timestamp: new Date().toISOString(),
    };

    onSubmit(transfer);
    setFormData({
      amount: '',
      from: 'cash',
      to: bankAccounts.length > 0 ? bankAccounts[0].id : 'digital',
      description: ''
    });
    onClose();
  };

  // Calculate balances for the account types
  const getBalance = (accountType) => {
    if (accountType === 'cash') return cashBalance;
    if (accountType === 'digital') return digitalBalance;

    // For bank accounts, find the account and return its balance from the bankAccountBalances array
    const bankAccount = bankAccountBalances.find(acc => acc.id === accountType);
    return bankAccount ? bankAccount.balance : 0;
  };

  const fromBalance = getBalance(formData.from);
  const toBalance = getBalance(formData.to);

  // Get account display name
  const getAccountName = (accountType) => {
    if (accountType === 'cash') return 'Tunai';
    if (accountType === 'digital') return 'Digital';

    const bankAccount = bankAccountBalances.find(acc => acc.id === accountType);
    return bankAccount ? bankAccount.name : accountType;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Transfer Saldo</h3>
              <p className="text-sm text-gray-600">Pindahkan saldo antar akun</p>
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
          {/* Current Balances - Updated to show all accounts */}
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-green-50 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-green-600" />
                <span className="text-xs sm:text-sm text-green-700">Tunai</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-green-900">{formatCurrency(cashBalance)}</span>
            </div>

            {bankAccountBalances.map(account => {
              const accountBalance = getBalance(account.id);
              return (
                <div key={account.id} className="flex justify-between items-center bg-blue-50 rounded-lg p-2 sm:p-3">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-blue-600" />
                    <span className="text-xs sm:text-sm text-blue-700">{account.name}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-blue-900">{formatCurrency(accountBalance)}</span>
                </div>
              );
            })}
          </div>

          {/* From Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dari Akun</label>
            <select
              value={formData.from}
              onChange={(e) => setFormData({
                ...formData,
                from: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="cash">Tunai</option>
              <option value="digital">Digital</option>
              {bankAccountBalances.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* To Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ke Akun</label>
            <select
              value={formData.to}
              onChange={(e) => setFormData({
                ...formData,
                to: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="cash">Tunai</option>
              <option value="digital">Digital</option>
              {bankAccountBalances.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Transfer</label>
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
                max={fromBalance}
                required
              />
            </div>
            {formData.amount && parseFloat(formData.amount) > fromBalance && (
              <p className="text-red-600 text-xs sm:text-sm mt-1">Saldo tidak mencukupi!</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Contoh: Transfer antar bank, isi e-wallet, dll..."
            />
          </div>

          {/* Transfer Preview */}
          {formData.amount && parseFloat(formData.amount) <= fromBalance && formData.from !== formData.to && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-700 mb-2">Transfer Preview</p>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-gray-600">
                  {getAccountName(formData.from)} → {getAccountName(formData.to)}
                </p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(parseFloat(formData.amount) || 0)}
                </p>
                <div className="text-xs sm:text-sm text-gray-600">
                  <p>Saldo {getAccountName(formData.from)} setelah: {formatCurrency(fromBalance - (parseFloat(formData.amount) || 0))}</p>
                  <p>Saldo {getAccountName(formData.to)} setelah: {formatCurrency(toBalance + (parseFloat(formData.amount) || 0))}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!formData.amount || parseFloat(formData.amount) > fromBalance || formData.from === formData.to}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Transfer Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;
