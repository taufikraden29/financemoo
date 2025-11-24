import React, { useState } from 'react';
import { X, Repeat, Calendar } from 'lucide-react';
import { CATEGORIES, FREQUENCY_OPTIONS } from '../../constants/categories';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from '../../utils/formatters/formatters';

const AddRecurringModal = ({ isOpen, onClose, onSubmit, transactionType, setTransactionType, bankAccounts = [] }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    paymentMethod: 'cash',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.frequency) return;

    const recurringTransaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate,
      paymentMethod: formData.paymentMethod,
      isActive: true,
      createdDate: new Date().toISOString(),
      lastProcessed: null,
    };

    onSubmit(recurringTransaction);
    setFormData({
      amount: '',
      category: '',
      description: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      paymentMethod: 'cash',
    });
    onClose();
  };

  const categories = transactionType === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Repeat className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Transaksi Berulang</h3>
              <p className="text-sm text-gray-600">Tambah transaksi otomatis berulang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Transaction Type Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
                transactionType === 'income'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pemasukan
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all ${
                transactionType === 'expense'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah {transactionType === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
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
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frekuensi</label>
            <div className="grid grid-cols-2 gap-2">
              {FREQUENCY_OPTIONS.map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, frequency: freq.value })}
                  className={`py-2 px-4 rounded-xl font-medium transition-all ${
                    formData.frequency === freq.value
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mulai Tanggal</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selesai Tanggal</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Opsional"
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
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Contoh: Gaji bulanan, Tagihan listrik, dll..."
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="cash">Tunai</option>
              <option value="digital">Digital</option>
              {bankAccounts && bankAccounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          {formData.amount && formData.frequency && (
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-purple-700 mb-2">Preview Transaksi</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  {formatCurrency(parseFloat(formData.amount) || 0)} - {formData.category}
                </p>
                <p className="text-sm text-gray-600">
                  Berulang setiap {FREQUENCY_OPTIONS.find(f => f.value === formData.frequency)?.label}
                </p>
                <p className="text-xs text-gray-500">
                  Dimulai: {new Date(formData.startDate).toLocaleDateString('id-ID')}
                  {formData.endDate && ` - Selesai: ${new Date(formData.endDate).toLocaleDateString('id-ID')}`}
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Tambah Transaksi Berulang
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecurringModal;
