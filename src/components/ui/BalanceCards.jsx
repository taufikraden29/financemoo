import { Wallet, TrendingUp, TrendingDown, TrendingUpDown } from "lucide-react";
import { formatCurrency } from "../../utils";

const BalanceCards = ({ 
  balance, 
  totalIncome, 
  totalExpense, 
  totalDebt,
  debtsCount,
  savingsRate, 
  dailyAverage, 
  hideBalance 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-8">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 md:hover:scale-105">
        <div className="flex items-center justify-between mb-2">
          <p className="text-indigo-100 text-xs md:text-sm font-medium">
            Total Saldo
          </p>
          <Wallet className="w-4 h-4 md:w-5 md:h-5 text-indigo-200" />
        </div>
        <p className="text-2xl md:text-3xl font-bold mb-1">
          {formatCurrency(balance, hideBalance)}
        </p>
        <p className="text-indigo-200 text-xs flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" />
          Savings Rate: {hideBalance ? "••%" : `${savingsRate}%`}
        </p>
      </div>

      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 active:scale-95 md:hover:scale-105">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600 text-xs md:text-sm font-medium">
            Pemasukan
          </p>
          <div className="bg-green-100 p-1.5 md:p-2 rounded-lg">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(totalIncome, hideBalance)}
        </p>
        <p className="text-green-600 text-xs font-medium">Bulan ini</p>
      </div>

      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 active:scale-95 md:hover:scale-105">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600 text-xs md:text-sm font-medium">
            Pengeluaran
          </p>
          <div className="bg-red-100 p-1.5 md:p-2 rounded-lg">
            <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(totalExpense, hideBalance)}
        </p>
        <p className="text-red-600 text-xs font-medium">
          ≈ {formatCurrency(dailyAverage, hideBalance)}/hari
        </p>
      </div>

      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 active:scale-95 md:hover:scale-105">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-600 text-xs md:text-sm font-medium">
            Total Hutang
          </p>
          <div className="bg-orange-100 p-1.5 md:p-2 rounded-lg">
            <TrendingUpDown className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
          </div>
        </div>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(totalDebt, hideBalance)}
        </p>
        <p className="text-orange-600 text-xs font-medium">
          {debtsCount} hutang aktif
        </p>
      </div>
    </div>
  );
};

export default BalanceCards;
