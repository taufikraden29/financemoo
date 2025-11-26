import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';
import { sendTelegramNotification } from './useTransactions';

export const useBudgets = () => {
    const [budgets, setBudgets] = useLocalStorage("budgets", {});

    const setBudget = useCallback((category, budget) => {
        setBudgets(prevBudgets => ({
            ...prevBudgets,
            [category]: budget,
        }));
        // Send notification to Telegram bot
        sendTelegramNotification('budget', { category, limit: budget });
    }, []);

    const deleteBudget = useCallback((category) => {
        const deletedBudget = budgets[category];
        setBudgets(prevBudgets => {
            const newBudgets = { ...prevBudgets };
            delete newBudgets[category];
            return newBudgets;
        });
        // Send notification to Telegram bot
        if (deletedBudget) {
            sendTelegramNotification('budget_delete', { category, limit: deletedBudget });
        }
    }, [budgets]);

    return {
        budgets,
        setBudgets,
        setBudget,
        deleteBudget,
    };
};
