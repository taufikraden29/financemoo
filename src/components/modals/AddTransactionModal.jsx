import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from '../../utils/formatters/formatters';
import { validateTransaction } from '../../utils/validation/validators';
import { toast } from 'react-hot-toast';

const AddTransactionModal = ({ isOpen, onClose, onSubmit, transactionType, setTransactionType }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    paymentMethod: 'cash',
    date: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare transaction data for validation
    const transactionForValidation = {
      amount: parseFloat(formData.amount),
      type: transactionType,
      category: formData.category,
      description: formData.description,
      paymentMethod: formData.paymentMethod,
      date: formData.date,
    };

    // Validate the transaction
    const validation = validateTransaction(transactionForValidation);
    if (!validation.isValid) {
      toast.error(validation.errors[0] || 'Validasi transaksi gagal');
      return;
    }

    const transaction = {
      id: Date.now().toString(),
      type: transactionType,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      timestamp: new Date().toISOString(),
    };

    onSubmit(transaction);
    setFormData({
      amount: '',
      category: '',
      description: '',
      paymentMethod: 'cash',
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  const categories = transactionType === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Tambah Transaksi</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
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
              <TrendingUp className="w-4 h-4" />
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
              <TrendingDown className="w-4 h-4" />
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
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tambahkan catatan..."
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                className={`py-2 px-4 rounded-xl font-medium transition-all ${
                  formData.paymentMethod === 'cash'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tunai
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'digital' })}
                className={`py-2 px-4 rounded-xl font-medium transition-all ${
                  formData.paymentMethod === 'digital'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Digital
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            Tambah Transaksi
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
