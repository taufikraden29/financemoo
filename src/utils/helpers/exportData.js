// Export all data function
export const exportData = (transactions, budgets, recurringTransactions, installments, userStats, achievements) => {
  const exportData = {
    transactions,
    budgets,
    recurringTransactions,
    installments,
    userStats,
    achievements,
    exportDate: new Date().toISOString(),
    appVersion: "1.0.0" // Add version info for future compatibility
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `moneypro-data-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Import data function
export const importData = (file, onDataImport) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);

        // Validate required fields
        if (!importedData.transactions || !importedData.budgets) {
          reject(new Error('Invalid data format: missing required fields'));
          return;
        }

        // Provide default values for missing optional fields
        const dataToImport = {
          transactions: importedData.transactions || [],
          budgets: importedData.budgets || {},
          recurringTransactions: importedData.recurringTransactions || [],
          installments: importedData.installments || [],
          userStats: importedData.userStats || {
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            totalTransactions: 0,
            streakDays: 0,
            coinsEarned: 0,
            creditScore: 300
          },
          achievements: importedData.achievements || [
            { id: 1, name: "First Transaction", description: "Add your first transaction", unlocked: false, icon: "Star", reward: 50 },
            { id: 2, name: "Budget Master", description: "Set budget for 5 categories", unlocked: false, icon: "Target", reward: 100 },
            { id: 3, name: "Savings Hero", description: "Save 20% of income", unlocked: false, icon: "Trophy", reward: 150 },
            { id: 4, name: "Debt Free", description: "Pay off all debts", unlocked: false, icon: "CheckCircle", reward: 200 },
            { id: 5, name: "Consistent Tracker", description: "7-day tracking streak", unlocked: false, icon: "Zap", reward: 100 },
            { id: 6, name: "Budget Guardian", description: "Stay under budget for 3 months", unlocked: false, icon: "Award", reward: 250 },
          ]
        };

        onDataImport(dataToImport);
        resolve(dataToImport);
      } catch (error) {
        reject(new Error('Failed to parse imported data: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};
