import { useState } from "react";
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from "../data/initialData";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState(INITIAL_BUDGETS);

  const addTransaction = (newTransaction) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    
    // If it's an expense, reduce the budget spent
    if (transaction && transaction.type === "expense" && budgets[transaction.category]) {
      setBudgets({
        ...budgets,
        [transaction.category]: {
          ...budgets[transaction.category],
          spent: Math.max(0, budgets[transaction.category].spent - transaction.amount),
        },
      });
    }
    
    setTransactions(transactions.filter(t => t.id !== transactionId));
  };

  const updateBudgetSpent = (category, amount) => {
    if (budgets[category]) {
      setBudgets({
        ...budgets,
        [category]: {
          ...budgets[category],
          spent: budgets[category].spent + amount,
        },
      });
    }
  };

  const setBudget = (category, limit) => {
    setBudgets({
      ...budgets,
      [category]: {
        limit,
        spent: budgets[category]?.spent || 0,
      },
    });
  };

  const deleteBudget = (category) => {
    const { [category]: removed, ...rest } = budgets;
    setBudgets(rest);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topExpenses = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    transactions,
    budgets,
    totalIncome,
    totalExpense,
    balance,
    expenseByCategory,
    topExpenses,
    addTransaction,
    deleteTransaction,
    updateBudgetSpent,
    setBudget,
    deleteBudget,
  };
};
