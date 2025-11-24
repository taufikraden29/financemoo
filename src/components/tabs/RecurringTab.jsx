import React, { useState } from 'react';
import { Repeat, Plus, Trash2, ToggleLeft, ToggleRight, Calendar, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters/formatters';
import { getIconComponent } from '../../utils/helpers/iconMapper';

const RecurringTab = ({ recurringTransactions, onAddRecurring, onDeleteRecurring, onOpenRecurringModal, setTransactionType }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTransactions = recurringTransactions.filter(r => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return r.isActive;
    if (filterStatus === 'inactive') return !r.isActive;
    return true;
  });

  const getNextOccurrence = (recurring) => {
    if (!recurring.isActive) return null;
    
    const now = new Date();
    let nextDate = new Date(recurring.startDate);
    
    // Find next occurrence after today
    while (nextDate <= now) {
      switch (recurring.frequency) {
        case 'daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
      }
      
      // Check if we've passed the end date
      if (recurring.endDate && nextDate > new Date(recurring.endDate)) {
        return null;
      }
    }
    
    return nextDate;
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      daily: 'Harian',
      weekly: 'Mingguan',
      monthly: 'Bulanan',
      yearly: 'Tahunan',
    };
    return labels[frequency] || frequency;
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'green' : 'gray';
  };

  const statistics = {
    totalRecurring: filteredTransactions.length,
    activeRecurring: filteredTransactions.filter(r => r.isActive).length,
    totalMonthlyAmount: filteredTransactions
      .filter(r => r.isActive && r.frequency === 'monthly')
      .reduce((sum, r) => sum + r.amount, 0),
    upcomingThisMonth: filteredTransactions.filter(r => {
      const next = getNextOccurrence(r);
      if (!next) return false;
      const now = new Date();
      return next.getMonth() === now.getMonth() && next.getFullYear() === now.getFullYear();
    }).length,
  };

  const handleToggleStatus = (recurring) => {
    // TODO: Implement toggle functionality in the hook
    alert(`Fitur toggle status untuk ${recurring.description} akan segera hadir!`);
  };

  const handleDelete = (recurringId) => {
    onDeleteRecurring(recurringId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaksi Berulang</h2>
          <p className="text-gray-600">Kelola transaksi otomatis berulang</p>
        </div>
        <button
          onClick={() => {
            setTransactionType('expense');
            onOpenRecurringModal();
          }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tambah Berulang
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm font-medium">Total Transaksi</span>
            <Repeat className="w-5 h-5 text-purple-100" />
          </div>
          <p className="text-2xl font-bold">{statistics.totalRecurring}</p>
          <p className="text-purple-100 text-xs">Berulang</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Aktif</span>
            <ToggleRight className="w-5 h-5 text-green-100" />
          </div>
          <p className="text-2xl font-bold">{statistics.activeRecurring}</p>
          <p className="text-green-100 text-xs">Sedang berjalan</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Bulanan</span>
            <Calendar className="w-5 h-5 text-blue-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(statistics.totalMonthlyAmount)}</p>
          <p className="text-blue-100 text-xs">Per bulan</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100 text-sm font-medium">Akan Datang</span>
            <Clock className="w-5 h-5 text-orange-100" />
          </div>
          <p className="text-2xl font-bold">{statistics.upcomingThisMonth}</p>
          <p className="text-orange-100 text-xs">Bulan ini</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter Status:</label>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Semua' },
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Non-aktif' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === filter.value
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recurring Transactions List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            Daftar Transaksi Berulang ({filteredTransactions.length})
          </h3>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Repeat className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Tidak Ada Transaksi Berulang</h3>
            <p className="text-gray-600 mb-4">
              {filterStatus !== 'all' 
                ? 'Tidak ada transaksi berulang dengan status yang dipilih'
                : 'Belum ada transaksi berulang yang diatur'}
            </p>
            <button
              onClick={() => {
                setTransactionType('expense');
                onOpenRecurringModal();
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
            >
              Buat Transaksi Berulang Pertama
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((recurring) => {
              const nextOccurrence = getNextOccurrence(recurring);
              const Icon = getIconComponent(
                recurring.type === 'income' ? 'TrendingUp' : 'TrendingDown'
              );
              
              return (
                <div key={recurring.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        recurring.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          recurring.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900">{recurring.description || recurring.category}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            recurring.type === 'income' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {recurring.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                          </span>
                          <span className={`px-2 py-1 bg-${getStatusColor(recurring.isActive)}-100 rounded-full text-xs font-medium text-${getStatusColor(recurring.isActive)}-700`}>
                            {recurring.isActive ? 'Aktif' : 'Non-aktif'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Kategori</p>
                            <p className="font-medium text-gray-900">{recurring.category}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Jumlah</p>
                            <p className={`font-bold ${
                              recurring.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {recurring.type === 'income' ? '+' : '-'}{formatCurrency(recurring.amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Frekuensi</p>
                            <p className="font-medium text-gray-900">{getFrequencyLabel(recurring.frequency)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Metode</p>
                            <p className="font-medium text-gray-900">
                              {recurring.paymentMethod === 'cash' ? 'Tunai' : 'Digital'}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Mulai:</span>{' '}
                            {new Date(recurring.startDate).toLocaleDateString('id-ID')}
                            {recurring.endDate && (
                              <>
                                {' '}<span className="font-medium">hingga:</span>{' '}
                                {new Date(recurring.endDate).toLocaleDateString('id-ID')}
                              </>
                            )}
                          </p>
                          {nextOccurrence && (
                            <p className="text-purple-600 font-medium">
                              Berikutnya: {nextOccurrence.toLocaleDateString('id-ID')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleToggleStatus(recurring)}
                        className={`p-2 rounded-lg transition-colors ${
                          recurring.isActive 
                            ? 'hover:bg-gray-100' 
                            : 'hover:bg-green-100'
                        }`}
                        title={recurring.isActive ? 'Non-aktifkan' : 'Aktifkan'}
                      >
                        {recurring.isActive ? (
                          <ToggleRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDelete(recurring.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
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

export default RecurringTab;
