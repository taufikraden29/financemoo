import React from "react";
import { AlertCircle } from "lucide-react";
import { getIconComponent } from "../../utils/iconMapper";

export const AchievementNotification = ({ achievement }) => {
  if (!achievement) return null;

  const Icon = getIconComponent(achievement.icon);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 max-w-sm">
        <div className="bg-white/30 p-2 rounded-full">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-base">Achievement Unlocked! 🎉</p>
          <p className="text-sm opacity-90">{achievement.name}</p>
          <p className="text-xs opacity-75">+{achievement.reward} XP</p>
        </div>
      </div>
    </div>
  );
};

export const BudgetWarning = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 md:space-x-3 max-w-sm">
        <AlertCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
        <div>
          <p className="font-bold text-sm md:text-base">Budget Alert! 🚨</p>
          <p className="text-xs md:text-sm opacity-90">
            Ada kategori yang hampir melebihi budget
          </p>
        </div>
      </div>
    </div>
  );
};
