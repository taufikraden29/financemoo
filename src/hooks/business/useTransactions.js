import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';

export const useTransactions = () => {
  const [transactions, setTransactions] = useLocalStorage("transactions", []);

  const addTransaction = useCallback((transaction) => {
    setTransactions(prevTransactions => [transaction, ...prevTransactions]);
  }, []);

  const deleteTransaction = useCallback((transactionId) => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(t => t.id !== transactionId)
    );
  }, []);

  const updateTransaction = useCallback((transactionId, updates) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === transactionId ? { ...t, ...updates } : t
      )
    );
  }, []);

  return {
    transactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
};
