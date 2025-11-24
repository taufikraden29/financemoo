import { useState } from "react";
import { INITIAL_ACHIEVEMENTS } from "../constants/achievements";
import { XP_REWARDS } from "../constants/achievements";
import { INITIAL_USER_STATS } from "../data/initialData";

export const useGamification = () => {
  const [userStats, setUserStats] = useState(INITIAL_USER_STATS);
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [showAchievementNotification, setShowAchievementNotification] = useState(null);

  const addXP = (amount) => {
    setUserStats((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / prev.xpToNextLevel) + prev.level;
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        showAchievementPopup({ 
          name: `Level ${newLevel} Reached!`, 
          reward: XP_REWARDS.LEVEL_UP, 
          icon: "Trophy" 
        });
      }

      return {
        ...prev,
        xp: newXP % prev.xpToNextLevel,
        level: newLevel,
        coinsEarned: prev.coinsEarned + amount,
      };
    });
  };

  const checkAchievement = (achievementName) => {
    const achievement = achievements.find(
      (a) => a.name === achievementName && !a.unlocked
    );
    if (achievement) {
      setAchievements(
        achievements.map((a) =>
          a.name === achievementName ? { ...a, unlocked: true } : a
        )
      );
      showAchievementPopup(achievement);
      addXP(achievement.reward);
    }
  };

  const showAchievementPopup = (achievement) => {
    setShowAchievementNotification(achievement);
    setTimeout(() => setShowAchievementNotification(null), 4000);
  };

  const incrementTransactionCount = () => {
    setUserStats(prev => ({ 
      ...prev, 
      totalTransactions: prev.totalTransactions + 1 
    }));
  };

  return {
    userStats,
    achievements,
    showAchievementNotification,
    addXP,
    checkAchievement,
    incrementTransactionCount,
  };
};
