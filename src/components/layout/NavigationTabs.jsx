const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "budget", label: "Budget" },
    { id: "debt", label: "Hutang" },
    { id: "recurring", label: "Rutin" },
    { id: "transactions", label: "Transaksi" },
    { id: "achievements", label: "Awards" },
    { id: "analytics", label: "Analitik" },
  ];

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 mb-4 md:mb-6 p-1 md:p-2">
      <div className="grid grid-cols-7 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 md:py-3 px-1 md:px-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;
