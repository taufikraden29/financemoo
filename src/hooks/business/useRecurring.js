import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';

export const useRecurring = () => {
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage("recurringTransactions", []);

  const addRecurring = useCallback((recurringData) => {
    setRecurringTransactions(prevRecurring => [recurringData, ...prevRecurring]);
  }, []);

  const deleteRecurring = useCallback((recurringId) => {
    setRecurringTransactions(prevRecurring =>
      prevRecurring.filter(rt => rt.id !== recurringId)
    );
  }, []);

  const toggleRecurring = useCallback((recurringId) => {
    setRecurringTransactions(prevRecurring =>
      prevRecurring.map(rt =>
        rt.id === recurringId ? { ...rt, isActive: !rt.isActive } : rt
      )
    );
  }, []);

  return {
    recurringTransactions,
    setRecurringTransactions,
    addRecurring,
    deleteRecurring,
    toggleRecurring,
  };
};
