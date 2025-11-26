import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import components
import { Header } from './components/layout';
import { NavigationTabs } from './components/layout';
import { Notification } from './components/layout';
import { UserLevelBanner } from './components/layout';
import { InstallmentManager } from './components/features/installments';
import BalanceCard from './components/ui/BalanceCard';
import { LoginForm, RegisterForm } from './components/auth';

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
 * Main Finance Application Component with Authentication
 * Manages authentication state and wraps the main app with auth context
 */

const FinanceAppContent = () => {
  const { user, userProfile, loading, signOut } = useAuth();

  // Authentication state
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register'

  // Custom hooks (only when authenticated)
  const [hideBalance, setHideBalance] = useLocalStorage("hideBalance", false);
  const { transactions, addTransaction, deleteTransaction, updateTransaction, setTransactions } = useTransactions();
  const { budgets, setBudget, deleteBudget, setBudgets } = useBudgets();
  const { recurringTransactions, addRecurring, deleteRecurring, setRecurringTransactions } = useRecurring();
  const { achievements, unlockAchievement, setAchievements } = useAchievements();
  const { installments, addInstallment, makePayment, getTotalStatistics, setInstallments } = useInstallments();
  const { userStats, addXP, setUserStats } = useGamification();

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showCashAccountModal, setShowCashAccountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showBankAccountManager, setShowBankAccountManager] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showNotification, setShowNotification] = useState(false);
  const [showAchievementNotification, setShowAchievementNotification] = useState(null);

  // Bank accounts state
  const [bankAccounts, setBankAccounts] = useLocalStorage("bankAccounts", [
    { id: "default", name: "Rekening Digital", bankName: "Digital Wallet", accountName: "Pribadi", accountNumber: "****" }
  ]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  // Show authentication forms if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {authMode === 'login' ? (
            <LoginForm 
              onSwitchToRegister={() => setAuthMode('register')}
              onSwitchToReset={() => toast.info('Fitur reset password akan segera hadir')}
            />
          ) : (
            <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  // Calculate derived values (only when authenticated)
  const totalIncome = transactions
    .filter((t) => t.type === "income" && !t.isTransfer)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense" && !t.isTransfer)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate cash and digital transaction totals
  const cashIncome = transactions
    .filter((t) => t.type === "income" && t.paymentMethod === "cash" && !t.isTransfer)
    .reduce((sum, t) => sum + t.amount, 0);

  const cashExpense = transactions
    .filter((t) => t.type === "expense" && t.paymentMethod === "cash" && !t.isTransfer)
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate digital income and expense from all bank accounts
  const digitalIncome = transactions
    .filter((t) => t.type === "income" && !t.isTransfer && (
      t.paymentMethod === "digital" ||
      bankAccounts.some(acc => acc.id === t.paymentMethod)
    ))
    .reduce((sum, t) => sum + t.amount, 0);

  const digitalExpense = transactions
    .filter((t) => t.type === "expense" && !t.isTransfer && (
      t.paymentMethod === "digital" ||
      bankAccounts.some(acc => acc.id === t.paymentMethod)
    ))
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate balances
  const cashBalance = cashIncome - cashExpense;

  // Calculate bank account balances if available
  const bankAccountBalances = bankAccounts.map(account => {
    const accountIncome = transactions
      .filter((t) => t.type === "income" && t.paymentMethod === account.id && !t.isTransfer)
      .reduce((sum, t) => sum + t.amount, 0);

    const accountExpense = transactions
      .filter((t) => t.type === "expense" && t.paymentMethod === account.id && !t.isTransfer)
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
  const digitalBalance = totalBankBalance;

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
        setTransactions(data.transactions);
        setBudgets(data.budgets);
        setRecurringTransactions(data.recurringTransactions);
        setInstallments(data.installments);
        setUserStats(data.userStats);
        setAchievements(data.achievements);
      });
      toast.success('Data imported successfully!');
      addXP(100);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteBudget = (category) => {
    const shouldDelete = window.confirm(`Are you sure you want to delete budget for "${category}"?`);
    if (!shouldDelete) return;
    deleteBudget(category);
    toast.success(`Budget for ${category} deleted successfully!`);
  };

  const handleDeleteRecurring = (recurringId) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this recurring transaction? This action cannot be undone.");
    if (!shouldDelete) return;
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
    let paymentMethod = 'cash';

    if (transaction.accountType === 'bank' && transaction.bankAccountId) {
      paymentMethod = transaction.bankAccountId;
    }

    if (transaction.type === 'add') {
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
    // Validate transfer input
    const validationError = validateTransfer(transfer);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Calculate source balance
    const sourceBalance = calculateAccountBalance(transfer.from);
    
    // Check if source has sufficient balance
    if (transfer.amount > sourceBalance) {
      toast.error('Saldo tidak mencukupi untuk transfer');
      return;
    }

    // Create transfer transactions
    const timestamp = new Date().toISOString();
    const date = timestamp.split('T')[0];
    const sourceTransaction = {
      id: `transfer_${Date.now()}_out`, // More descriptive ID to avoid conflicts
      type: 'expense',
      amount: transfer.amount,
      category: 'Transfer Saldo',
      description: transfer.description || `Transfer ke ${getAccountName(transfer.to)}`,
      paymentMethod: transfer.from,
      date,
      timestamp,
      isTransfer: true, // Mark as transfer transaction
    };

    const targetTransaction = {
      id: `transfer_${Date.now()}_in`, // More descriptive ID to avoid conflicts
      type: 'income',
      amount: transfer.amount,
      category: 'Transfer Saldo',
      description: transfer.description || `Transfer dari ${getAccountName(transfer.from)}`,
      paymentMethod: transfer.to,
      date,
      timestamp,
      isTransfer: true, // Mark as transfer transaction
    };

    // Add both transactions
    addTransaction(sourceTransaction);
    addTransaction(targetTransaction);
    
    toast.success(`Transfer sebesar ${formatCurrency(transfer.amount)} berhasil dilakukan`);
    addXP(5);
  };

  // Helper function to validate transfer input
  const validateTransfer = (transfer) => {
    if (!transfer.amount || transfer.amount <= 0) {
      return 'Jumlah transfer harus lebih besar dari 0';
    }
    
    if (transfer.from === transfer.to) {
      return 'Akun sumber dan tujuan tidak boleh sama';
    }
    
    return null; // No validation error
  };

  // Helper function to calculate account balance
  const calculateAccountBalance = (accountType) => {
    const accountTransactions = transactions.filter(t => 
      !t.isTransfer && t.paymentMethod === accountType
    );
    
    const income = accountTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = accountTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return income - expense;
  };

  const getAccountName = (accountType) => {
    if (accountType === 'cash') return 'Tunai';
    if (accountType === 'digital') return 'Digital';

    const bankAccount = bankAccounts.find(acc => acc.id === accountType);
    return bankAccount ? bankAccount.name : accountType;
  };

  const handleAddTransaction = (transaction) => {
    if (!transaction.amount || transaction.amount <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    if (!transaction.category) {
      toast.error('Category is required');
      return;
    }

    if (!transaction.paymentMethod) {
      toast.error('Payment method is required');
      return;
    }

    addTransaction(transaction);
    addXP(5);
    checkAchievement("First Transaction");

    const budgetCount = Object.keys(budgets).length;
    if (budgetCount >= 5) {
      checkAchievement("Budget Master");
    }
  };

  const handleSetBudget = (category, limit) => {
    setBudget(category, parseFloat(limit));
    toast.success(`Budget set successfully!`);
    addXP(10);
    
    const budgetCount = Object.keys(budgets).length;
    if (budgetCount >= 5) {
      checkAchievement("Budget Master");
    }
  };

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
        user={user}
        userProfile={userProfile}
        onSignOut={signOut}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        {/* User Level Banner */}
        <UserLevelBanner userStats={userStats} />

        {/* Main Balance Card */}
        <BalanceCard
          transactions={transactions}
          bankAccountBalances={bankAccountBalances}
          hideBalance={hideBalance}
          setHideBalance={setHideBalance}
          onAddCash={() => setShowCashAccountModal(true)}
          onTransfer={() => setShowTransferModal(true)}
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
            cashBalance={cashBalance}
            digitalBalance={digitalBalance}
            bankAccountBalances={bankAccountBalances}
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
        bankAccounts={bankAccounts}
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
        bankAccounts={bankAccounts}
      />

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
              background: '#d1fae5',
              color: '#065f46',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#b91c1c',
            },
          },
          custom: {
            style: {
              background: '#f0f9ff',
              color: '#1d4ed8',
            },
          },
        }}
      />
    </>
  );
};

// Main App Component with Auth Provider
const FinanceApp = () => {
  return (
    <AuthProvider>
      <FinanceAppContent />
    </AuthProvider>
  );
};

export default FinanceApp;
