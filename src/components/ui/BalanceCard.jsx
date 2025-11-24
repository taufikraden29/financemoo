import React, { useState } from 'react';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters/formatters';

const BalanceCard = ({
  transactions = [],
  bankAccountBalances = [],
  hideBalance = false,
  setHideBalance,
  onAddCash = () => {},
  onTransfer = () => {}
}) => {
  // Calculate balances for different payment methods
  const cashIncome = transactions
    .filter(t => t.type === 'income' && t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashExpense = transactions
    .filter(t => t.type === 'expense' && t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashBalance = cashIncome - cashExpense;

  // Calculate digital/bank balance by summing all bank accounts
  const bankBalance = bankAccountBalances.reduce((sum, acc) => sum + acc.balance, 0);

  // Calculate individual bank account details
  const bankAccounts = bankAccountBalances.map(acc => ({
    ...acc,
    net: acc.totalIncome - acc.totalExpense
  }));

  // State for showing bank details
  const [showBankDetails, setShowBankDetails] = useState({});

  const toggleBankDetails = (accountId) => {
    setShowBankDetails(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Main Balance Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Wallet className="w-4 h-4 text-indigo-200" />
          <p className="text-xs font-medium text-indigo-100">
            Saldo Keseluruhan
          </p>
        </div>
        <button
          onClick={() => setHideBalance && setHideBalance(!hideBalance)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          {hideBalance ? (
            <EyeOff className="w-4 h-4 text-indigo-200" />
          ) : (
            <Eye className="w-4 h-4 text-indigo-200" />
          )}
        </button>
      </div>

      {/* Main Balance Amount */}
      <p className="text-xl md:text-2xl font-bold mb-3">
        {hideBalance ? "Rp ••••••" : formatCurrency(cashBalance + bankBalance)}
      </p>

      {/* Balance Distribution */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/20 rounded-lg p-2">
          <p className="text-xs text-indigo-100 mb-1">Tunai</p>
          <p className="text-sm font-bold">
            {hideBalance ? "•••••" : formatCurrency(cashBalance)}
          </p>
        </div>
        <div className="bg-white/20 rounded-lg p-2">
          <p className="text-xs text-indigo-100 mb-1">Digital</p>
          <p className="text-sm font-bold">
            {hideBalance ? "•••••" : formatCurrency(bankBalance)}
          </p>
        </div>
      </div>

      {/* Bank Account Details */}
      {bankAccounts.length > 0 && (
        <div className="space-y-2 mb-3">
          {bankAccounts.map(account => (
            <div key={account.id} className="bg-white/20 rounded-lg p-2">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleBankDetails(account.id)}
              >
                <div className="flex items-center space-x-1">
                  <p className="text-xs font-bold truncate max-w-[80px]">
                    {account.name.substring(0, 15)}{account.name.length > 15 ? '...' : ''}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <p className="text-xs font-bold">
                    {hideBalance ? "•••••" : formatCurrency(account.balance)}
                  </p>
                  <button
                    className="p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBankDetails(account.id);
                    }}
                    aria-label={showBankDetails[account.id] ? "Sembunyikan detail" : "Tampilkan detail"}
                  >
                    {showBankDetails[account.id] ? (
                      <EyeOff className="w-3 h-3 text-indigo-200" />
                    ) : (
                      <Eye className="w-3 h-3 text-indigo-200" />
                    )}
                  </button>
                </div>
              </div>

              {showBankDetails[account.id] && !hideBalance && (
                <div className="mt-1 pt-1 border-t border-white/30">
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-indigo-100">In:</span>
                      <span className="text-green-300">{formatCurrency(account.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-100">Out:</span>
                      <span className="text-red-300">{formatCurrency(account.totalExpense)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={onAddCash}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-xs font-medium transition-all"
          title="Tambah Kas"
        >
          + Kas
        </button>
        <button
          onClick={onTransfer}
          className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-xs font-medium transition-all"
          title="Transfer"
        >
          Transfer
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;