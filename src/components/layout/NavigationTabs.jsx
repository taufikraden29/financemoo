import React from 'react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  // Define tab configuration with icons
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'transactions', label: 'Transaksi', icon: '📝' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'installments', label: 'Cicilan', icon: '💳' },
    { id: 'recurring', label: 'Recurring', icon: '🔄' },
    { id: 'analytics', label: 'Analisis', icon: '📈' },
    { id: 'achievements', label: 'Prestasi', icon: '🏆' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 mb-4 p-1 overflow-x-auto">
      {/* Responsive Grid - works for both mobile and desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center min-h-[40px] ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            <span className="text-sm sm:text-base mb-1">{tab.icon}</span>
            <span className="text-xs sm:text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
