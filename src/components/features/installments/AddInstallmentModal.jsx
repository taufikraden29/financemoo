import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { calculateInstallmentAmount } from '../../../utils/calculations';

const AddInstallmentModal = ({
    isOpen,
    onClose,
    onSubmit,
    initialData = null
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        creditor: '',
        totalAmount: '',
        installmentCount: '1',
        loanDate: new Date().toISOString().split('T')[0],
        category: 'personal',
        ...initialData
    });

    const [errors, setErrors] = useState({});

    const categories = [
        { value: 'personal', label: 'Pribadi' },
        { value: 'education', label: 'Pendidikan' },
        { value: 'vehicle', label: 'Kendaraan' },
        { value: 'electronics', label: 'Elektronik' },
        { value: 'property', label: 'Properti' },
        { value: 'health', label: 'Kesehatan' },
        { value: 'other', label: 'Lainnya' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama cicilan wajib diisi';
        }

        if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
            newErrors.totalAmount = 'Jumlah total harus lebih dari 0';
        }

        if (!formData.installmentCount || parseInt(formData.installmentCount) <= 0) {
            newErrors.installmentCount = 'Jumlah cicilan harus lebih dari 0';
        }

        if (!formData.loanDate) {
            newErrors.loanDate = 'Tanggal pinjam wajib diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const installmentAmount = calculateInstallmentAmount(
            parseFloat(formData.totalAmount),
            parseInt(formData.installmentCount)
        );

        const installmentData = {
            ...formData,
            totalAmount: parseFloat(formData.totalAmount),
            installmentCount: parseInt(formData.installmentCount),
            installmentAmount
        };

        onSubmit(installmentData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            description: '',
            creditor: '',
            totalAmount: '',
            installmentCount: '1',
            loanDate: new Date().toISOString().split('T')[0],
            category: 'personal'
        });
        setErrors({});
        onClose();
    };

    const formatCurrencyInput = (value) => {
        if (!value) return '';
        const numericValue = value.replace(/[^\d]/g, '');
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(parseInt(numericValue) || 0);
    };

    const parseCurrencyInput = (formattedValue) => {
        return formattedValue.replace(/[^\d]/g, '') || '';
    };

    if (!isOpen) return null;

    const installmentAmount = formData.totalAmount && formData.installmentCount
        ? calculateInstallmentAmount(parseFloat(formData.totalAmount), parseInt(formData.installmentCount))
        : 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4">
            <div className="bg-white rounded-t-2xl md:rounded-xl shadow-2xl w-full md:max-w-md md:w-full p-3 sm:p-4 md:p-6 transform transition-all max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {initialData ? 'Edit Cicilan' : 'Tambah Cicilan Baru'}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-1"
                    >
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-2 sm:space-y-3">
                    {/* Nama Cicilan */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Nama Cicilan
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${errors.name ? 'border-red-300' : 'border-gray-200'
                                }`}
                            placeholder="e.g., Pinjaman Laptop, Biaya Kuliah"
                        />
                        {errors.name && (
                            <p className="text-red-600 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Kreditor */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Kreditor/Penyedia Jasa
                        </label>
                        <input
                            type="text"
                            value={formData.creditor}
                            onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                            placeholder="e.g., Bank BCA, Toko Elektronik, Teman"
                        />
                    </div>

                    {/* Total Amount */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Jumlah Total
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                                Rp
                            </span>
                            <input
                                type="text"
                                value={formatCurrencyInput(formData.totalAmount)}
                                onChange={(e) => {
                                    const numericValue = parseCurrencyInput(e.target.value);
                                    setFormData({ ...formData, totalAmount: numericValue });
                                }}
                                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${errors.totalAmount ? 'border-red-300' : 'border-gray-200'
                                    }`}
                                placeholder="0"
                            />
                        </div>
                        {errors.totalAmount && (
                            <p className="text-red-600 text-xs mt-1">{errors.totalAmount}</p>
                        )}
                    </div>

                    {/* Jumlah Cicilan */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Jumlah Cicilan
                        </label>
                        <select
                            value={formData.installmentCount}
                            onChange={(e) => setFormData({ ...formData, installmentCount: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${errors.installmentCount ? 'border-red-300' : 'border-gray-200'
                                }`}
                        >
                            <option value="1">1x</option>
                            <option value="3">3x</option>
                            <option value="6">6x</option>
                            <option value="12">12x</option>
                            <option value="18">18x</option>
                            <option value="24">24x</option>
                            <option value="36">36x</option>
                            <option value="48">48x</option>
                            <option value="60">60x</option>
                        </select>
                        {errors.installmentCount && (
                            <p className="text-red-600 text-xs mt-1">{errors.installmentCount}</p>
                        )}
                    </div>

                    {/* Perhitungan Cicilan */}
                    {installmentAmount > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h4 className="font-bold text-blue-900 mb-2 text-sm">Perhitungan Cicilan (Metode Flat)</h4>
                            <div className="space-y-1 text-xs sm:text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Total Pinjaman:</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(parseFloat(formData.totalAmount))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Jumlah Cicilan:</span>
                                    <span className="font-bold text-blue-900">{formData.installmentCount}x</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Cicilan per bulan:</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(installmentAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Total Pembayaran:</span>
                                    <span className="font-bold text-blue-900">{formatCurrency(installmentAmount * parseInt(formData.installmentCount))}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tanggal Pinjam */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Tanggal Pinjam
                        </label>
                        <input
                            type="date"
                            value={formData.loanDate}
                            onChange={(e) => setFormData({ ...formData, loanDate: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm ${errors.loanDate ? 'border-red-300' : 'border-gray-200'
                                }`}
                        />
                        {errors.loanDate && (
                            <p className="text-red-600 text-xs mt-1">{errors.loanDate}</p>
                        )}
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Kategori
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Deskripsi (Opsional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm resize-none"
                            placeholder="Catatan tambahan tentang cicilan ini..."
                            rows={3}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 sm:mt-4">
                    <button
                        onClick={handleClose}
                        className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-all text-sm"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-bold hover:shadow-lg transition-all text-sm"
                    >
                        {initialData ? 'Update Cicilan' : 'Tambah Cicilan'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddInstallmentModal;
