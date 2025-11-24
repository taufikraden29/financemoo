import { formatCurrency, calculatePercentage } from '../formatters/formatters';

/**
 * Analytics Calculation Utilities for Personal Finance Tracker
 */

/**
 * Calculate monthly transaction summary
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Monthly summary with income, expense, and net values
 */
export const calculateMonthlySummary = (transactions) => {
  const monthlyData = {};
  
  transactions.forEach(transaction => {
    const month = transaction.date.substring(0, 7); // YYYY-MM format
    
    if (!monthlyData[month]) {
      monthlyData[month] = {
        income: 0,
        expense: 0,
        net: 0
      };
    }
    
    if (transaction.type === 'income') {
      monthlyData[month].income += transaction.amount;
    } else {
      monthlyData[month].expense += transaction.amount;
    }
    
    monthlyData[month].net = monthlyData[month].income - monthlyData[month].expense;
  });
  
  return monthlyData;
};

/**
 * Calculate category-wise expense breakdown
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Array of categories with their totals
 */
export const calculateCategoryBreakdown = (transactions) => {
  const categoryTotals = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });
  
  return Object.entries(categoryTotals)
    .map(([category, total]) => ({
      category,
      total,
      percentage: 0 // Will be calculated after total is known
    }))
    .sort((a, b) => b.total - a.total);
};

/**
 * Calculate monthly savings rate
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Savings rate data by month
 */
export const calculateSavingsRate = (transactions) => {
  const monthlyData = calculateMonthlySummary(transactions);
  
  const savingsRateData = Object.entries(monthlyData).map(([month, data]) => {
    const savingsRate = data.income > 0 ? (data.net / data.income) * 100 : 0;
    return {
      month,
      income: data.income,
      expense: data.expense,
      net: data.net,
      savingsRate: Math.max(0, savingsRate), // Ensure non-negative for display
      isPositive: data.net >= 0
    };
  });
  
  return savingsRateData;
};

/**
 * Calculate payment method distribution
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Distribution by payment method
 */
export const calculatePaymentMethodDistribution = (transactions) => {
  const methodTotals = {};
  
  transactions.forEach(transaction => {
    const method = transaction.paymentMethod || 'cash';
    if (!methodTotals[method]) {
      methodTotals[method] = {
        income: 0,
        expense: 0,
        total: 0
      };
    }
    
    if (transaction.type === 'income') {
      methodTotals[method].income += transaction.amount;
    } else {
      methodTotals[method].expense += transaction.amount;
    }
    methodTotals[method].total += transaction.amount;
  });
  
  return methodTotals;
};

/**
 * Calculate transaction trend
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Trend data by date
 */
export const calculateTransactionTrend = (transactions) => {
  const trendData = {};
  
  transactions.forEach(transaction => {
    const date = transaction.date;
    
    if (!trendData[date]) {
      trendData[date] = {
        income: 0,
        expense: 0,
        net: 0
      };
    }
    
    if (transaction.type === 'income') {
      trendData[date].income += transaction.amount;
    } else {
      trendData[date].expense += transaction.amount;
    }
    
    trendData[date].net = trendData[date].income - trendData[date].expense;
  });
  
  return Object.entries(trendData)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, data]) => ({ date, ...data }));
};

/**
 * Calculate top expense categories
 * @param {Array} transactions - Array of transaction objects
 * @param {number} limit - Number of categories to return (default 5)
 * @returns {Array} Top expense categories
 */
export const calculateTopExpenseCategories = (transactions, limit = 5) => {
  const categoryTotals = {};
  
  transactions
    .filter(t => t.type === 'expense')
    .forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });
  
  return Object.entries(categoryTotals)
    .sort(([, totalA], [, totalB]) => totalB - totalA)
    .slice(0, limit)
    .map(([category, total]) => ({ category, total }));
};

/**
 * Calculate financial health score
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} budgets - Budgets by category
 * @param {Array} installments - Installment data
 * @returns {Object} Financial health metrics
 */
export const calculateFinancialHealth = (transactions, budgets, installments) => {
  // Calculate savings rate
  const monthlySummary = calculateMonthlySummary(transactions);
  const currentMonth = new Date().toISOString().substring(0, 7);
  const currentSummary = monthlySummary[currentMonth] || { income: 0, expense: 0, net: 0 };
  
  const savingsRate = currentSummary.income > 0 ? (currentSummary.net / currentSummary.income) * 100 : 0;
  
  // Calculate budget adherence
  let budgetSpent = 0;
  let budgetTotal = 0;
  
  Object.entries(budgets).forEach(([category, limit]) => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    budgetSpent += spent;
    budgetTotal += limit;
  });
  
  const budgetAdherence = budgetTotal > 0 ? ((budgetTotal - budgetSpent) / budgetTotal) * 100 : 100;
  
  // Debt to income ratio
  const installmentStats = installments.reduce((stats, installment) => {
    stats.totalDebt += (installment.totalAmount || 0) - (installment.paidAmount || 0);
    return stats;
  }, { totalDebt: 0 });
  
  const debtToIncomeRatio = currentSummary.income > 0 ? (installmentStats.totalDebt / currentSummary.income) * 100 : 0;
  
  // Score calculation (simplified)
  let healthScore = 50; // Base score
  
  // Adjust based on savings rate (positive is good)
  if (savingsRate > 20) healthScore += 20;
  else if (savingsRate > 10) healthScore += 10;
  else if (savingsRate < 0) healthScore -= 20;
  
  // Adjust based on budget adherence (higher is better)
  if (budgetAdherence > 80) healthScore += 15;
  else if (budgetAdherence > 50) healthScore += 5;
  else if (budgetAdherence < 20) healthScore -= 15;
  
  // Adjust based on debt to income ratio (lower is better)
  if (debtToIncomeRatio < 10) healthScore += 10;
  else if (debtToIncomeRatio > 50) healthScore -= 20;
  
  // Cap the score between 0 and 100
  healthScore = Math.max(0, Math.min(100, healthScore));
  
  return {
    savingsRate,
    budgetAdherence,
    debtToIncomeRatio,
    healthScore,
    installmentDebt: installmentStats.totalDebt,
    totalIncome: currentSummary.income,
    totalExpense: currentSummary.expense,
    netIncome: currentSummary.net
  };
};

/**
 * Calculate transaction frequency
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Frequency data
 */
export const calculateTransactionFrequency = (transactions) => {
  const frequency = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    byDayOfWeek: new Array(7).fill(0), // Sunday = 0, Monday = 1, etc.
    byTimeOfDay: new Array(24).fill(0) // Hour 0-23
  };
  
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const dayOfWeek = date.getDay();
    const hour = new Date(transaction.timestamp || transaction.date).getHours();
    
    frequency.byDayOfWeek[dayOfWeek]++;
    frequency.byTimeOfDay[hour]++;
  });
  
  // Calculate stats
  const totalTransactions = transactions.length;
  if (totalTransactions > 0) {
    frequency.daily = totalTransactions / 30; // Approximate average per day
    frequency.weekly = totalTransactions / 4.3; // Approximate average per week
    frequency.monthly = totalTransactions; // Total for the period
  }
  
  return frequency;
};

/**
 * Generate comprehensive analytics report
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} budgets - Budgets by category
 * @param {Array} installments - Installment data
 * @returns {Object} Comprehensive analytics report
 */
export const generateAnalyticsReport = (transactions, budgets, installments) => {
  const monthlySummary = calculateMonthlySummary(transactions);
  const categoryBreakdown = calculateCategoryBreakdown(transactions);
  const savingsRateAnalysis = calculateSavingsRate(transactions);
  const paymentMethods = calculatePaymentMethodDistribution(transactions);
  const transactionTrend = calculateTransactionTrend(transactions);
  const topCategories = calculateTopExpenseCategories(transactions);
  const financialHealth = calculateFinancialHealth(transactions, budgets, installments);
  const frequency = calculateTransactionFrequency(transactions);
  
  // Calculate percentages for category breakdown
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const updatedCategoryBreakdown = categoryBreakdown.map(item => ({
    ...item,
    percentage: totalExpense > 0 ? (item.total / totalExpense) * 100 : 0
  }));
  
  return {
    monthlySummary,
    categoryBreakdown: updatedCategoryBreakdown,
    savingsRateAnalysis,
    paymentMethods,
    transactionTrend,
    topCategories,
    financialHealth,
    frequency,
    summary: {
      totalTransactions: transactions.length,
      totalIncome: transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      totalExpense,
      netWorth: transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) - totalExpense,
      dateRange: {
        start: transactions.length > 0 
          ? transactions.reduce((min, t) => new Date(t.date) < new Date(min.date) ? t : min).date 
          : null,
        end: transactions.length > 0 
          ? transactions.reduce((max, t) => new Date(t.date) > new Date(max.date) ? t : max).date 
          : null
      }
    }
  };
};