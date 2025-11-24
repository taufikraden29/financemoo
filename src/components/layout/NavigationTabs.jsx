import React from 'react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 mb-4 md:mb-6 p-1 md:p-2">
      <div className="grid grid-cols-6 gap-1">
        {["overview", "budget", "installments", "recurring", "transactions", "achievements", "analytics"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === tab
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
