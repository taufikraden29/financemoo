import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Banknote, CreditCard, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

const BalanceCards = ({
  totalIncome,
  totalExpense,
  balance,
  formatCurrency,
  hideBalance,
  savingsRate,
  cashIncome,
  cashExpense,
  digitalIncome,
  digitalExpense,
  cashBalance,
  digitalBalance,
  dailyAverage,
  totalDebt,
  installmentStats,
  bankAccountBalances = [] // Added bank accounts prop
}) => {
  const [showBankDetails, setShowBankDetails] = useState({});

  // Toggle showing bank details
  const toggleBankDetails = (accountId) => {
    setShowBankDetails(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  return (
    <div className="space-y-4 mb-4">
      {/* Main balance card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-indigo-100 text-xs font-medium">
              Total Saldo
            </p>
            <Wallet className="w-4 h-4 text-indigo-200" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold">
              {formatCurrency(balance)}
            </p>
            <p className="text-indigo-200 text-xs flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {hideBalance ? "••%" : `${savingsRate}%`}
            </p>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-xs font-medium">
              Pemasukan
            </p>
            <div className="bg-green-100 p-1.5 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-green-600 text-xs font-medium">Bulan ini</p>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-xs font-medium">
              Pengeluaran
            </p>
            <div className="bg-red-100 p-1.5 rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(totalExpense)}
            </p>
            <p className="text-red-600 text-xs font-medium">
              {formatCurrency(dailyAverage)}/hari
            </p>
          </div>
        </div>

        {/* Debt Card */}
        <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-xl p-4 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 text-xs font-medium">
              Total Utang
            </p>
            <TrendingDown className="w-4 h-4 text-orange-200" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold">
              {formatCurrency(totalDebt || 0)}
            </p>
            <p className="text-orange-200 text-xs font-medium">
              {installmentStats?.activeInstallments || 0} cicilan
            </p>
          </div>
        </div>
      </div>

      {/* Cash Balance Card */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl p-4 text-white shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-green-100 text-xs font-medium">
            Cash Balance
          </p>
          <Wallet className="w-4 h-4 text-green-200" />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold">
            {formatCurrency(cashBalance)}
          </p>
          <p className="text-green-200 text-xs">
            {formatCurrency(cashIncome)}↑, {formatCurrency(cashExpense)}↓
          </p>
        </div>
      </div>

      {/* Bank Accounts */}
      {bankAccountBalances && bankAccountBalances.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">Rekening Bank</h3>
          {bankAccountBalances.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Banknote className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{account.name}</h4>
                    <p className="text-xs text-gray-600">{account.bankName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleBankDetails(account.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {showBankDetails[account.id] ? (
                      <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(account.balance)}
                  </p>
                </div>
              </div>

              {showBankDetails[account.id] && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{account.accountName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">No:</span>
                    <span className="font-medium">{account.accountNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">In:</span>
                    <span className="text-green-600">{formatCurrency(account.totalIncome)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Out:</span>
                    <span className="text-red-600">{formatCurrency(account.totalExpense)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BalanceCards;
