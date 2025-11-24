import React, { useState } from 'react';
import { useInstallments } from '../../../hooks/business/useInstallments';
import { formatCurrency } from '../../../utils/formatters/formatters';
import InstallmentCard from './InstallmentCard';
import AddInstallmentModal from './AddInstallmentModal';
import InstallmentDetails from './InstallmentDetails';

const InstallmentManager = () => {
    const {
        installments,
        addInstallment,
        makePayment,
        deleteInstallment,
        getInstallmentsWithSummary,
        getTotalStatistics,
        getOverdueInstallments,
        getUpcomingInstallments
    } = useInstallments();

    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState({ id: null, amount: 0 });

    const installmentsWithSummary = getInstallmentsWithSummary();
    const statistics = getTotalStatistics();
    const overdueInstallments = getOverdueInstallments();
    const upcomingInstallments = getUpcomingInstallments();

    const handleAddInstallment = (installmentData) => {
        addInstallment(installmentData);
    };

    const handlePayment = (installmentId, amount) => {
        setSelectedPayment({ id: installmentId, amount });
        setShowPayModal(true);
    };

    const confirmPayment = () => {
        const result = makePayment(selectedPayment.id, selectedPayment.amount);
        if (result.paymentInfo.isFullyPaid) {
            alert('🎉 Selamat! Cicilan telah lunas dibayar!');
        } else {
            alert(`✅ Pembayaran berhasil! ${result.paymentInfo.installmentsPaid} cicilan telah dibayar.`);
        }
        setShowPayModal(false);
        setSelectedPayment({ id: null, amount: 0 });
    };

    const handleDelete = (installmentId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus cicilan ini? Tindakan ini tidak dapat dibatalkan.')) {
            deleteInstallment(installmentId);
        }
    };

    const handleViewDetails = (installment) => {
        setSelectedInstallment(installment);
        setShowDetailsModal(true);
    };

    const renderStatistics = () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-3 text-white">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-100 text-xs font-medium">Total Hutang</span>
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <p className="text-lg font-bold">{formatCurrency(statistics.totalDebt)}</p>
                <p className="text-blue-100 text-xs">{statistics.activeInstallments} aktif</p>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-3 text-white">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-green-100 text-xs font-medium">Sudah Dibayar</span>
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <p className="text-lg font-bold">{formatCurrency(statistics.totalPaid)}</p>
                <p className="text-green-100 text-xs">{statistics.completedInstallments} selesai</p>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-3 text-white">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-orange-100 text-xs font-medium">Terlambat</span>
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M9 16H4m4-4v4m0-4h4m-4 4h.01M12 17h.01M16 12h4m0 4h4m0-4v4h.01" />
                        </svg>
                    </div>
                </div>
                <p className="text-lg font-bold">{overdueInstallments.length}</p>
                <p className="text-orange-100 text-xs">terlambat</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-3 text-white">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-purple-100 text-xs font-medium">Akan Datang</span>
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <p className="text-lg font-bold">{upcomingInstallments.length}</p>
                <p className="text-purple-100 text-xs">30 hari</p>
            </div>
        </div>
    );

    const renderPayModal = () => {
        if (!showPayModal) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Konfirmasi Pembayaran</h3>
                    <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                        <p className="text-blue-700 text-sm mb-2">Jumlah yang akan dibayar:</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-900">{formatCurrency(selectedPayment.amount)}</p>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                        Apakah Anda yakin ingin melakukan pembayaran cicilan ini?
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowPayModal(false)}
                            className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-300 transition-all text-sm"
                        >
                            Batal
                        </button>
                        <button
                            onClick={confirmPayment}
                            className="flex-1 bg-green-600 text-white py-2.5 sm:py-3 rounded-lg font-bold hover:bg-green-700 transition-all text-sm"
                        >
                            Bayar Sekarang
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Cicilan Hutang</h2>
                    <p className="text-xs sm:text-sm text-gray-600">
                        Kelola cicilan hutang pribadi dengan metode flat
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline-block">Tambah Cicilan</span>
                    <span className="sm:hidden">+</span>
                </button>
            </div>

            {/* Statistics */}
            {renderStatistics()}

            {/* Installments List */}
            <div className="space-y-4">
                {installmentsWithSummary.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Cicilan</h3>
                        <p className="text-gray-600 mb-4">
                            Mulai tambahkan cicilan hutang pertama Anda untuk melacak pembayaran
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                        >
                            Tambah Cicilan
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {installmentsWithSummary.map((installment) => (
                            <InstallmentCard
                                key={installment.id}
                                installment={installment}
                                onPay={handlePayment}
                                onDelete={handleDelete}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddInstallmentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddInstallment}
            />

            {selectedInstallment && (
                <InstallmentDetails
                    installment={selectedInstallment}
                    onClose={() => setShowDetailsModal(false)}
                    onPay={handlePayment}
                />
            )}

            {renderPayModal()}
        </div>
    );
};

export default InstallmentManager;
