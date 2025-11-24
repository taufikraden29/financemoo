import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';

export const useAchievements = () => {
    const [achievements, setAchievements] = useLocalStorage("achievements", [
        { id: 1, name: "First Transaction", description: "Add your first transaction", unlocked: false, icon: "Star", reward: 50 },
        { id: 2, name: "Budget Master", description: "Set budget for 5 categories", unlocked: false, icon: "Target", reward: 100 },
        { id: 3, name: "Savings Hero", description: "Save 20% of income", unlocked: false, icon: "Trophy", reward: 150 },
        { id: 4, name: "Debt Free", description: "Pay off all debts", unlocked: false, icon: "CheckCircle", reward: 200 },
        { id: 5, name: "Consistent Tracker", description: "7-day tracking streak", unlocked: false, icon: "Zap", reward: 100 },
        { id: 6, name: "Budget Guardian", description: "Stay under budget for 3 months", unlocked: false, icon: "Award", reward: 250 },
    ]);

    const unlockAchievement = useCallback((achievementId) => {
        setAchievements(prevAchievements =>
            prevAchievements.map(a =>
                a.id === achievementId ? { ...a, unlocked: true } : a
            )
        );
    }, []);

    const checkAchievement = useCallback((achievementName) => {
        const achievement = achievements.find((a) => a.name === achievementName && !a.unlocked);
        if (achievement) {
            return achievement.id;
        }
        return null;
    }, [achievements]);

    return {
        achievements,
        setAchievements,
        unlockAchievement,
        checkAchievement,
    };
};
