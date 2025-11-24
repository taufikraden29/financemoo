import React from 'react';
import { Trophy, Zap } from 'lucide-react';

const UserLevelBanner = ({ userStats }) => {
    return (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-4 mb-4 text-white shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-3 rounded-full">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Level {userStats.level}</p>
                        <p className="text-2xl font-bold">{userStats.coinsEarned} Coins</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs opacity-75">XP Progress</p>
                    <p className="font-bold">{userStats.xp} / {userStats.xpToNextLevel}</p>
                    <div className="w-32 bg-white/30 rounded-full h-2 mt-1">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(userStats.xp / userStats.xpToNextLevel) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLevelBanner;
