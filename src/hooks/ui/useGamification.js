import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';

export const useGamification = () => {
  const [userStats, setUserStats] = useLocalStorage("userStats", {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalTransactions: 0,
    streakDays: 0,
    coinsEarned: 0,
    creditScore: 300,
  });

  const addXP = useCallback((amount) => {
    setUserStats(prevStats => {
      const newXP = prevStats.xp + amount;
      const newLevel = Math.floor(newXP / prevStats.xpToNextLevel) + prevStats.level;
      const leveledUp = newLevel > prevStats.level;

      if (leveledUp) {
        toast.success(`🎉 Level up! You're now level ${newLevel}!`);
      }

      return {
        ...prevStats,
        xp: newXP % prevStats.xpToNextLevel,
        level: newLevel,
        coinsEarned: prevStats.coinsEarned + amount,
      };
    });
  }, []);

  return {
    userStats,
    addXP,
  };
};
