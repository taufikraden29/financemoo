import React from 'react';
import { Trophy, Star, Gift } from 'lucide-react';

const AchievementCard = ({ achievement, getIconComponent }) => {
    return (
        <div
            key={achievement.id}
            className={`rounded-2xl shadow-lg border-2 p-6 transition-all ${achievement.unlocked
                ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200"
                : "bg-gray-50 border-gray-200 opacity-70"
                }`}
        >
            <div className="flex items-start space-x-4">
                <div
                    className={`p-4 rounded-xl ${achievement.unlocked
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                        : "bg-gray-200 text-gray-400"
                        }`}
                >
                    <getIconComponent
                        className={`w-8 h-8 ${achievement.unlocked ? "text-white" : "text-gray-400"}`}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                            {achievement.name}
                        </h3>
                        <div className="flex items-center">
                            <h3 className="text-lg font-bold text-gray-900">
                                {achievement.name}
                            </h3>
                            {achievement.unlocked && (
                                <div className="ml-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="3"
                                            d="M5 13l4 4L4 20M4 20L4 14M4 4"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                        {achievement.description}
                    </p>
                    <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-bold text-amber-600">
                            +{achievement.reward} XP
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementCard;
