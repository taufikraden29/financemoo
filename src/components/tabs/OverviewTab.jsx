import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, AlertTriangle, Wallet, CreditCard, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters/formatters';
import { getIconComponent } from '../../utils/helpers/iconMapper';

const OverviewTab = ({ transactions, budgets, recurringTransactions, balance, totalIncome, totalExpense, cashBalance, digitalBalance, bankAccountBalances = [] }) => {
  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  // Get budget alerts
  const getBudgetAlerts = () => {
    const alerts = [];
    Object.entries(budgets).forEach(([category, limit]) => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = (spent / limit) * 100;
      
      if (percentage >= 80) {
        alerts.push({ category, spent, limit, percentage, status: percentage >= 90 ? 'danger' : 'warning' });
      }
    });
    return alerts;
  };

  // Get upcoming recurring transactions (next 7 days)
  const getUpcomingRecurring = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return recurringTransactions.filter(r => {
      if (!r.isActive) return false;
      
      const nextDate = new Date(r.startDate);
      while (nextDate <= nextWeek) {
        if (nextDate >= today) return true;
        
        // Add frequency
        switch (r.frequency) {
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
      }
      return false;
    });
  };

  // Calculate category spending
  const getCategorySpending = () => {
    const spending = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        spending[t.category] = (spending[t.category] || 0) + t.amount;
      });
    
    return Object.entries(spending)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const budgetAlerts = getBudgetAlerts();
  const upcomingRecurring = getUpcomingRecurring();
  const topCategories = getCategorySpending();

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Total Pemasukan</span>
            <TrendingUp className="w-5 h-5 text-green-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
          <p className="text-green-100 text-xs">Bulan ini</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-100 text-sm font-medium">Total Pengeluaran</span>
            <TrendingDown className="w-5 h-5 text-red-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
          <p className="text-red-100 text-xs">Bulan ini</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Saldo Bersih</span>
            <DollarSign className="w-5 h-5 text-blue-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
          <p className="text-blue-100 text-xs">Tersedia</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm font-medium">Budget Aktif</span>
            <Target className="w-5 h-5 text-purple-100" />
          </div>
          <p className="text-2xl font-bold">{Object.keys(budgets).length}</p>
          <p className="text-purple-100 text-xs">Kategori</p>
        </div>
      </div>

      {/* Account Balance Cards Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-indigo-600" />
          Saldo Akun
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Cash Balance Card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-100 text-sm font-medium">Tunai</span>
              <PiggyBank className="w-5 h-5 text-amber-200" />
            </div>
            <p className="text-xl font-bold">{formatCurrency(cashBalance)}</p>
            <p className="text-amber-200 text-xs">Saldo saat ini</p>
          </div>

          {/* Digital Balance Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm font-medium">Digital</span>
              <CreditCard className="w-5 h-5 text-blue-200" />
            </div>
            <p className="text-xl font-bold">{formatCurrency(digitalBalance)}</p>
            <p className="text-blue-200 text-xs">Total rekening digital</p>
          </div>

          {/* Bank Accounts Summary */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-100 text-sm font-medium">Bank</span>
              <CreditCard className="w-5 h-5 text-emerald-200" />
            </div>
            <p className="text-xl font-bold">{formatCurrency(bankAccountBalances.reduce((sum, acc) => sum + acc.balance, 0))}</p>
            <p className="text-emerald-200 text-xs">{bankAccountBalances.length} rekening</p>
          </div>
        </div>

        {/* Individual Bank Accounts */}
        {bankAccountBalances.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-gray-700">Detail Rekening Bank</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bankAccountBalances.map((account) => (
                <div key={account.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{account.name}</p>
                      <p className="text-xs text-gray-600">{account.bankName}</p>
                    </div>
                    <p className="font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Transaksi Terbaru</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600">Belum ada transaksi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => {
                const Icon = getIconComponent(
                  transaction.type === 'income' ? 'TrendingUp' : 'TrendingDown'
                );
                
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.category}</p>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Alerts & Reminders */}
        <div className="space-y-4">
          {/* Budget Alerts */}
          {budgetAlerts.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-gray-900">Budget Alert</h3>
              </div>
              
              <div className="space-y-3">
                {budgetAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.category} className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{alert.category}</span>
                      <span className={`text-xs font-medium ${
                        alert.status === 'danger' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {alert.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          alert.status === 'danger' ? 'bg-red-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatCurrency(alert.spent)} / {formatCurrency(alert.limit)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Categories */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Kategori Teratas</h3>
            
            {topCategories.length === 0 ? (
              <p className="text-gray-600 text-center py-4">Belum ada pengeluaran</p>
            ) : (
              <div className="space-y-3">
                {topCategories.map(([category, amount], index) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                    <span className="font-bold text-gray-900">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
