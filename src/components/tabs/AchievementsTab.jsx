import React, { useState } from 'react';
import { Trophy, Star, Lock, Filter } from 'lucide-react';
import AchievementCard from '../features/achievements/AchievementCard';
import { getIconComponent } from '../../utils/helpers/iconMapper';

const AchievementsTab = ({ achievements, userStats }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'unlocked') return achievement.unlocked;
    if (filterStatus === 'locked') return !achievement.unlocked;
    return true;
  });

  const statistics = {
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter(a => a.unlocked).length,
    totalXPEarned: achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.reward, 0),
    completionRate: achievements.length > 0 
      ? (achievements.filter(a => a.unlocked).length / achievements.length) * 100 
      : 0,
  };

  const getAchievementCategory = (achievement) => {
    // Categorize achievements based on their names or descriptions
    const name = achievement.name.toLowerCase();
    if (name.includes('transaksi') || name.includes('transaction')) return 'transactions';
    if (name.includes('budget') || name.includes('pengeluaran')) return 'budget';
    if (name.includes('cicilan') || name.includes('debt')) return 'debt';
    if (name.includes('hari') || name.includes('streak')) return 'streak';
    return 'general';
  };

  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    const category = getAchievementCategory(achievement);
    if (!acc[category]) acc[category] = [];
    acc[category].push(achievement);
    return acc;
  }, {});

  const categoryLabels = {
    transactions: 'Transaksi',
    budget: 'Budget',
    debt: 'Cicilan',
    streak: 'Streak',
    general: 'Umum',
  };

  const categoryColors = {
    transactions: 'blue',
    budget: 'green',
    debt: 'orange',
    streak: 'purple',
    general: 'gray',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pencapaian</h2>
          <p className="text-gray-600">Kelola dan pantau pencapaian keuangan Anda</p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-lg font-bold text-gray-900">
            Level {userStats.level}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-100 text-sm font-medium">Total Pencapaian</span>
            <Trophy className="w-5 h-5 text-yellow-100" />
          </div>
          <p className="text-2xl font-bold">{statistics.totalAchievements}</p>
          <p className="text-yellow-100 text-xs">Available</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Tercapai</span>
            <Star className="w-5 h-5 text-green-100" />
          </div>
          <p className="text-2xl font-bold">{statistics.unlockedAchievements}</p>
          <p className="text-green-100 text-xs">Unlocked</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100 text-sm font-medium">Total XP</span>
            <Star className="w-5 h-5 text-purple-100" />
          </div>
          <p className="text-2xl font-bold">{statistics.totalXPEarned}</p>
          <p className="text-purple-100 text-xs">Points</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100 text-sm font-medium">Progress</span>
            <Filter className="w-5 h-5 text-blue-100" />
          </div>
          <p className="text-2xl font-bold">{statistics.completionRate.toFixed(1)}%</p>
          <p className="text-blue-100 text-xs">Complete</p>
        </div>
      </div>

      {/* User Progress */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Anda</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Level {userStats.level}</span>
              <span className="text-sm text-gray-600">
                {userStats.currentXP} / {userStats.xpToNextLevel} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${(userStats.currentXP / userStats.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalTransactions || 0}</p>
              <p className="text-sm text-gray-600">Transaksi</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak || 0}</p>
              <p className="text-sm text-gray-600">Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{statistics.unlockedAchievements}</p>
              <p className="text-sm text-gray-600">Pencapaian</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter Status:</label>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Semua' },
              { value: 'unlocked', label: 'Tercapai' },
              { value: 'locked', label: 'Tercapai' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === filter.value
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements by Category */}
      <div className="space-y-6">
        {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
          <div key={category} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-${categoryColors[category]}-100 rounded-lg`}>
                <Trophy className={`w-5 h-5 text-${categoryColors[category]}-600`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {categoryLabels[category]} ({categoryAchievements.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  getIconComponent={getIconComponent}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Locked Achievements Preview */}
      {filterStatus === 'locked' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cara Membuka Pencapaian</h3>
          <div className="space-y-3">
            {filteredAchievements.slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Lock className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600">+{achievement.reward} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsTab;
