import React, { useState } from 'react';
import { X, Target, AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../../constants/categories';
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from '../../utils/formatters/formatters';

const BudgetModal = ({ isOpen, onClose, onSubmit, budgets, transactions }) => {
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
    period: 'monthly',
  });

  if (!isOpen) return null;

  const getExpenseByCategory = (category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetStatus = (category, limit) => {
    const spent = getExpenseByCategory(category);
    const percentage = (spent / limit) * 100;
    
    if (percentage >= 90) return { status: 'danger', color: 'red' };
    if (percentage >= 70) return { status: 'warning', color: 'orange' };
    return { status: 'safe', color: 'green' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.limit) return;

    onSubmit(formData.category, parseFloat(formData.limit));
    setFormData({ category: '', limit: '', period: 'monthly' });
    onClose();
  };

  const availableCategories = CATEGORIES.expense.filter(
    cat => !budgets[cat.name]
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Atur Budget</h3>
              <p className="text-sm text-gray-600">Kelola batas pengeluaran per kategori</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Budgets */}
          {Object.keys(budgets).length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Budget Aktif</h4>
              <div className="space-y-3">
                {Object.entries(budgets).map(([category, limit]) => {
                  const spent = getExpenseByCategory(category);
                  const percentage = Math.min((spent / limit) * 100, 100);
                  const status = getBudgetStatus(category, limit);

                  return (
                    <div key={category} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{category}</span>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {formatCurrency(spent)} / {formatCurrency(limit)}
                          </p>
                          <p className={`text-xs font-medium text-${status.color}-600`}>
                            {percentage.toFixed(1)}% terpakai
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-${status.color}-500 h-2 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {status.status === 'danger' && (
                        <div className="flex items-center gap-2 mt-2 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm">Hampir melebihi budget!</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Budget */}
          {availableCategories.length > 0 ? (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Tambah Budget Baru</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    {availableCategories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Batas Budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                    <input
                      type="text"
                      value={formData.limit ? formatCurrencyInput(formData.limit) : ''}
                      onChange={(e) => {
                        const numericValue = parseCurrencyInput(e.target.value);
                        setFormData({ ...formData, limit: numericValue });
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

                {/* Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Bulanan</option>
                    <option value="weekly">Mingguan</option>
                    <option value="yearly">Tahunan</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  Tambah Budget
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Semua Kategori Memiliki Budget</h4>
              <p className="text-gray-600">
                Semua kategori pengeluaran sudah memiliki budget yang ditetapkan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;
