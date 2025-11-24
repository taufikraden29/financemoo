import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Download, Filter, Wallet, Activity } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters/formatters';
import { getIconComponent } from '../../utils/helpers/iconMapper';
import { generateAnalyticsReport } from '../../utils/analytics/analyticsCalculations';

const AnalyticsTab = ({ transactions, budgets, installments, getTotalStatistics }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('category');

  // Filter transactions based on time range
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    return transactions.filter(t => new Date(t.timestamp || t.date) >= startDate);
  }, [transactions, timeRange]);

  // Generate comprehensive analytics report
  const analyticsReport = useMemo(() => {
    const installmentStats = getTotalStatistics ? getTotalStatistics() : {
      totalDebt: 0,
      totalPaid: 0,
      totalAmount: 0,
      activeInstallments: 0,
      completedInstallments: 0,
      totalInstallments: 0
    };

    return generateAnalyticsReport(filteredTransactions, budgets, installments);
  }, [filteredTransactions, budgets, installments]);

  const handleExportData = () => {
    const data = {
      timeRange,
      report: analyticsReport,
      exportDate: new Date().toISOString(),
      appVersion: "1.0.0"
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analisis Keuangan</h2>
          <p className="text-gray-600">Pantau tren dan analisis pengeluaran Anda</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Rentang Waktu:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'week', label: 'Minggu Ini' },
              { value: 'month', label: 'Bulan Ini' },
              { value: 'quarter', label: '3 Bulan' },
              { value: 'year', label: 'Tahun Ini' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range.value
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Total Pemasukan</span>
            <TrendingUp className="w-5 h-5 text-green-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(analyticsReport.summary.totalIncome)}</p>
          <p className="text-green-100 text-xs">
            Rata-rata {formatCurrency(analyticsReport.summary.totalIncome / 30)}/hari
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-100 text-sm font-medium">Total Pengeluaran</span>
            <TrendingDown className="w-5 h-5 text-red-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(analyticsReport.summary.totalExpense)}</p>
          <p className="text-red-100 text-xs">
            Rata-rata {formatCurrency(analyticsReport.summary.totalExpense / 30)}/hari
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Saldo Bersih</span>
            <BarChart3 className="w-5 h-5 text-blue-100" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(analyticsReport.summary.netWorth)}</p>
          <p className="text-blue-100 text-xs">Net balance</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm font-medium">Kesehatan Finansial</span>
            <Activity className="w-5 h-5 text-purple-100" />
          </div>
          <p className="text-2xl font-bold">{analyticsReport.financialHealth.healthScore.toFixed(1)}%</p>
          <p className="text-purple-100 text-xs">Skor kesehatan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Breakdown Kategori</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>

          {analyticsReport.categoryBreakdown.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Belum ada data pengeluaran</p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyticsReport.categoryBreakdown.slice(0, 10).map((categoryData, index) => {
                return (
                  <div key={categoryData.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-6">#{index + 1}</span>
                      <span className="font-medium text-gray-900">{categoryData.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(categoryData.total)}</p>
                      <p className="text-xs text-gray-600">{categoryData.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Budget Performance */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Performa Budget</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>

          {Object.keys(budgets).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Belum ada budget yang diatur</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(budgets).map(([category, limit]) => {
                const spent = filteredTransactions
                  .filter(t => t.type === 'expense' && t.category === category)
                  .reduce((sum, t) => sum + t.amount, 0);
                const percentage = (spent / limit) * 100;
                return (
                  <div key={category} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{category}</span>
                      <span className={`text-sm font-medium ${
                        percentage >= 100 ? 'text-red-600' :
                        percentage >= 80 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          percentage >= 100 ? 'bg-red-500' :
                          percentage >= 80 ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {formatCurrency(spent)} / {formatCurrency(limit)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Financial Health & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Health */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Kesehatan Finansial</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tingkat Tabungan</span>
                <span className="font-bold text-blue-600">{analyticsReport.financialHealth.savingsRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${Math.min(100, Math.max(0, analyticsReport.financialHealth.savingsRate))}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Penggunaan Budget</span>
                <span className="font-bold text-green-600">{analyticsReport.financialHealth.budgetAdherence.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${Math.min(100, Math.max(0, analyticsReport.financialHealth.budgetAdherence))}%` }}
                />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Rasio Hutang/Pendapatan</span>
                <span className="font-bold text-orange-600">{analyticsReport.financialHealth.debtToIncomeRatio.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-orange-500"
                  style={{ width: `${Math.min(100, Math.max(0, analyticsReport.financialHealth.debtToIncomeRatio))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Distribusi Pembayaran</h3>
            <Wallet className="w-5 h-5 text-gray-400" />
          </div>

          {Object.keys(analyticsReport.paymentMethods).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Belum ada data metode pembayaran</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(analyticsReport.paymentMethods).map(([method, data]) => (
                <div key={method} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900 capitalize">{method}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(data.total)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-green-600">Income: {formatCurrency(data.income)}</div>
                    <div className="text-red-600">Expense: {formatCurrency(data.expense)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Trends */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Tren Transaksi</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>

        {analyticsReport.transactionTrend.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Belum ada data tren transaksi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyticsReport.transactionTrend.slice(-10).map((trendData) => (
              <div key={trendData.date} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{trendData.date}</span>
                  <span className={`font-bold ${
                    trendData.net >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(trendData.net)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Pemasukan: </span>
                    <span className="font-medium text-green-600">{formatCurrency(trendData.income)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pengeluaran: </span>
                    <span className="font-medium text-red-600">{formatCurrency(trendData.expense)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsTab;
