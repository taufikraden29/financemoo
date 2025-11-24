const exportData = (transactions, budgets, recurringTransactions, savingsGoal, userStats, achievements) => {
  const exportData = {
    transactions,
    budgets,
    recurringTransactions,
    savingsGoal,
    userStats,
    achievements,
    exportDate: new Date().toISOString(),
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

export default exportData;
