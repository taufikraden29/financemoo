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
 * @returns {Array} Updated payment schedule
 */
export const updatePaymentSchedule = (paymentSchedule, paymentAmount) => {
    if (!paymentSchedule || paymentAmount <= 0) {
        return paymentSchedule;
    }

    const updatedSchedule = [...paymentSchedule];
    let remainingAmount = paymentAmount;

    // Find unpaid installments and apply payment
    for (let i = 0; i < updatedSchedule.length && remainingAmount > 0; i++) {
        const installment = updatedSchedule[i];

        if (installment.status !== 'paid') {
            if (remainingAmount >= installment.amount) {
                // Full payment for this installment
                installment.status = 'paid';
                installment.paidDate = new Date().toISOString().split('T')[0];
                installment.isPaid = true;
                remainingAmount -= installment.amount;
            } else {
                // Partial payment - for now, we don't handle partial payments
                // In a real system, you might want to track partial payments
                break;
            }
        }
    }

    return updatedSchedule;
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

    // Find the first unpaid installment
    return paymentSchedule.find(installment => installment.status !== 'paid') || null;
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

    return paymentSchedule.filter(installment =>
        installment.status === 'overdue' ||
        (installment.status !== 'paid' && new Date(installment.dueDate) < new Date())
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
