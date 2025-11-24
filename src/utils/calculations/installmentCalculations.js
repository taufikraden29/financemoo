/**
 * Installment Calculation Utilities for Personal Debt Management
 * Using Flat Rate Method: cicilan per bulan = total hutang / jumlah cicilan
 */

/**
 * Calculate monthly installment amount using flat rate method
 * @param {number} totalAmount - Total debt amount
 * @param {number} installmentCount - Number of installments
 * @returns {number} Monthly installment amount
 */
export const calculateInstallmentAmount = (totalAmount, installmentCount) => {
    if (!totalAmount || !installmentCount || installmentCount <= 0) {
        return 0;
    }
    return Math.round(totalAmount / installmentCount);
};

/**
 * Generate complete installment payment schedule
 * @param {Object} debt - Debt object with necessary properties
 * @returns {Array} Array of installment schedule objects
 */
export const generateInstallmentSchedule = (debt) => {
    const { totalAmount, installmentCount, loanDate } = debt;

    if (!totalAmount || !installmentCount || !loanDate) {
        return [];
    }

    const installmentAmount = calculateInstallmentAmount(totalAmount, installmentCount);
    const schedule = [];

    for (let i = 1; i <= installmentCount; i++) {
        // Calculate due date - loan date + i months
        const dueDate = new Date(loanDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        schedule.push({
            id: `installment-${debt.id}-${i}`,
            installmentNumber: i,
            dueDate: dueDate.toISOString().split('T')[0],
            amount: installmentAmount,
            status: getInstallmentStatus(dueDate, null),
            paidDate: null,
            isPaid: false,
            type: 'installment'
        });
    }

    return schedule;
};

/**
 * Get installment status based on due date and paid date
 * @param {string} dueDate - Due date of installment
 * @param {string|null} paidDate - Date when installment was paid
 * @returns {string} Status: 'paid', 'unpaid', 'overdue'
 */
export const getInstallmentStatus = (dueDate, paidDate) => {
    if (paidDate) {
        return 'paid';
    }

    const today = new Date();
    const due = new Date(dueDate);

    if (today > due) {
        return 'overdue';
    }

    return 'unpaid';
};

/**
 * Calculate remaining debt balance
 * @param {Array} paymentSchedule - Array of installment payment schedule
 * @returns {number} Remaining debt amount
 */
export const calculateRemainingDebt = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) {
        return 0;
    }

    const unpaidInstallments = paymentSchedule.filter(installment => installment.status !== 'paid');
    return unpaidInstallments.reduce((total, installment) => total + installment.amount, 0);
};

/**
 * Calculate remaining debt balance (recalculated without relying on status)
 * @param {Array} paymentSchedule - Array of installment payment schedule
 * @returns {number} Remaining debt amount
 */
export const calculateRemainingDebtRecalculated = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) {
        return 0;
    }

    let remaining = 0;
    paymentSchedule.forEach(installment => {
        if (installment.status !== 'paid') {
            remaining += installment.amount;
        }
    });
    return remaining;
};

/**
 * Calculate total paid amount
 * @param {Array} paymentSchedule - Array of installment payment schedule
 * @returns {number} Total paid amount
 */
export const calculatePaidAmount = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) {
        return 0;
    }

    const paidInstallments = paymentSchedule.filter(installment => installment.status === 'paid');
    return paidInstallments.reduce((total, installment) => total + installment.amount, 0);
};

/**
 * Calculate total paid amount (recalculated without relying on status)
 * @param {Array} paymentSchedule - Array of installment payment schedule
 * @returns {number} Total paid amount
 */
export const calculatePaidAmountRecalculated = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) {
        return 0;
    }

    let paid = 0;
    paymentSchedule.forEach(installment => {
        if (installment.status === 'paid') {
            paid += installment.amount;
        }
    });
    return paid;
};

/**
 * Calculate payment progress percentage
 * @param {Array} paymentSchedule - Array of installment payment schedule
 * @returns {number} Progress percentage (0-100)
 */
export const calculatePaymentProgress = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) {
        return 0;
    }

    const totalInstallments = paymentSchedule.length;
    const paidInstallments = paymentSchedule.filter(installment => installment.status === 'paid').length;

    return Math.round((paidInstallments / totalInstallments) * 100);
};

/**
 * Update installment payment schedule after payment
 * @param {Array} paymentSchedule - Current payment schedule
 * @param {number} paymentAmount - Amount paid
 * @param {number} installmentIndex - Index of the specific installment to pay (optional)
 * @returns {Object} Updated payment schedule and payment info
 */
export const updatePaymentSchedule = (paymentSchedule, paymentAmount, installmentIndex = null) => {
    if (!paymentSchedule || paymentAmount <= 0) {
        return { updatedSchedule: paymentSchedule, paymentInfo: { amountPaid: 0, installmentsPaid: 0, isFullyPaid: false, remainingAmount: paymentAmount } };
    }

    // Create a deep copy to avoid mutation issues
    const updatedSchedule = paymentSchedule.map(item => ({ ...item }));

    // If a specific installment is targeted
    if (installmentIndex !== null && installmentIndex >= 0 && installmentIndex < updatedSchedule.length) {
        const installment = updatedSchedule[installmentIndex];

        if (installment.status !== 'paid' && paymentAmount >= installment.amount) {
            // Pay the specific installment
            installment.status = 'paid';
            installment.paidDate = new Date().toISOString().split('T')[0];
            installment.isPaid = true;

            const remainingDebt = calculateRemainingDebt(updatedSchedule);

            return {
                updatedSchedule,
                paymentInfo: {
                    amountPaid: installment.amount,
                    installmentsPaid: 1,
                    isFullyPaid: remainingDebt === 0,
                    remainingAmount: paymentAmount - installment.amount
                }
            };
        } else {
            // Cannot fully pay the specific installment
            return {
                updatedSchedule: paymentSchedule, // Return original if cannot pay installment
                paymentInfo: {
                    amountPaid: 0,
                    installmentsPaid: 0,
                    isFullyPaid: false,
                    remainingAmount: paymentAmount
                }
            };
        }
    }

    // Default behavior: pay in order of due date (earliest first)
    let remainingAmount = paymentAmount;
    let installmentsPaidCount = 0;
    let totalAmountPaid = 0;

    // Get indexes of unpaid installments, sorted by priority
    const sortedIndexes = updatedSchedule
        .map((_, index) => index)
        .filter(index => updatedSchedule[index].status !== 'paid')
        .sort((a, b) => {
            // Sort by due date, with overdue payments first
            const dateA = new Date(updatedSchedule[a].dueDate);
            const dateB = new Date(updatedSchedule[b].dueDate);
            const aIsOverdue = dateA < new Date();
            const bIsOverdue = dateB < new Date();

            // Prioritize overdue payments
            if (aIsOverdue && !bIsOverdue) return -1;
            if (!aIsOverdue && bIsOverdue) return 1;
            // Then sort by due date
            return dateA - dateB;
        });

    for (const index of sortedIndexes) {
        if (remainingAmount <= 0) break;

        const installment = updatedSchedule[index];

        if (installment.status !== 'paid' && remainingAmount >= installment.amount) {
            // Full payment for this installment
            installment.status = 'paid';
            installment.paidDate = new Date().toISOString().split('T')[0];
            installment.isPaid = true;
            remainingAmount -= installment.amount;
            totalAmountPaid += installment.amount;
            installmentsPaidCount++;
        } else if (installment.status !== 'paid' && remainingAmount > 0 && remainingAmount < installment.amount) {
            // Partial payment not allowed - return original schedule
            return {
                updatedSchedule: paymentSchedule, // Return original if cannot make a full payment
                paymentInfo: {
                    amountPaid: 0,
                    installmentsPaid: 0,
                    isFullyPaid: false,
                    remainingAmount: paymentAmount
                }
            };
        }
    }

    const remainingDebt = calculateRemainingDebt(updatedSchedule);

    return {
        updatedSchedule,
        paymentInfo: {
            amountPaid: totalAmountPaid,
            installmentsPaid: installmentsPaidCount,
            isFullyPaid: remainingDebt === 0,
            remainingAmount
        }
    };
};

/**
 * Get next unpaid installment
 * @param {Array} paymentSchedule - Array of installment payment schedule
 * @returns {Object|null} Next unpaid installment or null
 */
export const getNextUnpaidInstallment = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) {
        return null;
    }

    const today = new Date();
    // Find the first unpaid installment that is due or has a due date (not in the past if already overdue)
    const unpaidInstallments = paymentSchedule.filter(installment => installment.status !== 'paid');

    // Prioritize overdue installments first
    const overdue = unpaidInstallments.find(installment => new Date(installment.dueDate) < today);
    if (overdue) return overdue;

    // Return the next upcoming unpaid installment
    return unpaidInstallments[0] || null;
};

/**
 * Calculate days until next installment is due
 * @param {Object} installment - Installment object
 * @returns {number} Days until due (negative if overdue)
 */
export const calculateDaysUntilDue = (installment) => {
    if (!installment || installment.status === 'paid') {
        return null;
    }

    const today = new Date();
    const dueDate = new Date(installment.dueDate);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get overdue installments
 * @param {Array} paymentSchedule - Array of installment payment schedule
 * @returns {Array} Array of overdue installments
 */
export const getOverdueInstallments = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) {
        return [];
    }

    const today = new Date();
    return paymentSchedule.filter(installment =>
        installment.status !== 'paid' && new Date(installment.dueDate) < today
    );
};

/**
 * Get installment summary statistics
 * @param {Array} paymentSchedule - Array of installment payment schedule
 * @returns {Object} Summary statistics
 */
export const getInstallmentSummary = (paymentSchedule) => {
    if (!paymentSchedule || paymentSchedule.length === 0) {
        return {
            totalInstallments: 0,
            paidInstallments: 0,
            unpaidInstallments: 0,
            overdueInstallments: 0,
            totalAmount: 0,
            paidAmount: 0,
            remainingAmount: 0,
            progressPercentage: 0,
            nextInstallment: null,
            overdueInstallments: []
        };
    }

    const totalInstallments = paymentSchedule.length;
    const paidInstallments = paymentSchedule.filter(i => i.status === 'paid');
    const unpaidInstallments = paymentSchedule.filter(i => i.status === 'unpaid');
    const overdueInstallments = getOverdueInstallments(paymentSchedule);

    const totalAmount = paymentSchedule.reduce((sum, i) => sum + i.amount, 0);
    const paidAmount = calculatePaidAmount(paymentSchedule);
    const remainingAmount = calculateRemainingDebt(paymentSchedule);
    const progressPercentage = calculatePaymentProgress(paymentSchedule);
    const nextInstallment = getNextUnpaidInstallment(paymentSchedule);

    return {
        totalInstallments,
        paidInstallments: paidInstallments.length,
        unpaidInstallments: unpaidInstallments.length,
        overdueInstallments: overdueInstallments.length,
        totalAmount,
        paidAmount,
        remainingAmount,
        progressPercentage,
        nextInstallment,
        overdueInstallments
    };
};
