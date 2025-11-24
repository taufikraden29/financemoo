import React from 'react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { calculateDaysUntilDue } from '../../../utils/calculations';

const InstallmentCard = ({ installment, onPay, onDelete, onViewDetails }) => {
    const summary = installment.summary;
    const nextInstallment = summary.nextInstallment;
    const daysUntilDue = nextInstallment ? calculateDaysUntilDue(nextInstallment) : null;
    const isOverdue = summary.overdueInstallments > 0;

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'text-blue-600 bg-blue-50';
            case 'completed':
                return 'text-green-600 bg-green-50';
            case 'cancelled':
                return 'text-gray-600 bg-gray-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'unpaid':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className={`bg-white rounded-2xl shadow-lg border-2 p-6 transition-all hover:shadow-xl ${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-100'
            }`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{installment.name}</h3>
                    {installment.creditor && (
                        <p className="text-sm text-gray-600">{installment.creditor}</p>
                    )}
                    {installment.description && (
                        <p className="text-sm text-gray-500 mt-1">{installment.description}</p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(instment.status)}`}>
                        {installment.status === 'active' ? 'Aktif' :
                            installment.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                    </span>
                    {isOverdue && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {summary.overdueInstallments} Telat
                        </span>
                    )}
                </div>
            </div>

            {/* Progress Section */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{summary.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${installment.status === 'completed'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                            }`}
                        style={{ width: `${summary.progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Financial Details */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Total Hutang</p>
                    <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(summary.totalAmount)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Sisa Hutang</p>
                    <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(summary.remainingAmount)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Cicilan/Bulan</p>
                    <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(installment.installmentAmount)}
                    </p>
                </div>
            </div>

            {/* Installment Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Total Cicilan</p>
                        <p className="font-bold text-gray-900">
                            {summary.paidInstallments} / {summary.totalInstallments}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Jatuh Tempo</p>
                        <p className="font-bold text-gray-900">
                            {nextInstallment ? formatDate(nextInstallment.dueDate, 'short') : '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Tanggal Pinjam</p>
                        <p className="font-bold text-gray-900">
                            {formatDate(installment.loanDate, 'short')}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Kategori</p>
                        <p className="font-bold text-gray-900 capitalize">{installment.category}</p>
                    </div>
                </div>
            </div>

            {/* Next Payment Info */}
            {nextInstallment && (
                <div className={`rounded-xl p-4 mb-4 ${daysUntilDue < 0 ? 'bg-red-50 border-2 border-red-200' : 'bg-blue-50 border-2 border-blue-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Pembayaran Berikutnya</p>
                            <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(nextInstallment.amount)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                                Cicilan #{nextInstallment.installmentNumber}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-sm font-bold ${daysUntilDue < 0 ? 'text-red-600' :
                                daysUntilDue <= 3 ? 'text-orange-600' : 'text-blue-600'
                                }`}>
                                {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} hari terlambat` :
                                    daysUntilDue === 0 ? 'Hari ini' :
                                        daysUntilDue === 1 ? 'Besok' :
                                            `${daysUntilDue} hari lagi`}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDate(nextInstallment.dueDate, 'short')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onViewDetails(installment)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
                >
                    Lihat Detail
                </button>
                <button
                    onClick={() => onPay(installment.id, installment.installmentAmount)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-all"
                    disabled={installment.status === 'completed'}
                >
                    Bayar Cicilan
                </button>
                <button
                    onClick={() => onDelete(installment.id)}
                    className="bg-red-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-600 transition-all"
                    title="Hapus Cicilan"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default InstallmentCard;
