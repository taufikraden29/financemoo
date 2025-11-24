import React, { useState, useEffect } from "react";

// Hooks
import { 
  useTransactions, 
  useDebts, 
  useRecurring, 
  useGamification 
} from "./hooks";

// Utils
import { 
  formatCurrency, 
  calculateNextDate, 
  exportToJSON, 
  getIconComponent 
} from "./utils";

// Constants
import { CATEGORIES, XP_REWARDS } from "./constants";
import { INITIAL_SAVINGS_GOAL } from "./data/initialData";

// Components
import Header from "./components/layout/Header";
import NavigationTabs from "./components/layout/NavigationTabs";
import BalanceCards from "./components/cards/BalanceCards";
import UserLevelBanner from "./components/cards/UserLevelBanner";
import { 
  AchievementNotification, 
  BudgetWarning 
} from "./components/common/Notification";

// Import tabs (akan dibuat nanti atau tetap inline di sini)
import OverviewTab from "./components/tabs/OverviewTab";
import BudgetTab from "./components/tabs/BudgetTab";
import DebtTab from "./components/tabs/DebtTab";
import RecurringTab from "./components/tabs/RecurringTab";
import TransactionsTab from "./components/tabs/TransactionsTab";
import AchievementsTab from "./components/tabs/AchievementsTab";
import AnalyticsTab from "./components/tabs/AnalyticsTab";

// Import modals
import AddTransactionModal from "./components/modals/AddTransactionModal";
import BudgetModal from "./components/modals/BudgetModal";
import DebtModal from "./components/modals/DebtModal";
import RecurringModal from "./components/modals/RecurringModal";

const FinanceApp = () => {
  // State
  const [activeTab, setActiveTab] = useState("overview");
  const [hideBalance, setHideBalance] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [savingsGoal, setSavingsGoal] = useState(INITIAL_SAVINGS_GOAL);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  
  // Form states
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
  
  const [debtForm, setDebtForm] = useState({
    name: "",
    type: "payable",
    totalAmount: "",
    paidAmount: "0",
    dueDate: "",
    creditor: "",
    interestRate: "0",
  });
  
  const [recurringForm, setRecurringForm] = useState({
    amount: "",
    category: "",
    description: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
  });

  // Custom hooks
  const {
    transactions,
    budgets,
    totalIncome,
    totalExpense,
    balance,
    topExpenses,
    addTransaction,
    updateBudgetSpent,
    setBudget,
  } = useTransactions();

  const { 
    debts, 
    totalDebt, 
    totalDebtPaid, 
    addDebt, 
    payDebt 
  } = useDebts();

  const { 
    recurringTransactions, 
    addRecurring, 
    toggleRecurring 
  } = useRecurring();

  const {
    userStats,
    achievements,
    showAchievementNotification,
    addXP,
    checkAchievement,
    incrementTransactionCount,
  } = useGamification();

  // Calculated values
  const savingsRate = ((balance / totalIncome) * 100).toFixed(1);
  const dailyAverage = (totalExpense / 30).toFixed(0);
  const savingsProgress = ((savingsGoal.current / savingsGoal.target) * 100).toFixed(1);

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
  }, [budgets, showNotification]);

  // Handlers
  const handleAddTransaction = () => {
    if (!formData.amount || !formData.category) return;

    const newTransaction = {
      id: Date.now(),
      type: transactionType,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: formData.date,
      icon: CATEGORIES[transactionType].find((c) => c.name === formData.category)?.icon || "MoreHorizontal",
    };

    addTransaction(newTransaction);

    if (transactionType === "expense") {
      updateBudgetSpent(formData.category, parseFloat(formData.amount));
    }

    setShowAddModal(false);
    setFormData({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });

    addXP(XP_REWARDS.ADD_TRANSACTION);
    incrementTransactionCount();

    if (transactions.length === 0) {
      checkAchievement("First Transaction");
    }
  };

  const handleSetBudget = () => {
    if (!budgetForm.category || !budgetForm.limit) return;
    
    setBudget(budgetForm.category, parseFloat(budgetForm.limit));
    setShowBudgetModal(false);
    setBudgetForm({ category: "", limit: "" });
  };

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

    addDebt(newDebt);
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

    addXP(XP_REWARDS.ADD_DEBT);
  };

  const handlePayDebt = (debtId, amount) => {
    const isFullyPaid = payDebt(debtId, amount);
    
    if (isFullyPaid) {
      checkAchievement("Debt Free");
      addXP(XP_REWARDS.PAY_DEBT_FULL);
    } else {
      addXP(XP_REWARDS.PAY_DEBT);
    }
  };

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
      icon: CATEGORIES[transactionType].find((c) => c.name === recurringForm.category)?.icon || "MoreHorizontal",
    };

    addRecurring(newRecurring);
    setShowRecurringModal(false);
    setRecurringForm({
      amount: "",
      category: "",
      description: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
    });

    addXP(XP_REWARDS.ADD_RECURRING);
  };

  const handleExportData = () => {
    const data = {
      transactions,
      budgets,
      debts,
      recurringTransactions,
      savingsGoal,
      userStats,
      achievements,
    };

    exportToJSON(data);
    addXP(XP_REWARDS.EXPORT_DATA);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-20 md:pb-8">
      <AchievementNotification achievement={showAchievementNotification} />
      <BudgetWarning show={showNotification} />

      <Header
        hideBalance={hideBalance}
        setHideBalance={setHideBalance}
        onExport={handleExportData}
        onAddTransaction={() => setShowAddModal(true)}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8">
        <UserLevelBanner userStats={userStats} />

        <BalanceCards
          balance={balance}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalDebt={totalDebt}
          debtsCount={debts.length}
          savingsRate={savingsRate}
          dailyAverage={dailyAverage}
          hideBalance={hideBalance}
        />

        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content - Untuk sementara pakai komponen yang sudah ada */}
        {activeTab === "overview" && (
          <OverviewTab
            transactions={transactions}
            topExpenses={topExpenses}
            totalExpense={totalExpense}
            savingsRate={savingsRate}
            savingsGoal={savingsGoal}
            savingsProgress={savingsProgress}
            hideBalance={hideBalance}
            formatCurrency={formatCurrency}
            getIconComponent={getIconComponent}
          />
        )}

        {activeTab === "budget" && (
          <BudgetTab
            budgets={budgets}
            onSetBudget={() => setShowBudgetModal(true)}
            hideBalance={hideBalance}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "debt" && (
          <DebtTab
            debts={debts}
            totalDebt={totalDebt}
            totalDebtPaid={totalDebtPaid}
            onAddDebt={() => setShowDebtModal(true)}
            onPayDebt={handlePayDebt}
            hideBalance={hideBalance}
            formatCurrency={formatCurrency}
          />
        )}

        {activeTab === "recurring" && (
          <RecurringTab
            recurringTransactions={recurringTransactions}
            onAddRecurring={() => setShowRecurringModal(true)}
            onToggleRecurring={toggleRecurring}
            formatCurrency={formatCurrency}
            getIconComponent={getIconComponent}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionsTab
            transactions={transactions}
            formatCurrency={formatCurrency}
            getIconComponent={getIconComponent}
          />
        )}

        {activeTab === "achievements" && (
          <AchievementsTab
            achievements={achievements}
            userStats={userStats}
            getIconComponent={getIconComponent}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab
            totalIncome={totalIncome}
            totalExpense={totalExpense}
            topExpenses={topExpenses}
            formatCurrency={formatCurrency}
            hideBalance={hideBalance}
          />
        )}
      </div>

      {/* Modals */}
      <AddTransactionModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        formData={formData}
        setFormData={setFormData}
        categories={CATEGORIES}
        onSubmit={handleAddTransaction}
        getIconComponent={getIconComponent}
      />

      <BudgetModal
        show={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        budgetForm={budgetForm}
        setBudgetForm={setBudgetForm}
        categories={CATEGORIES.expense}
        onSubmit={handleSetBudget}
      />

      <DebtModal
        show={showDebtModal}
        onClose={() => setShowDebtModal(false)}
        debtForm={debtForm}
        setDebtForm={setDebtForm}
        onSubmit={handleAddDebt}
      />

      <RecurringModal
        show={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
        recurringForm={recurringForm}
        setRecurringForm={setRecurringForm}
        categories={CATEGORIES}
        onSubmit={handleAddRecurring}
      />
    </div>
  );
};

export default FinanceApp;
