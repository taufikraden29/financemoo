/**
 * Validation utilities for MoneyPro financial application
 */

/**
 * Validate transaction data
 * @param {Object} transaction - Transaction object to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateTransaction = (transaction) => {
  const errors = [];
  
  if (!transaction) {
    errors.push('Transaction data is required');
    return { isValid: false, errors };
  }
  
  // Validate amount
  if (!transaction.amount || isNaN(transaction.amount) || parseFloat(transaction.amount) <= 0) {
    errors.push('Amount must be a positive number');
  } else if (parseFloat(transaction.amount) > 999999999) { // Max 999 million
    errors.push('Amount is too large');
  }
  
  // Validate type
  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.push('Type must be either "income" or "expense"');
  }
  
  // Validate category
  if (!transaction.category || transaction.category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  // Validate description (optional but should not be too long)
  if (transaction.description && transaction.description.length > 500) {
    errors.push('Description is too long (max 500 characters)');
  }
  
  // Validate payment method
  if (!transaction.paymentMethod || !['cash', 'bank', 'card', 'digital'].includes(transaction.paymentMethod)) {
    errors.push('Payment method must be cash, bank, card, or digital');
  }
  
  // Validate date
  if (!transaction.date) {
    errors.push('Date is required');
  } else {
    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) {
      errors.push('Date is invalid');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate budget data
 * @param {string} category - Budget category
 * @param {number} limit - Budget limit
 * @returns {Object} Validation result with isValid and errors
 */
export const validateBudget = (category, limit) => {
  const errors = [];
  
  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  if (!limit || isNaN(limit) || parseFloat(limit) <= 0) {
    errors.push('Budget limit must be a positive number');
  } else if (parseFloat(limit) > 999999999) {
    errors.push('Budget limit is too large');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate recurring transaction data
 * @param {Object} recurringData - Recurring transaction data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateRecurring = (recurringData) => {
  const errors = [];
  
  if (!recurringData) {
    errors.push('Recurring transaction data is required');
    return { isValid: false, errors };
  }
  
  // Validate amount
  if (!recurringData.amount || isNaN(recurringData.amount) || parseFloat(recurringData.amount) <= 0) {
    errors.push('Amount must be a positive number');
  }
  
  // Validate type
  if (!recurringData.type || !['income', 'expense'].includes(recurringData.type)) {
    errors.push('Type must be either "income" or "expense"');
  }
  
  // Validate category
  if (!recurringData.category || recurringData.category.trim().length === 0) {
    errors.push('Category is required');
  }
  
  // Validate frequency
  if (!recurringData.frequency || !['daily', 'weekly', 'monthly', 'yearly'].includes(recurringData.frequency)) {
    errors.push('Frequency must be daily, weekly, monthly, or yearly');
  }
  
  // Validate startDate
  if (!recurringData.startDate) {
    errors.push('Start date is required');
  } else {
    const date = new Date(recurringData.startDate);
    if (isNaN(date.getTime())) {
      errors.push('Start date is invalid');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate installment data
 * @param {Object} installmentData - Installment data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateInstallment = (installmentData) => {
  const errors = [];
  
  if (!installmentData) {
    errors.push('Installment data is required');
    return { isValid: false, errors };
  }
  
  // Validate name
  if (!installmentData.name || installmentData.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (installmentData.name.length > 100) {
    errors.push('Name is too long (max 100 characters)');
  }
  
  // Validate total amount
  if (!installmentData.totalAmount || isNaN(installmentData.totalAmount) || parseFloat(installmentData.totalAmount) <= 0) {
    errors.push('Total amount must be a positive number');
  } else if (parseFloat(installmentData.totalAmount) > 9999999999) { // Max 9.9 billion
    errors.push('Total amount is too large');
  }
  
  // Validate installment count
  if (!installmentData.installmentCount || isNaN(installmentData.installmentCount) || parseInt(installmentData.installmentCount) <= 0) {
    errors.push('Installment count must be a positive number');
  } else if (parseInt(installmentData.installmentCount) > 120) { // Max 10 years with monthly installments
    errors.push('Installment count is too high (max 120 installments)');
  }
  
  // Validate loan date
  if (!installmentData.loanDate) {
    errors.push('Loan date is required');
  } else {
    const date = new Date(installmentData.loanDate);
    if (isNaN(date.getTime())) {
      errors.push('Loan date is invalid');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate cash account transaction
 * @param {Object} transaction - Cash account transaction
 * @returns {Object} Validation result with isValid and errors
 */
export const validateCashAccountTransaction = (transaction) => {
  const errors = [];
  
  if (!transaction) {
    errors.push('Transaction data is required');
    return { isValid: false, errors };
  }
  
  if (!transaction.type || !['add', 'subtract'].includes(transaction.type)) {
    errors.push('Type must be either "add" or "subtract"');
  }
  
  if (!transaction.amount || isNaN(transaction.amount) || parseFloat(transaction.amount) <= 0) {
    errors.push('Amount must be a positive number');
  } else if (parseFloat(transaction.amount) > 999999999) {
    errors.push('Amount is too large');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate transfer transaction
 * @param {Object} transfer - Transfer data
 * @returns {Object} Validation result with isValid and errors
 */
export const validateTransfer = (transfer) => {
  const errors = [];
  
  if (!transfer) {
    errors.push('Transfer data is required');
    return { isValid: false, errors };
  }
  
  if (transfer.from === transfer.to) {
    errors.push('Source and destination cannot be the same');
  }
  
  if (!transfer.from || !['cash', 'digital'].includes(transfer.from)) {
    errors.push('Source must be either "cash" or "digital"');
  }
  
  if (!transfer.to || !['cash', 'digital'].includes(transfer.to)) {
    errors.push('Destination must be either "cash" or "digital"');
  }
  
  if (!transfer.amount || isNaN(transfer.amount) || parseFloat(transfer.amount) <= 0) {
    errors.push('Amount must be a positive number');
  } else if (parseFloat(transfer.amount) > 999999999) {
    errors.push('Amount is too large');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Format validation errors for display
 * @param {Array} errors - Array of error messages
 * @returns {string} Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!errors || errors.length === 0) return '';
  return errors.join('\n');
};