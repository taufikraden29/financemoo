import React, { useState } from 'react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { calculateDaysUntilDue } from '../../../utils/calculations';

const InstallmentDetails = ({ installment, onClose, onPay }) => {
    const [activeTab, setActiveTab] = useState('schedule');

    const summary = installment.summary;

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'unpaid':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'overdue':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusText = (status) => {
        switch (status) {
            case 'paid':
                return 'Lunas';
            case 'unpaid':
                return 'Belum Dibayar';
            case 'overdue':
                return 'Terlambat';
            default:
                return 'Tidak Diketahui';
        }
    };

    const renderScheduleTab = () => (
        <div className="space-y-3">
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-blue-900 mb-2">Ringkasan Cicilan</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-blue-700">Total Pinjaman:</span>
                        <span className="font-bold text-blue-900">{formatCurrency(summary.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-blue-700">Cicilan per Bulan:</span>
                        <span className="font-bold text-blue-900">{formatCurrency(installment.installmentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-blue-700">Jumlah Cicilan:</span>
                        <span className="font-bold text-blue-900">{summary.totalInstallments}x</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-blue-700">Sudah Dibayar:</span>
                        <span className="font-bold text-blue-900">{summary.paidInstallments}x</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-blue-700">Sisa Cicilan:</span>
                        <span className="font-bold text-blue-900">{summary.unpaidInstallments}x</span>
                    </div>
                </div>
            </div>

            {/* Payment Schedule Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900">Jadwal Pembayaran</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">No</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Jatuh Tempo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Jumlah</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tanggal Bayar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {installment.paymentSchedule.map((payment) => {
                                const daysUntilDue = calculateDaysUntilDue(payment);
                                const isOverdue = daysUntilDue < 0 && payment.status !== 'paid';

                                return (
                                    <tr key={payment.id} className={payment.status === 'paid' ? 'bg-green-50' : isOverdue ? 'bg-red-50' : 'bg-white'}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {payment.installmentNumber}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {formatDate(payment.dueDate, 'short')}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(payment.status)}`}>
                                                {getPaymentStatusText(payment.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {payment.paidDate ? formatDate(payment.paidDate, 'short') : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderOverviewTab = () => (
        <div className="space-y-4">
            {/* Progress Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
                <h4 className="font-bold text-blue-900 mb-4">Progress Pembayaran</h4>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-700">Progress</span>
                        <span className="text-2xl font-bold text-blue-900">{summary.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${summary.progressPercentage}%` }}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-blue-700 text-sm mb-1">Sudah Dibayar</p>
                        <p className="text-3xl font-bold text-blue-900">{formatCurrency(summary.paidAmount)}</p>
                        <p className="text-blue-600 text-xs">{summary.paidInstallments} cicilan</p>
                    </div>
                    <div>
                        <p className="text-blue-700 text-sm mb-1">Sisa Hutang</p>
                        <p className="text-3xl font-bold text-orange-600">{formatCurrency(summary.remainingAmount)}</p>
                        <p className="text-blue-600 text-xs">{summary.unpaidInstallments} cicilan</p>
                    </div>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4">
                <h4 className="font-bold text-gray-900 mb-4">Detail Keuangan</h4>
                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Total Hutang</span>
                        <span className="font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Jumlah Cicilan</span>
                        <span className="font-bold text-gray-900">{summary.totalInstallments}x ({installment.installmentCount}x)</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Cicilan per Bulan</span>
                        <span className="font-bold text-gray-900">{formatCurrency(installment.installmentAmount)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Tanggal Pinjam</span>
                        <span className="font-bold text-gray-900">{formatDate(installment.loanDate, 'short')}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Kategori</span>
                        <span className="font-bold text-gray-900 capitalize">{installment.category}</span>
                    </div>
                    {installment.creditor && (
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Kreditor</span>
                            <span className="font-bold text-gray-900">{installment.creditor}</span>
                        </div>
                    )}
                    {installment.description && (
                        <div className="pt-2">
                            <span className="text-gray-600">Deskripsi:</span>
                            <p className="text-gray-900 mt-1">{installment.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Next Payment Info */}
            {summary.nextInstallment && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-4">
                    <h4 className="font-bold text-green-900 mb-4">Pembayaran Berikutnya</h4>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-700 text-sm">Jumlah yang harus dibayar:</p>
                            <p className="text-2xl font-bold text-green-900">{formatCurrency(summary.nextInstallment.amount)}</p>
                            <p className="text-green-600 text-xs">Cicilan #{summary.nextInstallment.installmentNumber}</p>
                        </div>
                        <div className="text-right">
                            <button
                                onClick={() => onPay(installment.id, summary.nextInstallment.amount)}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>
                    <div className="text-center text-sm text-green-600 mt-3">
                        {formatDate(summary.nextInstallment.dueDate, 'long')}
                    </div>
                </div>
            )}

            {/* Overdue Warning */}
            {summary.overdueInstallments > 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-red-500 text-white p-3 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M9 16H4m4-4v4m0-4h4m-4 4h.01M12 17h.01M16 12h4m0 4h4m0-4v4h.01" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-red-900 mb-1">Peringatan: Ada Cicilan Terlambat!</h4>
                            <p className="text-red-700">
                                Anda memiliki {summary.overdueInstallments} cicilan yang terlambat. Segera lakukan pembayaran untuk menghindari biaya tambahan.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4" onClick={onClose}>
            <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl w-full md:max-w-4xl md:w-full p-5 md:p-6 transform transition-all max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        Detail Cicilan: {installment.name}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="bg-gray-100 rounded-xl p-1 mb-4 md:mb-6">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'overview'
                                ? 'bg-white text-indigo-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            Ringkasan
                        </button>
                        <button
                            onClick={() => setActiveTab('schedule')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'schedule'
                                ? 'bg-white text-indigo-600 shadow-md'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                }`}
                        >
                            Jadwal
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'overview' ? renderOverviewTab() : renderScheduleTab()}
                </div>
            </div>
        </div>
    );
};

export default InstallmentDetails;
