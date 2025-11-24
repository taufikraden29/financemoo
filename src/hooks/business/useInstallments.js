import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';
import {
    generateInstallmentSchedule,
    updatePaymentSchedule,
    getInstallmentSummary,
    calculateRemainingDebt,
    calculatePaidAmount,
    calculateInstallmentAmount
} from '../../utils/calculations';

export const useInstallments = () => {
    const [installments, setInstallments] = useLocalStorage("installments", []);

    /**
     * Add a new installment debt
     * @param {Object} installmentData - Installment data
     * @returns {Object} Created installment
     */
    const addInstallment = useCallback((installmentData) => {
        const newInstallment = {
            id: Date.now(),
            name: installmentData.name,
            description: installmentData.description || '',
            totalAmount: parseFloat(installmentData.totalAmount),
            installmentCount: parseInt(installmentData.installmentCount),
            loanDate: installmentData.loanDate,
            installmentAmount: calculateInstallmentAmount(
                parseFloat(installmentData.totalAmount),
                parseInt(installmentData.installmentCount)
            ),
            paymentSchedule: [],
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active', // active, completed, cancelled
            category: installmentData.category || 'personal',
            creditor: installmentData.creditor || '',
            ...installmentData
        };

        // Generate payment schedule
        newInstallment.paymentSchedule = generateInstallmentSchedule(newInstallment);

        setInstallments(prev => [newInstallment, ...prev]);
        return newInstallment;
    }, []);

    /**
     * Make a payment towards an installment
     * @param {number} installmentId - ID of the installment
     * @param {number} paymentAmount - Amount to pay
     * @returns {Object} Updated installment and payment info
     */
    const makePayment = useCallback((installmentId, paymentAmount) => {
        let updatedInstallment = null;
        let paymentInfo = {
            amountPaid: 0,
            installmentsPaid: 0,
            isFullyPaid: false,
            remainingAmount: 0
        };

        setInstallments(prev => prev.map(installment => {
            if (installment.id === installmentId) {
                const updatedSchedule = updatePaymentSchedule(
                    installment.paymentSchedule,
                    paymentAmount
                );

                const summary = getInstallmentSummary(updatedSchedule);
                const remainingAmount = calculateRemainingDebt(updatedSchedule);
                const paidAmount = calculatePaidAmount(updatedSchedule);

                updatedInstallment = {
                    ...installment,
                    paymentSchedule: updatedSchedule,
                    status: remainingAmount === 0 ? 'completed' : 'active'
                };

                paymentInfo = {
                    amountPaid: Math.min(paymentAmount, installment.totalAmount - paidAmount),
                    installmentsPaid: summary.paidInstallments - installment.paymentSchedule.filter(p => p.status === 'paid').length,
                    isFullyPaid: remainingAmount === 0,
                    remainingAmount
                };

                return updatedInstallment;
            }
            return installment;
        }));

        return { updatedInstallment, paymentInfo };
    }, []);

    /**
     * Delete an installment
     * @param {number} installmentId - ID of the installment to delete
     * @returns {boolean} Success status
     */
    const deleteInstallment = useCallback((installmentId) => {
        setInstallments(prev => prev.filter(installment => installment.id !== installmentId));
        return true;
    }, []);

    /**
     * Get installment by ID
     * @param {number} installmentId - ID of the installment
     * @returns {Object|null} Installment object or null
     */
    const getInstallmentById = useCallback((installmentId) => {
        return installments.find(installment => installment.id === installmentId) || null;
    }, [installments]);

    /**
     * Get all installments with their summaries
     * @returns {Array} Array of installments with summary data
     */
    const getInstallmentsWithSummary = useCallback(() => {
        return installments.map(installment => ({
            ...installment,
            summary: getInstallmentSummary(installment.paymentSchedule)
        }));
    }, [installments]);

    /**
     * Get total statistics across all installments
     * @returns {Object} Total statistics
     */
    const getTotalStatistics = useCallback(() => {
        const totalDebt = installments.reduce((sum, installment) => {
            return sum + calculateRemainingDebt(installment.paymentSchedule);
        }, 0);

        const totalPaid = installments.reduce((sum, installment) => {
            return sum + calculatePaidAmount(installment.paymentSchedule);
        }, 0);

        const totalAmount = installments.reduce((sum, installment) => {
            return sum + installment.totalAmount;
        }, 0);

        const activeInstallments = installments.filter(i => i.status === 'active').length;
        const completedInstallments = installments.filter(i => i.status === 'completed').length;

        return {
            totalDebt,
            totalPaid,
            totalAmount,
            activeInstallments,
            completedInstallments,
            totalInstallments: installments.length
        };
    }, [installments]);

    /**
     * Get overdue installments across all debts
     * @returns {Array} Array of overdue installments
     */
    const getOverdueInstallments = useCallback(() => {
        const overdueItems = [];

        installments.forEach(installment => {
            const overdueInstallments = installment.paymentSchedule.filter(
                payment => payment.status === 'overdue' ||
                    (payment.status !== 'paid' && new Date(payment.dueDate) < new Date())
            );

            overdueInstallments.forEach(overdue => {
                overdueItems.push({
                    ...overdue,
                    installmentName: installment.name,
                    installmentId: installment.id,
                    creditor: installment.creditor
                });
            });
        });

        return overdueItems;
    }, [installments]);

    /**
     * Get upcoming installments (next 30 days)
     * @returns {Array} Array of upcoming installments
     */
    const getUpcomingInstallments = useCallback(() => {
        const upcomingItems = [];
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        installments.forEach(installment => {
            const upcomingInstallments = installment.paymentSchedule.filter(
                payment => payment.status !== 'paid' &&
                    new Date(payment.dueDate) >= new Date() &&
                    new Date(payment.dueDate) <= thirtyDaysFromNow
            );

            upcomingInstallments.forEach(upcoming => {
                upcomingItems.push({
                    ...upcoming,
                    installmentName: installment.name,
                    installmentId: installment.id,
                    creditor: installment.creditor
                });
            });
        });

        return upcomingItems.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }, [installments]);

    /**
     * Update installment details
     * @param {number} installmentId - ID of the installment
     * @param {Object} updates - Fields to update
     * @returns {Object|null} Updated installment or null
     */
    const updateInstallment = useCallback((installmentId, updates) => {
        let updatedInstallment = null;

        setInstallments(prev => prev.map(installment => {
            if (installment.id === installmentId) {
                updatedInstallment = { ...installment, ...updates };

                // If schedule-related fields changed, regenerate schedule
                if (updates.totalAmount || updates.installmentCount || updates.loanDate) {
                    const newInstallment = { ...updatedInstallment };
                    newInstallment.installmentAmount = calculateInstallmentAmount(
                        newInstallment.totalAmount,
                        newInstallment.installmentCount
                    );
                    newInstallment.paymentSchedule = generateInstallmentSchedule(newInstallment);
                    updatedInstallment = newInstallment;
                }

                return updatedInstallment;
            }
            return installment;
        }));

        return updatedInstallment;
    }, []);

    return {
        // Data
        installments,

        // Actions
        addInstallment,
        makePayment,
        deleteInstallment,
        updateInstallment,

        // Queries
        getInstallmentById,
        getInstallmentsWithSummary,
        getTotalStatistics,
        getOverdueInstallments,
        getUpcomingInstallments
    };
};
