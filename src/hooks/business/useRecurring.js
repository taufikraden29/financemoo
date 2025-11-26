import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';
import { sendTelegramNotification } from './useTransactions';

export const useRecurring = () => {
  const [recurringTransactions, setRecurringTransactions] = useLocalStorage("recurringTransactions", []);

  const addRecurring = useCallback((recurringData) => {
    setRecurringTransactions(prevRecurring => [recurringData, ...prevRecurring]);
    // Send notification to Telegram bot
    sendTelegramNotification('recurring', recurringData);
  }, []);

  const deleteRecurring = useCallback((recurringId) => {
    const deletedRecurring = recurringTransactions.find(rt => rt.id === recurringId);
    setRecurringTransactions(prevRecurring =>
      prevRecurring.filter(rt => rt.id !== recurringId)
    );
    // Send notification to Telegram bot
    if (deletedRecurring) {
      sendTelegramNotification('recurring_delete', deletedRecurring);
    }
  }, [recurringTransactions]);

  const toggleRecurring = useCallback((recurringId) => {
    const recurring = recurringTransactions.find(rt => rt.id === recurringId);
    setRecurringTransactions(prevRecurring =>
      prevRecurring.map(rt =>
        rt.id === recurringId ? { ...rt, isActive: !rt.isActive } : rt
      )
    );
    // Send notification to Telegram bot
    if (recurring) {
      const updatedRecurring = { ...recurring, isActive: !recurring.isActive };
      sendTelegramNotification('recurring_update', updatedRecurring);
    }
  }, [recurringTransactions]);

  return {
    recurringTransactions,
    setRecurringTransactions,
    addRecurring,
    deleteRecurring,
    toggleRecurring,
  };
};

/**
 * Additional function to handle recurring transaction occurrences
 * @param {Object} recurring - The recurring transaction object
 * @returns {void}
 */
export const handleRecurringOccurrence = async (recurring) => {
  // This would be called when a recurring transaction occurs
  // For example, when a recurring payment is due
  await sendTelegramNotification('recurring_occurrence', recurring);
};
