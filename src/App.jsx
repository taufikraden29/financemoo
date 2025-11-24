import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AlertCircle } from "lucide-react";

// Import components
import { Header } from './components/layout';
import { NavigationTabs } from './components/layout';
import { BalanceCards } from './components/layout';
import { Notification } from './components/layout';
import { UserLevelBanner } from './components/layout';
import { InstallmentManager } from './components/features/installments';

// Import tabs
import {
  OverviewTab,
  BudgetTab,
  RecurringTab,
  TransactionsTab,
  AchievementsTab,
  AnalyticsTab
} from './components/tabs';

// Import modals
import {
  AddTransactionModal,
  BudgetModal,
  CashAccountModal,
  TransferModal,
  AddRecurringModal,
  BankAccountManager
} from './components/modals';

// Import hooks
import { useTransactions, useBudgets, useRecurring, useAchievements, useInstallments } from './hooks/business';
import { useGamification } from './hooks/ui';

// Import utilities
import { formatCurrency } from './utils/formatters';
import { getIconComponent, useLocalStorage } from './utils/helpers';

/**
 * Main Finance Application Component
 * Manages the core state and business logic for the MoneyPro application
 * Handles transactions, budgets, recurring transactions, achievements, installments, and gamification
 * @returns {JSX.Element} The main application UI
 */

const FinanceApp = () => {
  // Custom hooks
  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);

  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showCashAccountModal, setShowCashAccountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBankAccountManager, setShowBankAccountManager] = useState(false);

  // Use business hooks
  const { transactions, addTransaction, deleteTransaction, updateTransaction, setTransactions } = useTransactions();
  const { budgets, setBudget, deleteBudget, setBudgets } = useBudgets();
  const { recurringTransactions, addRecurring, deleteRecurring, setRecurringTransactions } = useRecurring();
  const { achievements, unlockAchievement, setAchievements } = useAchievements();
  const { installments, addInstallment, makePayment, getTotalStatistics, setInstallments } = useInstallments();
  const { userStats, addXP, setUserStats } = useGamification();

  // Bank accounts state
  const [bankAccounts, setBankAccounts] = useLocalStorage("bankAccounts", [
    { id: "default", name: "Rekening Digital", bankName: "Digital Wallet", accountName: "Pribadi", accountNumber: "****" }
  ]);

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

  // Calculate cash and digital transaction totals
  const cashIncome = transactions
    .filter((t) => t.type === "income" && t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashExpense = transactions
    .filter((t) => t.type === "expense" && t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate digital income and expense from all bank accounts
  const digitalIncome = transactions
    .filter((t) => t.type === "income" && (
      t.paymentMethod === "digital" ||
      bankAccounts.some(acc => acc.id === t.paymentMethod) // matches any bank account ID
    ))
    .reduce((sum, t) => sum + t.amount, 0);

  const digitalExpense = transactions
    .filter((t) => t.type === "expense" && (
      t.paymentMethod === "digital" ||
      bankAccounts.some(acc => acc.id === t.paymentMethod) // matches any bank account ID
    ))
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate balances
  const cashBalance = cashIncome - cashExpense;

  // Calculate bank account balances if available
  const bankAccountBalances = bankAccounts.map(account => {
    const accountIncome = transactions
      .filter((t) => t.type === "income" && t.paymentMethod === account.id)
      .reduce((sum, t) => sum + t.amount, 0);

    const accountExpense = transactions
      .filter((t) => t.type === "expense" && t.paymentMethod === account.id)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      ...account,
      balance: accountIncome - accountExpense,
      totalIncome: accountIncome,
      totalExpense: accountExpense
    };
  });

  // Calculate digital balance based on all bank accounts
  const totalBankBalance = bankAccountBalances.reduce((sum, acc) => sum + acc.balance, 0);
  const digitalBalance = totalBankBalance; // Now digitalBalance is sum of all bank account balances

  // Get installment statistics
  const installmentStats = getTotalStatistics();
  const totalDebt = installmentStats.totalDebt;

  const balance = totalIncome - totalExpense - totalDebt;

  const dailyAverage = totalExpense > 0 ? (totalExpense / 30).toFixed(0) : "0";
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0";

  // Event handlers
  const handleExportData = () => {
    exportData(
      transactions,
      budgets,
      recurringTransactions,
      installments,
      userStats,
      achievements
    );
    toast.success('Data exported successfully!');
    addXP(50);
  };

  const handleImportData = async (file) => {
    try {
      await importData(file, (data) => {
        // Set all the imported data
        setTransactions(data.transactions);
        setBudgets(data.budgets);
        setRecurringTransactions(data.recurringTransactions);
        setInstallments(data.installments);
        setUserStats(data.userStats);
        setAchievements(data.achievements);
      });
      toast.success('Data imported successfully!');
      addXP(100); // Bonus XP for importing data
    } catch (error) {
      toast.error(error.message);
    }
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
      unlockAchievement(achievement.id);
    }
  };

  // Modal handlers
  const handleCashAccountTransaction = (transaction) => {
    // Handle cash or bank account transactions
    let paymentMethod = 'cash';

    if (transaction.accountType === 'bank' && transaction.bankAccountId) {
      // For bank accounts, we use the bank account ID as the payment method
      paymentMethod = transaction.bankAccountId;
    }

    if (transaction.type === 'add') {
      // Add to account balance (record as income)
      const accountTransaction = {
        id: Date.now().toString(),
        type: 'income',
        amount: transaction.amount,
        category: 'Penyesuaian Saldo',
        description: transaction.description || (transaction.accountType === 'cash' ? 'Penambahan saldo tunai' : 'Setoran tunai'),
        paymentMethod: paymentMethod,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
      };
      addTransaction(accountTransaction);
    } else {
      // Subtract from account balance (record as expense)
      const accountTransaction = {
        id: Date.now().toString(),
        type: 'expense',
        amount: transaction.amount,
        category: 'Penyesuaian Saldo',
        description: transaction.description || (transaction.accountType === 'cash' ? 'Pengurangan saldo tunai' : 'Penarikan tunai'),
        paymentMethod: paymentMethod,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
      };
      addTransaction(accountTransaction);
    }
    addXP(10);
    checkAchievement("First Transaction");
  };

  const handleTransfer = (transfer) => {
    // Handle balance transfers between any account types (cash, digital, or bank accounts)
    const sourceTransaction = {
      id: Date.now().toString(),
      type: 'expense', // Transfer out is always expense from source account
      amount: transfer.amount,
      category: 'Transfer Saldo',
      description: transfer.description || `Transfer ke ${getAccountName(transfer.to)}`,
      paymentMethod: transfer.from,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
    };

    const targetTransaction = {
      id: (Date.now() + 1).toString(),
      type: 'income', // Transfer in is always income to destination account
      amount: transfer.amount,
      category: 'Transfer Saldo',
      description: transfer.description || `Transfer dari ${getAccountName(transfer.from)}`,
      paymentMethod: transfer.to,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
    };

    addTransaction(sourceTransaction);
    addTransaction(targetTransaction);
    addXP(5);
  };

  // Helper function to get account name for display
  const getAccountName = (accountType) => {
    if (accountType === 'cash') return 'Tunai';
    if (accountType === 'digital') return 'Digital';

    const bankAccount = bankAccounts.find(acc => acc.id === accountType);
    return bankAccount ? bankAccount.name : accountType;
  };

  // Enhanced transaction handler with achievement checking
  const handleAddTransaction = (transaction) => {
    addTransaction(transaction);
    addXP(5);
    checkAchievement("First Transaction");
    
    // Check for budget achievements
    const budgetCount = Object.keys(budgets).length;
    if (budgetCount >= 5) {
      checkAchievement("Budget Master");
    }
  };

  // Enhanced budget handler with achievement checking
  const handleSetBudget = (category, limit) => {
    setBudget(category, parseFloat(limit));
    toast.success(`Budget set successfully!`);
    addXP(10);
    
    // Check for budget achievements
    const budgetCount = Object.keys(budgets).length;
    if (budgetCount >= 5) {
      checkAchievement("Budget Master");
    }
  };

  // Enhanced recurring transaction handler
  const handleAddRecurring = (recurringData) => {
    addRecurring(recurringData);
    addXP(15);
    checkAchievement("First Transaction");
  };

  // Check for budget alerts
  useEffect(() => {
    const alerts = [];
    Object.entries(budgets).forEach(([category, limit]) => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = (spent / limit) * 100;
      
      if (percentage >= 80) {
        alerts.push({ category, spent, limit, percentage });
      }
    });
    
    if (alerts.length > 0) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [transactions, budgets]);

  // Check for savings achievement
  useEffect(() => {
    if (totalIncome > 0) {
      const savingsPercentage = (balance / totalIncome) * 100;
      if (savingsPercentage >= 20) {
        checkAchievement("Savings Hero");
      }
    }
  }, [balance, totalIncome]);

  // Check for debt free achievement
  useEffect(() => {
    const installmentStats = getTotalStatistics();
    if (installmentStats.totalDebt === 0 && installments.length > 0) {
      checkAchievement("Debt Free");
    }
  }, [installments, getTotalStatistics]);

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
        setShowBankAccountManager={setShowBankAccountManager}
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
          digitalIncome={digitalIncome}
          digitalExpense={digitalExpense}
          cashBalance={cashBalance}
          digitalBalance={digitalBalance}
          dailyAverage={dailyAverage}
          totalDebt={totalDebt}
          installmentStats={installmentStats}
          bankAccountBalances={bankAccountBalances}
        />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content Area */}
        {activeTab === "overview" && (
          <OverviewTab 
            transactions={transactions}
            budgets={budgets}
            recurringTransactions={recurringTransactions}
            balance={balance}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
          />
        )}
        {activeTab === "budget" && (
          <BudgetTab 
            budgets={budgets}
            transactions={transactions}
            onSetBudget={handleSetBudget}
            onDeleteBudget={handleDeleteBudget}
            onOpenBudgetModal={() => setShowBudgetModal(true)}
          />
        )}
        {activeTab === "installments" && <InstallmentManager />}
        {activeTab === "recurring" && (
          <RecurringTab 
            recurringTransactions={recurringTransactions}
            onAddRecurring={addRecurring}
            onDeleteRecurring={handleDeleteRecurring}
            onOpenRecurringModal={() => setShowAddModal(true)}
            setTransactionType={setTransactionType}
          />
        )}
        {activeTab === "transactions" && (
          <TransactionsTab 
            transactions={transactions}
            onDeleteTransaction={deleteTransaction}
            onOpenAddModal={() => setShowAddModal(true)}
            setTransactionType={setTransactionType}
          />
        )}
        {activeTab === "achievements" && (
          <AchievementsTab 
            achievements={achievements}
            userStats={userStats}
          />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab 
            transactions={transactions}
            budgets={budgets}
            installments={installments}
            getTotalStatistics={getTotalStatistics}
          />
        )}
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTransaction}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />

      <BudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSubmit={handleSetBudget}
        budgets={budgets}
        transactions={transactions}
      />

      <CashAccountModal
        isOpen={showCashAccountModal}
        onClose={() => setShowCashAccountModal(false)}
        onSubmit={handleCashAccountTransaction}
        currentBalance={cashIncome - cashExpense}
        bankAccounts={bankAccounts}
      />

      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSubmit={handleTransfer}
        cashBalance={cashIncome - cashExpense}
        digitalBalance={digitalBalance}
        bankAccountBalances={bankAccountBalances}
        transactions={transactions}
      />

      <AddRecurringModal
        isOpen={showAddModal && activeTab === "recurring"}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddRecurring}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />

      {/* Bank Account Manager Modal */}
      <BankAccountManager
        isOpen={showBankAccountManager}
        onClose={() => setShowBankAccountManager(false)}
        bankAccounts={bankAccounts}
        setBankAccounts={setBankAccounts}
      />

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

export default FinanceApp;
