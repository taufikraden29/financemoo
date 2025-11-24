import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

// Import components
import { Header } from './components/layout';
import { NavigationTabs } from './components/layout';
import { BalanceCards } from './components/layout';
import { Notification } from './components/layout';
import { UserLevelBanner } from './components/layout';
import { InstallmentManager } from './components/features/installments';

// Import hooks
import { useTransactions, useBudgets, useRecurring, useAchievements } from './hooks/business';
import { useGamification } from './hooks/ui';

// Import utilities
import { formatCurrency } from './utils/formatters';
import { getIconComponent, useLocalStorage } from './utils/helpers';

const FinanceApp = () => {
  // Custom hooks
  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);

  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showCashAccountModal, setShowCashAccountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Use business hooks
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const { budgets, setBudget, deleteBudget } = useBudgets();
  const { recurringTransactions, addRecurring, deleteRecurring } = useRecurring();
  const { achievements } = useAchievements();
  const { userStats, addXP } = useGamification();

  // UI state
  const [transactionType, setTransactionType] = useState("expense");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showNotification, setShowNotification] = useState(false);
  const [showAchievementNotification, setShowAchievementNotification] = useState(null);

  // Calculate derived values
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const cashIncome = transactions
    .filter((t) => t.type === "income" && t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashExpense = transactions
    .filter((t) => t.type === "expense" && t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.amount, 0);

  const dailyAverage = totalExpense > 0 ? (totalExpense / 30).toFixed(0) : "0";
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  // Event handlers
  const handleExportData = () => {
    toast.success('Data exported successfully!');
    addXP(50);
  };

  const handleSetBudget = (category, limit) => {
    setBudget(category, parseFloat(limit));
    toast.success(`Budget set successfully!`);
  };

  const handleDeleteBudget = (category) => {
    if (!window.confirm(`Are you sure you want to delete budget for "${category}"?`)) return;
    deleteBudget(category);
    toast.success(`Budget for ${category} deleted successfully!`);
  };

  const handleDeleteRecurring = (recurringId) => {
    if (!window.confirm("Are you sure you want to delete this recurring transaction? This action cannot be undone.")) return;
    deleteRecurring(recurringId);
    toast.success(`Recurring transaction deleted successfully!`);
  };

  const checkAchievement = (achievementName) => {
    const achievement = achievements.find((a) => a.name === achievementName && !a.unlocked);
    if (achievement) {
      toast.success(`🎉 Achievement Unlocked: ${achievement.name} (+${achievement.reward} XP)`);
      setShowAchievementNotification(achievement);
      addXP(achievement.reward);
    }
  };

  return (
    <>
      {/* Achievement Notification */}
      {showAchievementNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 max-w-sm">
            <div className="bg-white/30 p-2 rounded-full">
              {React.createElement(getIconComponent(showAchievementNotification.icon), { className: "w-6 h-6" })}
            </div>
            <div>
              <p className="font-bold text-base">Achievement Unlocked! 🎉</p>
              <p className="text-sm opacity-90">{showAchievementNotification.name}</p>
              <p className="text-xs opacity-75">+{showAchievementNotification.reward} XP</p>
            </div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 md:space-x-3 max-w-sm">
            <AlertCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm md:text-base">Budget Alert! 🚨</p>
              <p className="text-xs md:text-sm opacity-90">
                Ada kategori yang hampir melebihi budget
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        onExportData={handleExportData}
        hideBalance={hideBalance}
        setHideBalance={setHideBalance}
        setShowCashAccountModal={setShowCashAccountModal}
        setShowTransferModal={setShowTransferModal}
        setShowAddModal={setShowAddModal}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* User Level Banner */}
        <UserLevelBanner userStats={userStats} />

        {/* Balance Cards */}
        <BalanceCards
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
          formatCurrency={formatCurrency}
          hideBalance={hideBalance}
          savingsRate={savingsRate}
          cashIncome={cashIncome}
          cashExpense={cashExpense}
          digitalIncome={0}
          digitalExpense={0}
          cashBalance={0}
          digitalBalance={0}
          dailyAverage={dailyAverage}
        />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content Area */}
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "budget" && <BudgetTab />}
        {activeTab === "installments" && <InstallmentManager />}
        {activeTab === "recurring" && <RecurringTab />}
        {activeTab === "transactions" && <TransactionsTab />}
        {activeTab === "achievements" && <AchievementsTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-500 text-sm">
        <p>Made with ❤️ using React & Tailwind CSS</p>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-sans',
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          success: {
            style: {
              background: '#d1fae5', // light green
              color: '#065f46', // dark green
            },
          },
          error: {
            style: {
              background: '#fee2e2', // light red
              color: '#b91c1c', // dark red
            },
          },
          custom: {
            style: {
              background: '#f0f9ff', // light blue
              color: '#1d4ed8', // dark blue
            },
          },
        }}
      />
    </>
  );
};

// Tab Components
const OverviewTab = () => {
  // TODO: Implement Overview Tab
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Overview
        </h2>
        <p className="text-gray-600">Overview tab - coming soon!</p>
      </div>
    </div>
  );
};

const BudgetTab = () => {
  // TODO: Implement Budget Tab
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Budget
        </h2>
        <p className="text-gray-600">Budget tab - coming soon!</p>
      </div>
    </div>
  );
};

const RecurringTab = () => {
  // TODO: Implement Recurring Tab
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Recurring Transactions
        </h2>
        <p className="text-gray-600">Recurring tab - coming soon!</p>
      </div>
    </div>
  );
};

const TransactionsTab = () => {
  // TODO: Implement Transactions Tab
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Transactions
        </h2>
        <p className="text-gray-600">Transactions tab - coming soon!</p>
      </div>
    </div>
  );
};

const AchievementsTab = () => {
  // TODO: Implement Achievements Tab
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Achievements
        </h2>
        <p className="text-gray-600">Achievements tab - coming soon!</p>
      </div>
    </div>
  );
};

const AnalyticsTab = () => {
  // TODO: Implement Analytics Tab
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
          Analytics
        </h2>
        <p className="text-gray-600">Analytics tab - coming soon!</p>
      </div>
    </div>
  );
};

export default FinanceApp;
