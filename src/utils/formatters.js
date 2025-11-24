export const formatCurrency = (amount, hideBalance = false) => {
  if (hideBalance) return "Rp ••••••";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date, format = "long") => {
  const dateObj = new Date(date);
  
  if (format === "long") {
    return dateObj.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  
  if (format === "short") {
    return dateObj.toLocaleDateString("id-ID", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  }
  
  return dateObj.toLocaleDateString("id-ID");
};

export const calculateNextDate = (startDate, frequency) => {
  const date = new Date(startDate);
  if (frequency === "daily") date.setDate(date.getDate() + 1);
  else if (frequency === "weekly") date.setDate(date.getDate() + 7);
  else if (frequency === "monthly") date.setMonth(date.getMonth() + 1);
  else if (frequency === "yearly") date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split("T")[0];
};

export const calculateDaysUntilDue = (dueDate) => {
  return Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
};

export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const formatCurrencyInput = (value) => {
  // Remove all non-numeric characters except for handling backspace properly
  let numericValue = value.replace(/\D/g, '');

  // Convert to number and format with thousands separators
  if (numericValue) {
    const numValue = parseInt(numericValue, 10);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numValue);
  }

  return '';
};

export const parseCurrencyInput = (formattedValue) => {
  // Remove currency symbols and return only the numeric value
  return formattedValue.replace(/[^\d]/g, '') || '';
};
