import React, { useState, useEffect } from "react";
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
} from "lucide-react";

const FinanceApp = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [hideBalance, setHideBalance] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showAchievementNotification, setShowAchievementNotification] = useState(null);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "income",
      amount: 5000000,
      category: "Gaji",
      description: "Gaji Bulanan",
      date: "2024-11-01",
      icon: "DollarSign",
    },
    {
      id: 2,
      type: "expense",
      amount: 500000,
      category: "Makanan",
      description: "Groceries",
      date: "2024-11-05",
      icon: "ShoppingBag",
    },
    {
      id: 3,
      type: "expense",
      amount: 200000,
      category: "Transport",
      description: "Bensin",
      date: "2024-11-10",
      icon: "Car",
    },
    {
      id: 4,
      type: "expense",
      amount: 150000,
      category: "Hiburan",
      description: "Nonton Film",
      date: "2024-11-15",
      icon: "Coffee",
    },
    {
      id: 5,
      type: "income",
      amount: 1000000,
      category: "Freelance",
      description: "Project Web",
      date: "2024-11-18",
      icon: "TrendingUp",
    },
    {
      id: 6,
      type: "expense",
      amount: 300000,
      category: "Belanja",
      description: "Baju",
      date: "2024-11-20",
      icon: "ShoppingBag",
    },
  ]);

  const [budgets, setBudgets] = useState({
    Makanan: { limit: 1500000, spent: 500000 },
    Transport: { limit: 500000, spent: 200000 },
    Hiburan: { limit: 500000, spent: 150000 },
    Belanja: { limit: 1000000, spent: 300000 },
  });

  const [savingsGoal, setSavingsGoal] = useState({
    target: 10000000,
    current: 3500000,
    name: "Emergency Fund",
    deadline: "2025-12-31",
  });

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [budgetForm, setBudgetForm] = useState({
    category: "",
    limit: "",
  });

  // Debt Tracker State
  const [debts, setDebts] = useState([
    {
      id: 1,
      name: "Pinjaman Bank",
      type: "payable",
      totalAmount: 10000000,
      paidAmount: 3000000,
      dueDate: "2025-12-31",
      creditor: "BCA",
      interestRate: 5,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Hutang ke Teman",
      type: "payable",
      totalAmount: 2000000,
      paidAmount: 500000,
      dueDate: "2025-06-30",
      creditor: "John Doe",
      interestRate: 0,
      createdAt: "2024-10-10",
    },
  ]);

  const [debtForm, setDebtForm] = useState({
    name: "",
    type: "payable",
    totalAmount: "",
    paidAmount: "0",
    dueDate: "",
    creditor: "",
    interestRate: "0",
  });

  // Recurring Transactions State
  const [recurringTransactions, setRecurringTransactions] = useState([
    {
      id: 1,
      type: "expense",
      amount: 500000,
      category: "Tagihan",
      description: "Listrik Bulanan",
      frequency: "monthly",
      startDate: "2024-01-01",
      nextDate: "2025-01-01",
      isActive: true,
      icon: "CreditCard",
    },
    {
      id: 2,
      type: "income",
      amount: 5000000,
      category: "Gaji",
      description: "Gaji Bulanan",
      frequency: "monthly",
      startDate: "2024-01-01",
      nextDate: "2025-01-01",
      isActive: true,
      icon: "DollarSign",
    },
  ]);

  const [recurringForm, setRecurringForm] = useState({
    amount: "",
    category: "",
    description: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
  });

  // Gamification State
  const [userStats, setUserStats] = useState({
    level: 5,
    xp: 350,
    xpToNextLevel: 500,
    totalTransactions: 42,
    streakDays: 7,
    coinsEarned: 450,
  });

  const [achievements, setAchievements] = useState([
    { id: 1, name: "First Transaction", description: "Add your first transaction", unlocked: true, icon: "Star", reward: 50 },
    { id: 2, name: "Budget Master", description: "Set budget for 5 categories", unlocked: true, icon: "Target", reward: 100 },
    { id: 3, name: "Savings Hero", description: "Save 20% of income", unlocked: false, icon: "Trophy", reward: 150 },
    { id: 4, name: "Debt Free", description: "Pay off all debts", unlocked: false, icon: "CheckCircle", reward: 200 },
    { id: 5, name: "Consistent Tracker", description: "7-day tracking streak", unlocked: true, icon: "Zap", reward: 100 },
    { id: 6, name: "Budget Guardian", description: "Stay under budget for 3 months", unlocked: false, icon: "Award", reward: 250 },
  ]);

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

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Calculate total debts
  const totalDebt = debts.reduce((sum, debt) => sum + (debt.totalAmount - debt.paidAmount), 0);
  const totalDebtPaid = debts.reduce((sum, debt) => sum + debt.paidAmount, 0);

  // Check budget warnings
  useEffect(() => {
    const warnings = Object.entries(budgets).filter(([cat, data]) => {
      const percentage = (data.spent / data.limit) * 100;
      return percentage >= 80;
    });

    if (warnings.length > 0 && !showNotification) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [transactions]);

  const formatCurrency = (amount) => {
    if (hideBalance) return "Rp ••••••";
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
      icon:
        categories[transactionType].find((c) => c.name === formData.category)
          ?.icon || "MoreHorizontal",
    };

    setTransactions([newTransaction, ...transactions]);

    // Update budget if expense
    if (transactionType === "expense" && budgets[formData.category]) {
      setBudgets({
        ...budgets,
        [formData.category]: {
          ...budgets[formData.category],
          spent: budgets[formData.category].spent + parseFloat(formData.amount),
        },
      });
    }

    setShowAddModal(false);
    setFormData({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });

    // Add XP for adding transaction
    addXP(15);
    
    // Update user stats
    setUserStats(prev => ({ 
      ...prev, 
      totalTransactions: prev.totalTransactions + 1 
    }));

    // Check for first transaction achievement
    if (transactions.length === 0) {
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
  };

  // Debt Tracker Functions
  const handleAddDebt = () => {
    if (!debtForm.name || !debtForm.totalAmount) return;

    const newDebt = {
      id: Date.now(),
      name: debtForm.name,
      type: debtForm.type,
      totalAmount: parseFloat(debtForm.totalAmount),
      paidAmount: parseFloat(debtForm.paidAmount),
      dueDate: debtForm.dueDate,
      creditor: debtForm.creditor,
      interestRate: parseFloat(debtForm.interestRate),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setDebts([...debts, newDebt]);
    setShowDebtModal(false);
    setDebtForm({
      name: "",
      type: "payable",
      totalAmount: "",
      paidAmount: "0",
      dueDate: "",
      creditor: "",
      interestRate: "0",
    });

    addXP(30);
  };

  const handlePayDebt = (debtId, amount) => {
    setDebts(
      debts.map((debt) => {
        if (debt.id === debtId) {
          const newPaidAmount = Math.min(debt.paidAmount + amount, debt.totalAmount);
          
          if (newPaidAmount === debt.totalAmount) {
            checkAchievement("Debt Free");
            addXP(100);
          } else {
            addXP(20);
          }
          
          return { ...debt, paidAmount: newPaidAmount };
        }
        return debt;
      })
    );
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
      icon: categories[transactionType].find((c) => c.name === recurringForm.category)?.icon || "MoreHorizontal",
    };

    setRecurringTransactions([...recurringTransactions, newRecurring]);
    setShowRecurringModal(false);
    setRecurringForm({
      amount: "",
      category: "",
      description: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
    });

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
    setShowAchievementNotification(achievement);
    setTimeout(() => setShowAchievementNotification(null), 4000);
  };

  // Export Data Function
  const handleExportData = () => {
    const exportData = {
      transactions,
      budgets,
      debts,
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
              {formatCurrency(totalDebt)}
            </p>
            <p className="text-orange-600 text-xs font-medium">
              {debts.length} hutang aktif
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
                  {hideBalance ? "••••" : formatCurrency(savingsGoal.current)}
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

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 mb-4 md:mb-6 p-1 md:p-2">
          <div className="grid grid-cols-7 gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === "budget"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab("debt")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === "debt"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              Hutang
            </button>
            <button
              onClick={() => setActiveTab("recurring")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === "recurring"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              Rutin
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === "transactions"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              Transaksi
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === "achievements"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              Awards
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
                activeTab === "analytics"
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
                      className="flex items-center justify-between p-2 md:p-3 hover:bg-gray-50 active:bg-gray-100 rounded-lg md:rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div
                          className={`p-2 md:p-3 rounded-lg md:rounded-xl ${
                            transaction.type === "income"
                              ? "bg-green-100 group-hover:bg-green-200"
                              : "bg-red-100 group-hover:bg-red-200"
                          } transition-colors duration-200`}
                        >
                          <Icon
                            className={`w-4 h-4 md:w-5 md:h-5 ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm md:text-base text-gray-900">
                            {transaction.category}
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            {transaction.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-sm md:text-base ${
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
                  className={`bg-white rounded-xl md:rounded-2xl shadow-lg border-2 p-4 md:p-6 transition-all ${
                    isWarning
                      ? "border-orange-300 bg-orange-50"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isWarning ? "bg-orange-200" : "bg-indigo-100"
                        }`}
                      >
                        <Target
                          className={`w-5 h-5 ${
                            isWarning ? "text-orange-600" : "text-indigo-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-base md:text-lg text-gray-900">
                          {category}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {hideBalance ? "•••••" : formatCurrency(remaining)}{" "}
                          tersisa
                        </p>
                      </div>
                    </div>
                    {isWarning && (
                      <div className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        ⚠️ {percentage.toFixed(0)}%
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Spent:{" "}
                        {hideBalance ? "••••••" : formatCurrency(data.spent)}
                      </span>
                      <span className="text-gray-600">
                        Limit:{" "}
                        {hideBalance ? "••••••" : formatCurrency(data.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isWarning
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
                        <p className="font-semibold text-sm md:text-base text-gray-900 truncate">
                          {transaction.category}
                        </p>
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
                    <div className="text-right flex-shrink-0">
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

        {/* Debt Tracker Tab */}
        {activeTab === "debt" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Debt Tracker
              </h2>
              <button
                onClick={() => setShowDebtModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center space-x-2 text-sm md:text-base hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Debt</span>
              </button>
            </div>

            {/* Debt Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90 mb-1">Total Hutang</p>
                <p className="text-3xl font-bold">{formatCurrency(totalDebt)}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90 mb-1">Total Terbayar</p>
                <p className="text-3xl font-bold">{formatCurrency(totalDebtPaid)}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90 mb-1">Jumlah Hutang</p>
                <p className="text-3xl font-bold">{debts.length}</p>
              </div>
            </div>

            {/* Debt List */}
            {debts.map((debt) => {
              const progress = (debt.paidAmount / debt.totalAmount) * 100;
              const remaining = debt.totalAmount - debt.paidAmount;
              const daysUntilDue = Math.ceil(
                (new Date(debt.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
              );
              const isOverdue = daysUntilDue < 0;

              return (
                <div
                  key={debt.id}
                  className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                    isOverdue ? "border-red-300 bg-red-50" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{debt.name}</h3>
                      <p className="text-sm text-gray-600">
                        {debt.type === "payable" ? "Hutang ke" : "Piutang dari"} {debt.creditor}
                      </p>
                      {debt.interestRate > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Bunga: {debt.interestRate}% per tahun
                        </p>
                      )}
                    </div>
                    {isOverdue && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Overdue!
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-gray-900">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Terbayar: {formatCurrency(debt.paidAmount)}
                      </span>
                      <span className="text-gray-600">
                        Total: {formatCurrency(debt.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Sisa Hutang</p>
                        <p className="text-lg font-bold text-orange-600">
                          {formatCurrency(remaining)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Jatuh Tempo</p>
                        <p className={`text-sm font-bold ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                          {new Date(debt.dueDate).toLocaleDateString("id-ID")}
                          <span className="text-xs ml-1">
                            ({isOverdue ? `${Math.abs(daysUntilDue)} hari lewat` : `${daysUntilDue} hari lagi`})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handlePayDebt(debt.id, 100000)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all"
                    >
                      Bayar 100k
                    </button>
                    <button
                      onClick={() => handlePayDebt(debt.id, 500000)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-all"
                    >
                      Bayar 500k
                    </button>
                    <button
                      onClick={() => handlePayDebt(debt.id, remaining)}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Lunasi
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recurring Transactions Tab */}
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
                    className={`bg-white rounded-2xl shadow-lg border-2 p-6 ${
                      recurring.isActive ? "border-green-200" : "border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-3 rounded-xl ${
                            recurring.type === "income" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              recurring.type === "income" ? "text-green-600" : "text-red-600"
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
                      <button
                        onClick={() => toggleRecurring(recurring.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          recurring.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {recurring.isActive ? "Active" : "Paused"}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Amount</span>
                        <span
                          className={`text-2xl font-bold ${
                            recurring.type === "income" ? "text-green-600" : "text-red-600"
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
                    className={`rounded-2xl shadow-lg border-2 p-6 transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200 opacity-70"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-4 rounded-xl ${
                          achievement.unlocked
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
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
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
                className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${
                  transactionType === "expense"
                    ? "bg-white text-red-600 shadow-md"
                    : "text-gray-600"
                }`}
              >
                Pengeluaran
              </button>
              <button
                onClick={() => setTransactionType("income")}
                className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${
                  transactionType === "income"
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
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
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
                        className={`p-2.5 md:p-3 rounded-xl border-2 transition-all duration-200 active:scale-95 ${
                          formData.category === cat.name
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-gray-300 active:bg-gray-50"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 ${
                            formData.category === cat.name
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
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 md:py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 active:scale-95 md:hover:scale-105 mt-4 md:mt-6 text-sm md:text-base"
              >
                Simpan Transaksi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
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
                    type="number"
                    value={budgetForm.limit}
                    onChange={(e) =>
                      setBudgetForm({ ...budgetForm, limit: e.target.value })
                    }
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
        </div>
      )}

      {/* Debt Modal */}
      {showDebtModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md md:w-full p-5 md:p-6 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Add Debt
              </h3>
              <button
                onClick={() => setShowDebtModal(false)}
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

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Hutang
                </label>
                <input
                  type="text"
                  value={debtForm.name}
                  onChange={(e) =>
                    setDebtForm({ ...debtForm, name: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                  placeholder="e.g., Pinjaman Bank"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe
                </label>
                <select
                  value={debtForm.type}
                  onChange={(e) =>
                    setDebtForm({ ...debtForm, type: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="payable">Hutang (Harus Dibayar)</option>
                  <option value="receivable">Piutang (Akan Diterima)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm md:text-base">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={debtForm.totalAmount}
                    onChange={(e) =>
                      setDebtForm({ ...debtForm, totalAmount: e.target.value })
                    }
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sudah Dibayar
                </label>
                <div className="relative">
                  <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm md:text-base">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={debtForm.paidAmount}
                    onChange={(e) =>
                      setDebtForm({ ...debtForm, paidAmount: e.target.value })
                    }
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kreditor/Debitor
                </label>
                <input
                  type="text"
                  value={debtForm.creditor}
                  onChange={(e) =>
                    setDebtForm({ ...debtForm, creditor: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                  placeholder="e.g., Bank BCA, John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (% per tahun)
                </label>
                <input
                  type="number"
                  value={debtForm.interestRate}
                  onChange={(e) =>
                    setDebtForm({ ...debtForm, interestRate: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jatuh Tempo
                </label>
                <input
                  type="date"
                  value={debtForm.dueDate}
                  onChange={(e) =>
                    setDebtForm({ ...debtForm, dueDate: e.target.value })
                  }
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
                />
              </div>

              <button
                onClick={handleAddDebt}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 md:py-4 rounded-xl font-bold hover:shadow-xl transition-all duration-200 active:scale-95 md:hover:scale-105 mt-4 md:mt-6 text-sm md:text-base"
              >
                Add Debt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Transaction Modal */}
      {showRecurringModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-md md:w-full p-5 md:p-6 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Add Recurring Transaction
              </h3>
              <button
                onClick={() => setShowRecurringModal(false)}
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
                className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${
                  transactionType === "expense"
                    ? "bg-white text-red-600 shadow-md"
                    : "text-gray-600"
                }`}
              >
                Pengeluaran
              </button>
              <button
                onClick={() => setTransactionType("income")}
                className={`flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${
                  transactionType === "income"
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
                    type="number"
                    value={recurringForm.amount}
                    onChange={(e) =>
                      setRecurringForm({ ...recurringForm, amount: e.target.value })
                    }
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
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
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
        </div>
      )}
    </div>
  );
};

export default FinanceApp;
