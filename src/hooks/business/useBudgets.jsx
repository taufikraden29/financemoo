import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';

export const useBudgets = () => {
    const [budgets, setBudgets] = useLocalStorage("budgets", {});

    const setBudget = useCallback((category, budget) => {
        setBudgets(prevBudgets => ({
            ...prevBudgets,
            [category]: budget,
        }));
    }, []);

    const deleteBudget = useCallback((category) => {
        setBudgets(prevBudgets => {
            const newBudgets = { ...prevBudgets };
            delete newBudgets[category];
            return newBudgets;
        });
    }, []);

    return {
        budgets,
        setBudget,
        deleteBudget,
    };
};
