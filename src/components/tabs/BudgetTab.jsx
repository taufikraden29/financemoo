import React, { useState } from 'react';
import { Target, AlertTriangle, Plus, Trash2, Edit } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters/formatters';
import { CATEGORIES } from '../../constants/categories';

const BudgetTab = ({ budgets, transactions, onSetBudget, onDeleteBudget, onOpenBudgetModal }) => {
  const [editingBudget, setEditingBudget] = useState(null);

  const getExpenseByCategory = (category) => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBudgetStatus = (category, limit) => {
    const spent = getExpenseByCategory(category);
    const percentage = (spent / limit) * 100;
    const remaining = limit - spent;
    
    if (percentage >= 100) return { status: 'exceeded', color: 'red', percentage, remaining, spent };
    if (percentage >= 90) return { status: 'danger', color: 'orange', percentage, remaining, spent };
    if (percentage >= 70) return { status: 'warning', color: 'yellow', percentage, remaining, spent };
    return { status: 'safe', color: 'green', percentage, remaining, spent };
  };

  const getAvailableCategories = () => {
    return CATEGORIES.expense.filter(cat => !budgets[cat.name]);
  };

  const budgetSummary = {
    totalBudget: Object.values(budgets).reduce((sum, limit) => sum + limit, 0),
    totalSpent: Object.entries(budgets).reduce((sum, [category, limit]) => {
      return sum + getExpenseByCategory(category);
    }, 0),
    categoriesCount: Object.keys(budgets).length,
  };

  const budgetStats = Object.entries(budgets).map(([category, limit]) => ({
    category,
    limit,
    ...getBudgetStatus(category, limit),
  }));

  const handleDeleteBudget = (category) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus budget untuk "${category}"?`)) {
      onDeleteBudget(category);
    }
  };

  const handleEditBudget = (category, currentLimit) => {
    const newLimit = prompt(`Edit budget untuk ${category}:`, currentLimit.toString());
    if (newLimit && !isNaN(newLimit) && parseFloat(newLimit) > 0) {
      onSetBudget(category, parseFloat(newLimit));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Budget</h2>
          <p className="text-gray-600">Kelola dan pantau batas pengeluaran per kategori</p>
        </div>
        <button
          onClick={onOpenBudgetModal}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Total Budget</span>
            <Target className="w-5 h-5 text-blue-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(budgetSummary.totalBudget)}</p>
          <p className="text-blue-100 text-xs">{budgetSummary.categoriesCount} kategori</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100 text-sm font-medium">Total Terpakai</span>
            <AlertTriangle className="w-5 h-5 text-orange-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(budgetSummary.totalSpent)}</p>
          <p className="text-orange-100 text-xs">
            {budgetSummary.totalBudget > 0 ? ((budgetSummary.totalSpent / budgetSummary.totalBudget) * 100).toFixed(1) : 0}% dari total
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Sisa Budget</span>
            <Plus className="w-5 h-5 text-green-100" />
          </div>
          <p className="text-2xl font-bold">
            {formatCurrency(Math.max(0, budgetSummary.totalBudget - budgetSummary.totalSpent))}
          </p>
          <p className="text-green-100 text-xs">Tersisa</p>
        </div>
      </div>

      {/* Budget List */}
      {Object.keys(budgets).length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Budget</h3>
          <p className="text-gray-600 mb-4">
            Mulai atur budget untuk mengontrol pengeluaran Anda
          </p>
          <button
            onClick={onOpenBudgetModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Buat Budget Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Budget</h3>
          
          <div className="space-y-4">
            {budgetStats.map((budget) => (
              <div key={budget.category} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${budget.color}-100`}>
                      <Target className={`w-5 h-5 text-${budget.color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{budget.category}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      budget.status === 'exceeded' ? 'bg-red-100 text-red-700' :
                      budget.status === 'danger' ? 'bg-orange-100 text-orange-700' :
                      budget.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {budget.status === 'exceeded' ? 'Melebihi' :
                       budget.status === 'danger' ? 'Bahaya' :
                       budget.status === 'warning' ? 'Perhatian' : 'Aman'}
                    </span>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditBudget(budget.category, budget.limit)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Budget"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.category)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Hapus Budget"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      {budget.percentage.toFixed(1)}% terpakai
                    </span>
                    <span className={`text-sm font-medium ${
                      budget.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {budget.remaining >= 0 ? 'Sisa:' : 'Kelebihan:'} {formatCurrency(Math.abs(budget.remaining))}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        budget.status === 'exceeded' ? 'bg-red-500' :
                        budget.status === 'danger' ? 'bg-orange-500' :
                        budget.status === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Alert Messages */}
                {budget.status === 'exceeded' && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Budget telah terlampaui! Segera tinjau pengeluaran Anda.</span>
                  </div>
                )}
                {budget.status === 'danger' && (
                  <div className="flex items-center gap-2 mt-2 text-orange-600 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span> Hampir mencapai batas budget!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Categories */}
      {getAvailableCategories().length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Kategori Tersedia</h3>
          <p className="text-gray-600 mb-4">
            Kategori berikut belum memiliki budget:
          </p>
          <div className="flex flex-wrap gap-2">
            {getAvailableCategories().map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  const limit = prompt(`Set budget untuk ${category.name}:`);
                  if (limit && !isNaN(limit) && parseFloat(limit) > 0) {
                    onSetBudget(category.name, parseFloat(limit));
                  }
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTab;
