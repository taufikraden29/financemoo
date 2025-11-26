import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  PieChart,
  DollarSign,
  CreditCard,
  ShoppingBag,
  Home,
  Coffee,
  Car,
  Heart,
  Smartphone,
  MoreHorizontal,
  Filter,
  Download,
  Target,
  Bell,
  Award,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
  Repeat,
  Users,
  Trophy,
  Star,
  Gift,
  TrendingUpDown,
  CheckCircle,
  XCircle,
  ChevronDown,
} from "lucide-react";

// Import the new installment components
import { InstallmentManager } from './components/features/installments';

const FinanceApp = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [paymentMethod, setPaymentMethod] = useState("cash"); // cash or digital
  const [hideBalance, setHideBalance] = useState(false);

  // Cash Account Management
  const [cashAccounts, setCashAccounts] = useState(() => {
    const saved = localStorage.getItem('cashAccounts');
    return saved ? JSON.parse(saved) : [
      { id: 'main-cash', name: 'Dompet Utama', balance: 0, type: 'cash' }
    ];
  });
  const [showCashAccountModal, setShowCashAccountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [cashAccountForm, setCashAccountForm] = useState({
    name: '',
    initialBalance: 0
  });
  const [transferForm, setTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: 0,
    description: ''
  });

  // Functions for cash account management
  const handleAddCashAccount = () => {
    if (!cashAccountForm.name || parseFloat(cashAccountForm.initialBalance) < 0) return;

    const newAccount = {
      id: `cash-${Date.now()}`,
      name: cashAccountForm.name,
      balance: parseFloat(cashAccountForm.initialBalance),
      type: 'cash'
    };

    setCashAccounts([...cashAccounts, newAccount]);
    setCashAccountForm({ name: '', initialBalance: 0 });
    setShowCashAccountModal(false);

    // Show success toast
    toast.success(`Cash account added successfully!`);
  };

  const handleCashTransfer = () => {
    if (!transferForm.fromAccount || !transferForm.toAccount ||
      parseFloat(transferForm.amount) <= 0 ||
      transferForm.fromAccount === transferForm.toAccount) return;

    const fromAccount = cashAccounts.find(acc => acc.id === transferForm.fromAccount);
    const toAccount = cashAccounts.find(acc => acc.id === transferForm.toAccount);

    if (!fromAccount || !toAccount) return;
    if (fromAccount.balance < parseFloat(transferForm.amount)) return;

    // Update cash accounts
    setCashAccounts(cashAccounts.map(account => {
      if (account.id === fromAccount.id) {
        return { ...account, balance: account.balance - parseFloat(transferForm.amount) };
      }
      if (account.id === toAccount.id) {
        return { ...account, balance: account.balance + parseFloat(transferForm.amount) };
      }
      return account;
    }));

    // Reset form and close modal
    setTransferForm({
      fromAccount: '',
      toAccount: '',
      amount: 0,
      description: ''
    });
    setShowTransferModal(false);

    // Show success toast
    toast.success(`Transfer completed successfully!`);
  };

  // Delete a cash account
  const handleDeleteCashAccount = (accountId) => {
    // Don't allow deleting if the account has a balance
    const accountToDelete = cashAccounts.find(acc => acc.id === accountId);
    if (accountToDelete && accountToDelete.balance > 0) {
      toast.error(`Cannot delete account "${accountToDelete.name}" because it has a balance of ${formatCurrency(accountToDelete.balance)}. Please transfer the balance first.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the cash account "${accountToDelete?.name}"? This action cannot be undone.`)) {
      return;
    }

    // Remove the cash account
    setCashAccounts(prevAccounts =>
      prevAccounts.filter(account => account.id !== accountId)
    );

    // Show success toast
    toast.success(`Cash account deleted successfully!`);
  };

  const [showNotification, setShowNotification] = useState(false);
  const [showAchievementNotification, setShowAchievementNotification] = useState(null);

  // Initialize state from localStorage
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : {};
  });

  const [savingsGoal, setSavingsGoal] = useState(() => {
    const saved = localStorage.getItem('savingsGoal');
    return saved ? JSON.parse(saved) : {
      target: 0,
      current: 0,
      name: "",
      deadline: "",
    };
  });

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash", // cash or digital
    cashAccount: cashAccounts[0]?.id || '', // Default to first cash account
  });

  const [budgetForm, setBudgetForm] = useState({
    category: "",
    limit: "",
  });

  // Recurring Transactions State
  const [recurringTransactions, setRecurringTransactions] = useState(() => {
    const saved = localStorage.getItem('recurringTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [recurringForm, setRecurringForm] = useState({
    amount: "",
    category: "",
    description: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    cashAccount: cashAccounts[0]?.id || '', // Default to first cash account
  });

  // Gamification State
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalTransactions: 0,
      streakDays: 0,
      coinsEarned: 0,
      creditScore: 300, // Start with a basic credit score (300-850 range)
    };
  });

  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "First Transaction", description: "Add your first transaction", unlocked: false, icon: "Star", reward: 50 },
      { id: 2, name: "Budget Master", description: "Set budget for 5 categories", unlocked: false, icon: "Target", reward: 100 },
      { id: 3, name: "Savings Hero", description: "Save 20% of income", unlocked: false, icon: "Trophy", reward: 150 },
      { id: 4, name: "Debt Free", description: "Pay off all debts", unlocked: false, icon: "CheckCircle", reward: 200 },
      { id: 5, name: "Consistent Tracker", description: "7-day tracking streak", unlocked: false, icon: "Zap", reward: 100 },
      { id: 6, name: "Budget Guardian", description: "Stay under budget for 3 months", unlocked: false, icon: "Award", reward: 250 },
    ];
  });

  const categories = {
    income: [
      { name: "Gaji", icon: "DollarSign" },
      { name: "Freelance", icon: "TrendingUp" },
      { name: "Investasi", icon: "TrendingUp" },
      { name: "Lainnya", icon: "MoreHorizontal" },
    ],
    expense: [
      { name: "Makanan", icon: "ShoppingBag" },
      { name: "Transport", icon: "Car" },
      { name: "Hiburan", icon: "Coffee" },
      { name: "Tagihan", icon: "CreditCard" },
      { name: "Belanja", icon: "ShoppingBag" },
      { name: "Kesehatan", icon: "Heart" },
      { name: "Gadget", icon: "Smartphone" },
      { name: "Rumah", icon: "Home" },
      { name: "Lainnya", icon: "MoreHorizontal" },
    ],
  };

  // Save data to localStorage when states change
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('savingsGoal', JSON.stringify(savingsGoal));
  }, [savingsGoal]);

  useEffect(() => {
    localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));
  }, [recurringTransactions]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('cashAccounts', JSON.stringify(cashAccounts));
  }, [cashAccounts]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Cash flow calculations
  const cashIncome = transactions
    .filter((t) => t.type === "income" && t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.amount, 0);

  const cashExpense = transactions
    .filter((t) => t.type === "expense" && t.paymentMethod === "cash")
    .reduce((sum, t) => sum + t.amount, 0);

  const digitalIncome = transactions
    .filter((t) => t.type === "income" && t.paymentMethod === "digital")
    .reduce((sum, t) => sum + t.amount, 0);

  const digitalExpense = transactions
    .filter((t) => t.type === "expense" && t.paymentMethod === "digital")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total cash balance from all cash accounts
  const cashBalance = cashAccounts.reduce((sum, account) => sum + account.balance, 0);
  const digitalBalance = digitalIncome - digitalExpense;

  // Check budget warnings
  useEffect(() => {
    const warnings = Object.entries(budgets).filter(([cat, data]) => {
      const percentage = (data.spent / data.limit) * 100;
      return percentage >= 80;
    });

    if (warnings.length > 0 && !showNotification) {
      toast.error(`Ada kategori yang hampir melebihi budget!`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [transactions]);

  const formatCurrency = (amount) => {
    if (hideBalance) return "Rp ••••";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.category) return;

    const newTransaction = {
      id: Date.now(),
      type: transactionType,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      paymentMethod: paymentMethod, // Use state variable
      icon:
        categories[transactionType].find((c) => c.name === formData.category)
          ?.icon || "MoreHorizontal",
    };

    // If it's cash, update the selected cash account
    let updatedCashAccounts = [...cashAccounts];
    if (paymentMethod === "cash" && formData.cashAccount) {
      const accountIndex = updatedCashAccounts.findIndex(acc => acc.id === formData.cashAccount);
      if (accountIndex !== -1) {
        if (transactionType === "income") {
          updatedCashAccounts[accountIndex] = {
            ...updatedCashAccounts[accountIndex],
            balance: updatedCashAccounts[accountIndex].balance + parseFloat(formData.amount)
          };
        } else if (transactionType === "expense") {
          updatedCashAccounts[accountIndex] = {
            ...updatedCashAccounts[accountIndex],
            balance: Math.max(0, updatedCashAccounts[accountIndex].balance - parseFloat(formData.amount))
          };
        }
        setCashAccounts(updatedCashAccounts);
      }
    }

    // Check for first transaction achievement
    const isFirstTransaction = transactions.length === 0;

    setTransactions([newTransaction, ...transactions]);

    // Update budget if expense
    if (transactionType === "expense") {
      setBudgets(prevBudgets => ({
        ...prevBudgets,
        [formData.category]: {
          limit: prevBudgets[formData.category]?.limit || 0, // Keep existing limit or default to 0
          spent: (prevBudgets[formData.category]?.spent || 0) + parseFloat(formData.amount), // Add to existing spent amount or start from 0
        },
      }));
    }

    setShowAddModal(false);
    setFormData({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      cashAccount: cashAccounts[0]?.id || '',
    });

    // Show success toast
    toast.success(`Transaction added successfully!`);

    // Add XP for adding transaction
    addXP(15);

    // Update user stats
    setUserStats(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1
    }));

    // Check for first transaction achievement
    if (isFirstTransaction) {
      checkAchievement("First Transaction");
    }
  };

  const handleSetBudget = () => {
    if (!budgetForm.category || !budgetForm.limit) return;

    setBudgets({
      ...budgets,
      [budgetForm.category]: {
        limit: parseFloat(budgetForm.limit),
        spent: budgets[budgetForm.category]?.spent || 0,
      },
    });

    setShowBudgetModal(false);
    setBudgetForm({ category: "", limit: "" });

    // Show success toast
    toast.success(`Budget set successfully!`);
  };

  // Delete a budget
  const handleDeleteBudget = (category) => {
    if (!window.confirm(`Are you sure you want to delete the budget for "${category}"? This action cannot be undone.`)) {
      return;
    }

    setBudgets(prevBudgets => {
      const newBudgets = { ...prevBudgets };
      delete newBudgets[category];
      return newBudgets;
    });

    // Show success toast
    toast.success(`Budget for ${category} deleted successfully!`);
  };

  // Recurring Transaction Functions
  const handleAddRecurring = () => {
    if (!recurringForm.amount || !recurringForm.category) return;

    const newRecurring = {
      id: Date.now(),
      type: transactionType,
      amount: parseFloat(recurringForm.amount),
      category: recurringForm.category,
      description: recurringForm.description,
      frequency: recurringForm.frequency,
      startDate: recurringForm.startDate,
      nextDate: calculateNextDate(recurringForm.startDate, recurringForm.frequency),
      isActive: true,
      paymentMethod: paymentMethod, // Use state variable
      cashAccount: recurringForm.cashAccount || cashAccounts[0]?.id, // Include selected cash account
      icon: categories[transactionType].find((c) => c.name === recurringForm.category)?.icon || "MoreHorizontal",
    };

    // If it's cash, recurring transaction will affect the selected cash account when it occurs
    // For now, just add transaction to the list
    setRecurringTransactions([...recurringTransactions, newRecurring]);
    setShowRecurringModal(false);
    setRecurringForm({
      amount: "",
      category: "",
      description: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      paymentMethod: "cash",
      cashAccount: cashAccounts[0]?.id || '',
    });

    // Show success toast
    toast.success(`Recurring transaction added successfully!`);

    addXP(25);
  };

  const calculateNextDate = (startDate, frequency) => {
    const date = new Date(startDate);
    if (frequency === "daily") date.setDate(date.getDate() + 1);
    else if (frequency === "weekly") date.setDate(date.getDate() + 7);
    else if (frequency === "monthly") date.setMonth(date.getMonth() + 1);
    else if (frequency === "yearly") date.setFullYear(date.getFullYear() + 1);
    return date.toISOString().split("T")[0];
  };

  const toggleRecurring = (id) => {
    setRecurringTransactions(
      recurringTransactions.map((rt) =>
        rt.id === id ? { ...rt, isActive: !rt.isActive } : rt
      )
    );
  };

  // Delete a recurring transaction
  const handleDeleteRecurring = (recurringId) => {
    if (!window.confirm("Are you sure you want to delete this recurring transaction? This action cannot be undone.")) {
      return;
    }

    setRecurringTransactions(prevRecurrings =>
      prevRecurrings.filter(rt => rt.id !== recurringId)
    );

    // Show success toast
    toast.success(`Recurring transaction deleted successfully!`);
  };

  // Gamification Functions
  const addXP = (amount) => {
    setUserStats((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / prev.xpToNextLevel) + prev.level;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        showAchievementPopup({ name: `Level ${newLevel} Reached!`, reward: 100, icon: "Trophy" });
      }

      return {
        ...prev,
        xp: newXP % prev.xpToNextLevel,
        level: newLevel,
        coinsEarned: prev.coinsEarned + amount,
      };
    });
  };

  const checkAchievement = (achievementName) => {
    const achievement = achievements.find((a) => a.name === achievementName && !a.unlocked);
    if (achievement) {
      setAchievements(
        achievements.map((a) =>
          a.name === achievementName ? { ...a, unlocked: true } : a
        )
      );
      showAchievementPopup(achievement);
      addXP(achievement.reward);
    }
  };

  const showAchievementPopup = (achievement) => {
    toast.success(`🎉 Achievement Unlocked: ${achievement.name} (+${achievement.reward} XP)`);
    setShowAchievementNotification(achievement);
    setTimeout(() => setShowAchievementNotification(null), 4000);
  };

  // Export Data Function
  const handleExportData = () => {
    const exportData = {
      transactions,
      budgets,
      recurringTransactions,
      savingsGoal,
      userStats,
      achievements,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `moneypro-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    // Show success toast
    toast.success('Data exported successfully!');

    addXP(50);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      DollarSign,
      TrendingUp,
      TrendingDown,
      ShoppingBag,
      Car,
      Coffee,
      CreditCard,
      Heart,
      Smartphone,
      Home,
      MoreHorizontal,
      Target,
      Repeat,
      Users,
      Trophy,
      Star,
      Gift,
      Award,
      Zap,
      CheckCircle,
      XCircle,
    };
    return icons[iconName] || MoreHorizontal;
  };

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topExpenses = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Financial insights
  const savingsRate = ((balance / totalIncome) * 100).toFixed(1);
  const dailyAverage = (totalExpense / 30).toFixed(0);
  const savingsProgress = (
    (savingsGoal.current / savingsGoal.target) *
    100
  ).toFixed(1);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20 md:pb-8">
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
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3 md:py-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 md:p-2 rounded-lg md:rounded-xl">
                  <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-gray-900">
                    MoneyTrack
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Kelola keuanganmu dengan mudah
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportData}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Export Data"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setHideBalance(!hideBalance)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {hideBalance ? (
                    <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {/* Cash Management Buttons */}
                <button
                  onClick={() => setShowCashAccountModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Tambah Dompet Cash"
                >
                  <Wallet className="w-5 h-5 text-green-600" />
                </button>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Transfer Cash"
                >
                  <Repeat className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl flex items-center space-x-1 md:space-x-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-medium text-sm md:text-base">Tambah</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
          {/* User Level Banner */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-4 mb-4 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Level {userStats.level}</p>
                  <p className="text-2xl font-bold">{userStats.coinsEarned} Coins</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">XP Progress</p>
                <p className="font-bold">{userStats.xp} / {userStats.xpToNextLevel}</p>
                <div className="w-32 bg-white/30 rounded-full h-2 mt-1">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(userStats.xp / userStats.xpToNextLevel) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-8">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 md:hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-indigo-100 text-xs md:text-sm font-medium">
                  Total Saldo
                </p>
                <Wallet className="w-4 h-4 md:w-5 md:h-5 text-indigo-200" />
              </div>
              <p className="text-2xl md:text-3xl font-bold mb-1">
                {formatCurrency(balance)}
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
                {formatCurrency(totalIncome)}
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
                {formatCurrency(totalExpense)}
              </p>
              <p className="text-red-600 text-xs font-medium">
                ≈ {formatCurrency(dailyAverage)}/hari
              </p>
            </div>

            {/* Cash Balance Card */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 md:hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-xs md:text-sm font-medium">
                  Cash Balance
                </p>
                <Wallet className="w-4 h-4 md:w-5 md:h-5 text-green-200" />
              </div>
              <p className="text-2xl md:text-3xl font-bold mb-1">
                {formatCurrency(cashBalance)}
              </p>
              <p className="text-green-200 text-xs flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Cash: {formatCurrency(cashIncome)} in, {formatCurrency(cashExpense)} out
              </p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
              <Zap className="w-5 h-5 mb-2" />
              <p className="text-xs opacity-90">Target Bulan Ini</p>
              <p className="text-lg md:text-xl font-bold">
                {hideBalance ? "••%" : `${savingsRate}%`}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
              <Award className="w-5 h-5 mb-2" />
              <p className="text-xs opacity-90">Transaksi</p>
              <p className="text-lg md:text-xl font-bold">
                {transactions.length}
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl p-4 text-white shadow-lg col-span-2">
              <Target className="w-5 h-5 mb-2" />
              <p className="text-xs opacity-90">Savings Goal Progress</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>
                    {hideBalance ? "•••" : formatCurrency(savingsGoal.current)}
                  </span>
                  <span>{hideBalance ? "••%" : `${savingsProgress}%`}</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${savingsProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 mb-4 md:mb-6 p-1 md:p-2">
          <div className="grid grid-cols-6 gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "overview"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "budget"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab("installments")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "installments"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Cicilan
            </button>
            <button
              onClick={() => setActiveTab("recurring")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "recurring"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Rutin
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "transactions"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Transaksi
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "achievements"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Awards
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === "analytics"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                }`}
            >
              Analitik
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "overview" && (
          <div className="space-y-4 md:space-y-6">
            {/* Cash Accounts Overview */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl">
              <h3 className="text-base md:text-lg font-bold mb-3 flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Dompet Cash
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {cashAccounts.length > 0 ? (
                  cashAccounts.map((account) => (
                    <div key={account.id} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs opacity-90 mb-1 truncate">{account.name}</p>
                        <p className="font-bold text-sm md:text-base">
                          {formatCurrency(account.balance)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteCashAccount(account.id)}
                        className="text-red-300 hover:text-red-100 p-1"
                        title="Delete Cash Account"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 col-span-2 text-center">
                    <p className="text-xs opacity-90">Belum ada dompet cash</p>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Insights */}
            <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-xl">
              <h3 className="text-base md:text-lg font-bold mb-3 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Financial Insights
              </h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs opacity-90 mb-1">Status Keuangan</p>
                  <p className="font-bold text-sm md:text-base">
                    {savingsRate > 20
                      ? "🎉 Excellent!"
                      : savingsRate > 10
                        ? "👍 Good!"
                        : "⚠️ Need Improvement"}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs opacity-90 mb-1">Rekomendasi</p>
                  <p className="font-bold text-sm md:text-base">
                    {savingsRate > 20 ? "Invest more!" : "Kurangi expenses"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center">
                <PieChart className="w-4 h-4 md:w-5 md:h-5 mr-2 text-indigo-600" />
                Pengeluaran Teratas
              </h3>
              <div className="space-y-2 md:space-y-3">
                {topExpenses.map(([category, amount], index) => {
                  const percentage = (amount / totalExpense) * 100;
                  return (
                    <div
                      key={category}
                      className="group hover:bg-gray-50 active:bg-gray-100 rounded-lg md:rounded-xl p-2 md:p-3 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-1.5 md:mb-2">
                        <span className="font-medium text-sm md:text-base text-gray-900">
                          {category}
                        </span>
                        <span className="font-bold text-sm md:text-base text-gray-900">
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 md:h-2 rounded-full transition-all duration-500 group-hover:shadow-md"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {percentage.toFixed(1)}% dari total
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                Transaksi Terbaru
              </h3>
              <div className="space-y-2 md:space-y-3">
                {transactions.slice(0, 5).map((transaction) => {
                  const Icon = getIconComponent(transaction.icon);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-2 md:p-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg md:rounded-xl transition-all duration-200 border border-transparent hover:border-indigo-100"
                    >
                      <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
                        <div
                          className={`p-2 md:p-3 rounded-lg md:rounded-xl flex-shrink-0 ${transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                            }`}
                        >
                          <Icon
                            className={`w-4 h-4 md:w-5 md:h-5 ${transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                              }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                              {transaction.category}
                            </p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${transaction.paymentMethod === "cash"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                              }`}>
                              {transaction.paymentMethod === "cash" ? "C" : "D"}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-500 truncate">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 md:mt-1 hidden sm:block">
                            {new Date(transaction.date).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 sm:hidden">
                            {new Date(transaction.date).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p
                            className={`font-bold text-sm md:text-lg ${transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                              }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500 hidden sm:block">
                            {new Date(transaction.date).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            // If it's a cash transaction, we need to adjust the cash account balance
                            if (transaction.paymentMethod === "cash" && transaction.cashAccount) {
                              setCashAccounts(prevAccounts =>
                                prevAccounts.map(account => {
                                  if (account.id === transaction.cashAccount) {
                                    // Adjust balance based on transaction type
                                    const newBalance = transaction.type === "income"
                                      ? account.balance - transaction.amount // Remove income
                                      : account.balance + transaction.amount; // Add back expense

                                    return {
                                      ...account,
                                      balance: Math.max(0, newBalance) // Prevent negative balance
                                    };
                                  }
                                  return account;
                                })
                              );
                            }

                            // If it's a budgeted expense, adjust the budget
                            if (transaction.type === "expense" && transaction.category) {
                              setBudgets(prevBudgets => ({
                                ...prevBudgets,
                                [transaction.category]: {
                                  limit: prevBudgets[transaction.category]?.limit || 0,
                                  spent: Math.max(0, (prevBudgets[transaction.category]?.spent || 0) - transaction.amount)
                                }
                              }));
                            }

                            // Remove the transaction
                            setTransactions(prevTransactions =>
                              prevTransactions.filter(t => t.id !== transaction.id)
                            );
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Delete Transaction"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Budget Tracker
              </h2>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center space-x-2 text-sm md:text-base hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Set Budget</span>
              </button>
            </div>

            {Object.entries(budgets).map(([category, data]) => {
              const percentage = (data.spent / data.limit) * 100;
              const remaining = data.limit - data.spent;
              const isWarning = percentage >= 80;

              return (
                <div
                  key={category}
                  className={`bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-4 md:p-6 transition-all ${isWarning
                    ? "border-orange-300 bg-orange-50"
                    : "border-gray-100"
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${isWarning ? "bg-orange-200" : "bg-indigo-100"
                          }`}
                      >
                        <Target
                          className={`w-5 h-5 ${isWarning ? "text-orange-600" : "text-indigo-600"
                            }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-base md:text-lg text-gray-900">
                          {category}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {hideBalance ? "••••" : formatCurrency(remaining)}{" "}
                          tersisa
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isWarning && (
                        <div className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          ⚠️ {percentage.toFixed(0)}%
                        </div>
                      )}
                      <button
                        onClick={() => handleDeleteBudget(category)}
                        className="bg-red-100 text-red-600 p-1 rounded-lg hover:bg-red-200"
                        title="Delete Budget"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Spent:{" "}
                        {hideBalance ? "••••" : formatCurrency(data.spent)}
                      </span>
                      <span className="text-gray-600">
                        Limit:{" "}
                        {hideBalance ? "••••" : formatCurrency(data.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${isWarning
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600"
                          }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{percentage.toFixed(1)}% used</span>
                      <span>{(100 - percentage).toFixed(1)}% remaining</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Budget Tips */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
              <h3 className="font-bold text-base md:text-lg mb-2 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Budget Tips 💡
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>
                    Gunakan metode 50/30/20: 50% kebutuhan, 30% keinginan, 20%
                    tabungan
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>
                    Review budget setiap minggu untuk tracking yang lebih baik
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>
                    Set alert saat budget mencapai 80% untuk menghindari
                    overspending
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Installments Tab - New System */}
        {activeTab === "installments" && (
          <InstallmentManager />
        )}

        {activeTab === "recurring" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Recurring Transactions
              </h2>
              <button
                onClick={() => setShowRecurringModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center space-x-2 text-sm md:text-base hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Recurring</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recurringTransactions.map((recurring) => {
                const Icon = getIconComponent(recurring.icon);
                return (
                  <div
                    key={recurring.id}
                    className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${recurring.isActive ? "border-green-200" : "border-gray-200 opacity-60"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-3 rounded-xl ${recurring.type === "income" ? "bg-green-100" : "bg-red-100"
                            }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${recurring.type === "income" ? "text-green-600" : "text-red-600"
                              }`}
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {recurring.category}
                          </h3>
                          <p className="text-sm text-gray-600">{recurring.description}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleRecurring(recurring.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${recurring.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {recurring.isActive ? "Active" : "Paused"}
                        </button>
                        <button
                          onClick={() => handleDeleteRecurring(recurring.id)}
                          className="p-1 rounded-full text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200"
                          title="Delete Recurring Transaction"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Amount</span>
                        <span
                          className={`text-2xl font-bold ${recurring.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {recurring.type === "income" ? "+" : "-"}
                          {formatCurrency(recurring.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Frequency</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {recurring.frequency}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Next Date</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(recurring.nextDate).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Repeat className="w-4 h-4" />
                        <span>
                          Started on {new Date(recurring.startDate).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                About Recurring Transactions 💡
              </h3>
              <p className="text-sm opacity-90">
                Recurring transactions help you track regular income and expenses like salary, rent, subscriptions, and bills.
                They automatically remind you of upcoming payments!
              </p>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900">
                Semua Transaksi
              </h3>
              <button className="flex items-center space-x-1 md:space-x-2 text-indigo-600 hover:text-indigo-700 active:text-indigo-800 font-medium text-sm md:text-base">
                <Filter className="w-3 h-3 md:w-4 md:h-4" />
                <span>Filter</span>
              </button>
            </div>
            <div className="space-y-2 md:space-y-3">
              {transactions.map((transaction) => {
                const Icon = getIconComponent(transaction.icon);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 md:p-4 hover:bg-gray-50 active:bg-gray-100 rounded-lg md:rounded-xl transition-all duration-200 border border-transparent hover:border-indigo-100"
                  >
                    <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
                      <div
                        className={`p-2 md:p-3 rounded-lg md:rounded-xl flex-shrink-0 ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 md:w-5 md:h-5 ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                            }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                            {transaction.category}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            transaction.paymentMethod === "cash"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {transaction.paymentMethod === "cash" ? "Cash" : "Digital"}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500 truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 md:mt-1 hidden sm:block">
                          {new Date(transaction.date).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 sm:hidden">
                          {new Date(transaction.date).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" }
                          )}
                        </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p
                          className={`font-bold text-sm md:text-lg ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500 hidden sm:block">
                          {new Date(transaction.date).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          // If it's a cash transaction, we need to adjust the cash account balance
                          if (transaction.paymentMethod === "cash" && transaction.cashAccount) {
                            setCashAccounts(prevAccounts =>
                              prevAccounts.map(account => {
                                if (account.id === transaction.cashAccount) {
                                  // Adjust balance based on transaction type
                                  const newBalance = transaction.type === "income"
                                    ? account.balance - transaction.amount // Remove income
                                    : account.balance + transaction.amount; // Add back expense

                                  return {
                                    ...account,
                                    balance: Math.max(0, newBalance) // Prevent negative balance
                                  };
                                }
                                return account;
                              })
                            );
                          }

                          // If it's a budgeted expense, adjust the budget
                          if (transaction.type === "expense" && transaction.category) {
                            setBudgets(prevBudgets => ({
                              ...prevBudgets,
                              [transaction.category]: {
                                limit: prevBudgets[transaction.category]?.limit || 0,
                                spent: Math.max(0, (prevBudgets[transaction.category]?.spent || 0) - transaction.amount)
                              }
                            }));
                          }

                          // Remove the transaction
                          setTransactions(prevTransactions =>
                            prevTransactions.filter(t => t.id !== transaction.id)
                          );
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Transaction"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
            );
              })}
          </div>
          </div>
        )}

      {activeTab === "analytics" && (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">
              Ringkasan Keuangan
            </h3>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-green-100">
                <p className="text-green-700 text-xs md:text-sm font-medium mb-1">
                  Rata-rata Pemasukan
                </p>
                <p className="text-xl md:text-2xl font-bold text-green-800">
                  {formatCurrency(totalIncome / 2)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-red-100">
                <p className="text-red-700 text-xs md:text-sm font-medium mb-1">
                  Rata-rata Pengeluaran
                </p>
                <p className="text-xl md:text-2xl font-bold text-red-800">
                  {formatCurrency(totalExpense / 4)}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h4 className="font-bold text-sm md:text-base text-gray-900">
                  Perbandingan Pendapatan vs Pengeluaran
                </h4>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <div className="flex justify-between mb-1.5 md:mb-2">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      Pemasukan
                    </span>
                    <span className="text-xs md:text-sm font-bold text-green-600">
                      {formatCurrency(totalIncome)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 md:h-3 rounded-full shadow-md"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5 md:mb-2">
                    <span className="text-xs md:text-sm font-medium text-gray-700">
                      Pengeluaran
                    </span>
                    <span className="text-xs md:text-sm font-bold text-red-600">
                      {formatCurrency(totalExpense)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
                    <div
                      className="bg-gradient-to-r from-red-400 to-red-600 h-2 md:h-3 rounded-full shadow-md"
                      style={{
                        width: `${(totalExpense / totalIncome) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-indigo-200">
                <p className="text-xs md:text-sm text-gray-600">
                  Kamu telah menghabiskan{" "}
                  <span className="font-bold text-indigo-600">
                    {((totalExpense / totalIncome) * 100).toFixed(1)}%
                  </span>{" "}
                  dari total pemasukan
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Distribusi Pengeluaran
            </h3>
            <div className="space-y-2 md:space-y-3">
              {topExpenses.map(([category, amount]) => {
                const percentage = (amount / totalExpense) * 100;
                return (
                  <div key={category} className="group">
                    <div className="flex items-center justify-between mb-1.5 md:mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                        <span className="font-medium text-sm md:text-base text-gray-900">
                          {category}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm md:text-base text-gray-900">
                          {formatCurrency(amount)}
                        </span>
                        <span className="text-xs md:text-sm text-gray-500 ml-1 md:ml-2">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 md:h-2.5 rounded-full transition-all duration-500 group-hover:shadow-lg"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
                <p className="text-sm opacity-90">
                  Level {userStats.level} • {achievements.filter(a => a.unlocked).length} / {achievements.length} Achievements
                </p>
              </div>
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-2" />
                <p className="text-2xl font-bold">{userStats.coinsEarned}</p>
                <p className="text-xs opacity-75">Total Coins</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => {
              const Icon = getIconComponent(achievement.icon);
              return (
                <div
                  key={achievement.id}
                  className={`rounded-2xl shadow-lg border-2 p-6 transition-all ${achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
                    : "bg-gray-50 border-gray-200 opacity-70"
                    }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-4 rounded-xl ${achievement.unlocked
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                        : "bg-gray-200 text-gray-400"
                        }`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {achievement.name}
                        </h3>
                        {achievement.unlocked && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-bold text-amber-600">
                          +{achievement.reward} XP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Stats Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Level</p>
                <p className="text-3xl font-bold text-purple-600">{userStats.level}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">XP</p>
                <p className="text-3xl font-bold text-blue-600">{userStats.xp}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Transactions</p>
                <p className="text-3xl font-bold text-green-600">{userStats.totalTransactions}</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Streak</p>
                <p className="text-3xl font-bold text-amber-600">{userStats.streakDays} 🔥</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >

  {/* Add Transaction Modal */ }
  {
    showAddModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md md:w-full p-5 md:p-6 transform transition-all max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Tambah Transaksi
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex space-x-2 mb-4 md:mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setTransactionType("expense")}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-20 ${transactionType === "expense"
                ? "bg-white text-red-600 shadow-md"
                : "text-gray-600"
                }`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setTransactionType("income")}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${transactionType === "income"
                ? "bg-white text-green-600 shadow-md"
                : "text-gray-600"
                }`}
            >
              Pemasukan
            </button>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah
              </label>
              <div className="relative">
                <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm md:text-base">
                  Rp
                </span>
                <input
                  type="text"
                  value={formData.amount ? formatCurrencyInput(formData.amount) : ''}
                  onChange={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    setFormData({ ...formData, amount: numericValue });
                  }}
                  onFocus={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    if (numericValue) {
                      e.target.value = numericValue.toString();
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      e.target.value = formatCurrencyInput(e.target.value);
                    }
                  }}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <div className="grid grid-cols-3 gap-2">
                {categories[transactionType].map((cat) => {
                  const Icon = getIconComponent(cat.icon);
                  return (
                    <button
                      key={cat.name}
                      onClick={() =>
                        setFormData({ ...formData, category: cat.name })
                      }
                      className={`p-2.5 md:p-3 rounded-xl border-2 transition-all duration-200 active:scale-95 ${formData.category === cat.name
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-20 hover:border-gray-300 active:bg-gray-50"
                        }`}
                    >
                      <Icon
                        className={`w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 ${formData.category === cat.name
                          ? "text-indigo-600"
                          : "text-gray-600"
                          }`}
                      />
                      <p className="text-xs font-medium text-gray-700">
                        {cat.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${paymentMethod === "cash"
                    ? "bg-green-10 text-green-700 border-2 border-green-500"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200"
                    }`}
                >
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("digital")}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${paymentMethod === "digital"
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200"
                    }`}
                >
                  Digital
                </button>
              </div>
            </div>

            {/* Cash Account Selector (only shown when payment method is cash) */}
            {paymentMethod === "cash" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dompet Cash
                </label>
                <select
                  value={formData.cashAccount}
                  onChange={(e) =>
                    setFormData({ ...formData, cashAccount: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {cashAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (Rp {new Intl.NumberFormat("id-ID").format(account.balance)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="Catatan transaksi..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
              />
            </div>

            <button
              onClick={handleAddTransaction}
              className="w-full bg-gradient-to-r from-indigo-60 to-purple-600 text-white py-3 md:py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 active:scale-95 md:hover:scale-105 mt-4 md:mt-6 text-sm md:text-base"
            >
              Simpan Transaksi
            </button>
          </div>
        </div>
      </div>)
  }

  {/* Budget Modal */ }
  {
    showBudgetModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md md:w-full p-5 md:p-6 transform transition-all">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Set Budget
            </h3>
            <button
              onClick={() => setShowBudgetModal(false)}
              className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={budgetForm.category}
                onChange={(e) =>
                  setBudgetForm({ ...budgetForm, category: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Pilih Kategori</option>
                {categories.expense.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Limit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Rp
                </span>
                <input
                  type="text"
                  value={budgetForm.limit ? formatCurrencyInput(budgetForm.limit) : ''}
                  onChange={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    setBudgetForm({ ...budgetForm, limit: numericValue });
                  }}
                  onFocus={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    if (numericValue) {
                      e.target.value = numericValue.toString();
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      e.target.value = formatCurrencyInput(e.target.value);
                    }
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <button
              onClick={handleSetBudget}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 active:scale-95 md:hover:scale-105 mt-6"
            >
              Set Budget
            </button>
          </div>
        </div>
      </div>)
  }

  {/* Recurring Transaction Modal */ }
  {
    showRecurringModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md md:w-full p-5 md:p-6 transform transition-all max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Add Recurring Transaction
            </h3>
            <button
              onClick={() => setShowRecurringModal(false)}
              className="text-gray-400 hover:text-gray-60 active:text-gray-800 transition-colors p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex space-x-2 mb-4 md:mb-6 bg-gray-10 rounded-xl p-1">
            <button
              onClick={() => setTransactionType("expense")}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${transactionType === "expense"
                ? "bg-white text-red-600 shadow-md"
                : "text-gray-600"
                }`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setTransactionType("income")}
              className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${transactionType === "income"
                ? "bg-white text-green-600 shadow-md"
                : "text-gray-600"
                }`}
            >
              Pemasukan
            </button>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah
              </label>
              <div className="relative">
                <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm md:text-base">
                  Rp
                </span>
                <input
                  type="text"
                  value={recurringForm.amount ? formatCurrencyInput(recurringForm.amount) : ''}
                  onChange={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    setRecurringForm({ ...recurringForm, amount: numericValue });
                  }}
                  onFocus={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    if (numericValue) {
                      e.target.value = numericValue.toString();
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      e.target.value = formatCurrencyInput(e.target.value);
                    }
                  }}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={recurringForm.category}
                onChange={(e) =>
                  setRecurringForm({ ...recurringForm, category: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Pilih Kategori</option>
                {categories[transactionType].map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${paymentMethod === "cash"
                    ? "bg-green-100 text-green-700 border-2 border-green-500"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200"
                    }`}
                >
                  Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("digital")}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-200 ${paymentMethod === "digital"
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200"
                    }`}
                >
                  Digital
                </button>
              </div>
            </div>

            {/* Cash Account Selector (only shown when payment method is cash) */}
            {paymentMethod === "cash" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dompet Cash
                </label>
                <select
                  value={recurringForm.cashAccount}
                  onChange={(e) =>
                    setRecurringForm({ ...recurringForm, cashAccount: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  {cashAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (Rp {new Intl.NumberFormat("id-ID").format(account.balance)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <input
                type="text"
                value={recurringForm.description}
                onChange={(e) =>
                  setRecurringForm({ ...recurringForm, description: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="e.g., Gaji Bulanan, Listrik"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={recurringForm.frequency}
                onChange={(e) =>
                  setRecurringForm({ ...recurringForm, frequency: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={recurringForm.startDate}
                onChange={(e) =>
                  setRecurringForm({ ...recurringForm, startDate: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleAddRecurring}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 md:py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 active:scale-95 md:hover:scale-105 mt-4 md:mt-6 text-sm md:text-base"
            >
              Add Recurring Transaction
            </button>
          </div>
        </div>
      </div>)
  }

  {/* Add Cash Account Modal */ }
  {
    showCashAccountModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md md:w-full p-5 md:p-6 transform transition-all">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Tambah Dompet Cash
            </h3>
            <button
              onClick={() => setShowCashAccountModal(false)}
              className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Dompet
              </label>
              <input
                type="text"
                value={cashAccountForm.name}
                onChange={(e) =>
                  setCashAccountForm({ ...cashAccountForm, name: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                placeholder="e.g., Dompet Utama, Simpanan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saldo Awal
              </label>
              <div className="relative">
                <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm md:text-base">
                  Rp
                </span>
                <input
                  type="text"
                  value={cashAccountForm.initialBalance ? formatCurrencyInput(cashAccountForm.initialBalance) : ''}
                  onChange={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    setCashAccountForm({ ...cashAccountForm, initialBalance: numericValue });
                  }}
                  onFocus={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    if (numericValue) {
                      e.target.value = numericValue.toString();
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      e.target.value = formatCurrencyInput(e.target.value);
                    }
                  }}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                  placeholder="0"
                />
              </div>
            </div>

            <button
              onClick={handleAddCashAccount}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 md:py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 active:scale-95 md:hover:scale-105 mt-4 md:mt-6 text-sm md:text-base"
            >
              Tambah Dompet
            </button>
          </div>
        </div>
      </div>)
  }

  {/* Cash Transfer Modal */ }
  {
    showTransferModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md md:w-full p-5 md:p-6 transform transition-all">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              Transfer Cash
            </h3>
            <button
              onClick={() => setShowTransferModal(false)}
              className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dari Dompet
              </label>
              <select
                value={transferForm.fromAccount}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, fromAccount: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Pilih dompet asal</option>
                {cashAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} (Rp {new Intl.NumberFormat("id-ID").format(account.balance)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ke Dompet
              </label>
              <select
                value={transferForm.toAccount}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, toAccount: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Pilih dompet tujuan</option>
                {cashAccounts
                  .filter(account => account.id !== transferForm.fromAccount)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} (Rp {new Intl.NumberFormat("id-ID").format(account.balance)})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah
              </label>
              <div className="relative">
                <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm md:text-base">
                  Rp
                </span>
                <input
                  type="text"
                  value={transferForm.amount ? formatCurrencyInput(transferForm.amount) : ''}
                  onChange={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    setTransferForm({ ...transferForm, amount: numericValue });
                  }}
                  onFocus={(e) => {
                    const numericValue = parseCurrencyInput(e.target.value);
                    if (numericValue) {
                      e.target.value = numericValue.toString();
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      e.target.value = formatCurrencyInput(e.target.value);
                    }
                  }}
                  className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi (Opsional)
              </label>
              <input
                type="text"
                value={transferForm.description}
                onChange={(e) =>
                  setTransferForm({ ...transferForm, description: e.target.value })
                }
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Catatan transfer..."
              />
            </div>

            <button
              onClick={handleCashTransfer}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 md:py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 active:scale-95 md:hover:scale-105 mt-4 md:mt-6 text-sm md:text-base"
            >
              Transfer
            </button>
          </div>
        </div>
      </div>)
  }
    </div >
  </>
  <Toaster
    position="top-right"
    toastOptions={{
      // Define default options
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
          color: '#065f46',     // dark green
        },
      },
      error: {
        style: {
          background: '#fee2e2', // light red
          color: '#b91c1c',     // dark red
        },
      },
      custom: {
        style: {
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
            }
          }
        }
      }
    }}
  />
