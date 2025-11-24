import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';

/**
 * Custom hook for managing transactions
 * Provides state and functions for transaction operations
 * @returns {Object} Transaction management functions and state
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useLocalStorage("transactions", []);

  /**
   * Adds a new transaction to the list
   * @param {Object} transaction - Transaction object to add
   * @param {string} transaction.id - Unique identifier for the transaction
   * @param {string} transaction.type - Transaction type ('income' or 'expense')
   * @param {number} transaction.amount - Transaction amount
   * @param {string} transaction.category - Category of the transaction
   * @param {string} transaction.description - Description of the transaction
   * @param {string} transaction.paymentMethod - Payment method ('cash', 'bank', 'card', 'digital')
   * @param {string} transaction.date - Date of the transaction (YYYY-MM-DD)
   * @returns {void}
   */
  const addTransaction = useCallback((transaction) => {
    setTransactions(prevTransactions => [transaction, ...prevTransactions]);
  }, []);

  /**
   * Deletes a transaction by its ID
   * @param {string} transactionId - ID of the transaction to delete
   * @returns {void}
   */
  const deleteTransaction = useCallback((transactionId) => {
    setTransactions(prevTransactions =>
      prevTransactions.filter(t => t.id !== transactionId)
    );
  }, []);

  /**
   * Updates a transaction with new data
   * @param {string} transactionId - ID of the transaction to update
   * @param {Object} updates - Object containing properties to update
   * @returns {void}
   */
  const updateTransaction = useCallback((transactionId, updates) => {
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === transactionId ? { ...t, ...updates } : t
      )
    );
  }, []);

  return {
    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
};
