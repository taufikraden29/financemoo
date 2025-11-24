import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Search, Filter, Calendar, Trash2, Edit } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters/formatters';
import { getIconComponent } from '../../utils/helpers/iconMapper';
import { CATEGORIES } from '../../constants/categories';

const TransactionsTab = ({ transactions, onDeleteTransaction, onOpenAddModal, setTransactionType }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Filter by payment method
    if (filterPaymentMethod !== 'all') {
      filtered = filtered.filter(t => t.paymentMethod === filterPaymentMethod);
    }

    // Filter by date range
    const now = new Date();
    if (selectedDateRange !== 'all') {
      const startDate = new Date();
      switch (selectedDateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter(t => new Date(t.timestamp) >= startDate);
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterPaymentMethod, sortBy, selectedDateRange]);

  const statistics = {
    totalTransactions: filteredAndSortedTransactions.length,
    totalIncome: filteredAndSortedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: filteredAndSortedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    averageTransaction: filteredAndSortedTransactions.length > 0 
      ? filteredAndSortedTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredAndSortedTransactions.length 
      : 0,
  };

  const handleDeleteTransaction = (transactionId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      onDeleteTransaction(transactionId);
    }
  };

  const getAllCategories = () => {
    const categories = new Set();
    transactions.forEach(t => categories.add(t.category));
    return Array.from(categories);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daftar Transaksi</h2>
          <p className="text-gray-600">Kelola dan pantau semua transaksi keuangan Anda</p>
        </div>
        <button
          onClick={() => {
            setTransactionType('expense');
            onOpenAddModal();
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <TrendingUp className="w-5 h-5" />
          Tambah Transaksi
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Total Transaksi</span>
            <Calendar className="w-5 h-5 text-blue-100" />
          </div>
          <p className="text-2xl font-bold">{statistics.totalTransactions}</p>
          <p className="text-blue-100 text-xs">Record</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Total Pemasukan</span>
            <TrendingUp className="w-5 h-5 text-green-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(statistics.totalIncome)}</p>
          <p className="text-green-100 text-xs">Income</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-100 text-sm font-medium">Total Pengeluaran</span>
            <TrendingDown className="w-5 h-5 text-red-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(statistics.totalExpense)}</p>
          <p className="text-red-100 text-xs">Expense</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm font-medium">Rata-rata</span>
            <Filter className="w-5 h-5 text-purple-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(statistics.averageTransaction)}</p>
          <p className="text-purple-100 text-xs">Per transaksi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filter & Pencarian</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Transaksi</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan kategori atau deskripsi..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua</option>
              {getAllCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urutkan</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Tanggal</option>
              <option value="amount">Jumlah</option>
              <option value="category">Kategori</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Daftar Transaksi ({filteredAndSortedTransactions.length})
          </h3>
        </div>

        {filteredAndSortedTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tidak Ada Transaksi</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all' 
                ? 'Tidak ada transaksi yang cocok dengan filter yang dipilih'
                : 'Belum ada transaksi yang dicatat'}
            </p>
            <button
              onClick={() => {
                setTransactionType('expense');
                onOpenAddModal();
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Tambah Transaksi Pertama
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredAndSortedTransactions.map((transaction) => {
              const Icon = getIconComponent(
                transaction.type === 'income' ? 'TrendingUp' : 'TrendingDown'
              );
              
              return (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{transaction.category}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                            {transaction.paymentMethod === 'cash' ? 'Tunai' : 'Digital'}
                          </span>
                        </div>
                        {transaction.description && (
                          <p className="text-sm text-gray-600 mb-1">{transaction.description}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setTransactionType(transaction.type);
                            // TODO: Implement edit functionality
                            alert('Fitur edit akan segera hadir!');
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTab;
