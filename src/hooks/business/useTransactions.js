import { useState, useCallback } from 'react';
import { useLocalStorage } from '../../utils/helpers';

/**
 * Custom hook for managing transactions
 * Provides state and functions for transaction operations
 * @returns {Object} Transaction management functions and state
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useLocalStorage("transactions", []);

  /**
   * Adds a new transaction to the list
   * @param {Object} transaction - Transaction object to add
   * @param {string} transaction.id - Unique identifier for the transaction
   * @param {string} transaction.type - Transaction type ('income' or 'expense')
   * @param {number} transaction.amount - Transaction amount
   * @param {string} transaction.category - Category of the transaction
   * @param {string} transaction.description - Description of the transaction
   * @param {string} transaction.paymentMethod - Payment method ('cash', 'bank', 'card', 'digital')
   * @param {string} transaction.date - Date of the transaction (YYYY-MM-DD)
   * @returns {void}
   */
  const addTransaction = useCallback((transaction) => {
    setTransactions(prevTransactions => [transaction, ...prevTransactions]);
    // Send notification to Telegram bot
    sendTelegramNotification('transaction', transaction);
  }, []);

  /**
   * Deletes a transaction by its ID
   * @param {string} transactionId - ID of the transaction to delete
   * @returns {void}
   */
  const deleteTransaction = useCallback((transactionId) => {
    const deletedTransaction = transactions.find(t => t.id === transactionId);
    setTransactions(prevTransactions =>
      prevTransactions.filter(t => t.id !== transactionId)
    );
    // Send notification to Telegram bot
    if (deletedTransaction) {
      sendTelegramNotification('transaction_delete', deletedTransaction);
    }
  }, [transactions]);

  /**
   * Updates a transaction with new data
   * @param {string} transactionId - ID of the transaction to update
   * @param {Object} updates - Object containing properties to update
   * @returns {void}
   */
 const updateTransaction = useCallback((transactionId, updates) => {
    const oldTransaction = transactions.find(t => t.id === transactionId);
    setTransactions(prevTransactions =>
      prevTransactions.map(t =>
        t.id === transactionId ? { ...t, ...updates } : t
      )
    );
    // Send notification to Telegram bot
    if (oldTransaction) {
      const updatedTransaction = { ...oldTransaction, ...updates };
      sendTelegramNotification('transaction_update', updatedTransaction);
    }
  }, [transactions]);

  return {
    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
};

/**
 * Sends a notification to the Telegram bot
 * @param {string} type - Type of notification ('transaction', 'transaction_delete', 'transaction_update', 'transfer', 'recurring', 'budget', 'installment')
 * @param {Object} data - Data related to the notification
 * @returns {Promise<void>}
 */
export const sendTelegramNotification = async (type, data) => {
  try {
    // Get bot configuration from environment variables
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      console.warn('Telegram bot configuration not found. Please set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in your .env file.');
      return;
    }

    let message = '';
    switch (type) {
      case 'transaction':
        message = `💰 Transaksi Baru!\n\n`;
        message += `Tipe: ${data.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}\n`;
        message += `Kategori: ${data.category}\n`;
        message += `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}\n`;
        if (data.description) message += `Deskripsi: ${data.description}\n`;
        message += `Metode: ${data.paymentMethod === 'cash' ? 'Tunai' : 'Digital'}\n`;
        message += `Tanggal: ${new Date(data.timestamp).toLocaleString('id-ID')}`;
        break;
        
      case 'transaction_delete':
        message = `🗑️ Transaksi Dihapus!\n\n`;
        message += `Kategori: ${data.category}\n`;
        message += `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}\n`;
        message += `Tanggal: ${new Date(data.timestamp).toLocaleString('id-ID')}`;
        break;
        
      case 'transaction_update':
        message = `✏️ Transaksi Diperbarui!\n\n`;
        message += `Kategori: ${data.category}\n`;
        message += `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}\n`;
        if (data.description) message += `Deskripsi: ${data.description}\n`;
        message += `Tanggal: ${new Date(data.timestamp).toLocaleString('id-ID')}`;
        break;
        
      case 'transfer':
        message = `🔄 Transfer Dana!\n\n`;
        message += `Dari: ${data.from === 'cash' ? 'Tunai' : data.from === 'digital' ? 'Digital' : data.from}\n`;
        message += `Ke: ${data.to === 'cash' ? 'Tunai' : data.to === 'digital' ? 'Digital' : data.to}\n`;
        message += `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}\n`;
        if (data.description) message += `Deskripsi: ${data.description}\n`;
        message += `Tanggal: ${new Date(data.timestamp).toLocaleString('id-ID')}`;
        break;
        
      case 'recurring':
        message = `🔄 Transaksi Berulang!\n\n`;
        message += `Deskripsi: ${data.description || data.category}\n`;
        message += `Tipe: ${data.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}\n`;
        message += `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}\n`;
        message += `Frekuensi: ${getFrequencyLabel(data.frequency)}\n`;
        message += `Tanggal Mulai: ${new Date(data.startDate).toLocaleDateString('id-ID')}\n`;
        if (data.endDate) message += `Tanggal Akhir: ${new Date(data.endDate).toLocaleDateString('id-ID')}\n`;
        break;
        
      case 'recurring_delete':
        message = `🗑️ Transaksi Berulang Dihapus!\n\n`;
        message += `Deskripsi: ${data.description || data.category}\n`;
        message += `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}\n`;
        message += `Tanggal: ${new Date().toLocaleString('id-ID')}`;
        break;
        
      case 'recurring_update':
        message = `✏️ Transaksi Berulang Diperbarui!\n\n`;
        message += `Deskripsi: ${data.description || data.category}\n`;
        message += `Status: ${data.isActive ? 'Aktif' : 'Non-Aktif'}\n`;
        message += `Tanggal: ${new Date().toLocaleString('id-ID')}`;
        break;
        
      case 'recurring_occurrence':
        message = `🔔 Jadwal Transaksi Berulang!\n\n`;
        message += `Deskripsi: ${data.description || data.category}\n`;
        message += `Tipe: ${data.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}\n`;
        message += `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}\n`;
        message += `Tanggal: ${new Date().toLocaleString('id-ID')}`;
        break;
        
      case 'budget':
        message = `📊 Budget Diperbarui!\n\n`;
        message += `Kategori: ${data.category}\n`;
        message += `Batas: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.limit)}\n`;
        message += `Tanggal: ${new Date().toLocaleString('id-ID')}`;
        break;
        
      case 'budget_delete':
        message = `🗑️ Budget Dihapus!\n\n`;
        message += `Kategori: ${data.category}\n`;
        message += `Tanggal: ${new Date().toLocaleString('id-ID')}`;
        break;
        
      case 'installment':
        message = `💳 Cicilan Baru!\n\n`;
        message += `Nama: ${data.name}\n`;
        message += `Jumlah Total: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.totalAmount)}\n`;
        message += `Jumlah Cicilan: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.installmentAmount)}\n`;
        message += `Jumlah Pembayaran: ${data.installmentCount}\n`;
        message += `Tanggal: ${new Date(data.createdAt).toLocaleString('id-ID')}`;
        break;
        
      case 'installment_delete':
        message = `🗑️ Cicilan Dihapus!\n\n`;
        message += `Nama: ${data.name}\n`;
        message += `Jumlah Total: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.totalAmount)}\n`;
        message += `Tanggal: ${new Date().toLocaleString('id-ID')}`;
        break;
        
      case 'installment_update':
        message = `✏️ Cicilan Diperbarui!\n\n`;
        message += `Nama: ${data.updated.name}\n`;
        message += `Tanggal: ${new Date().toLocaleString('id-ID')}`;
        break;
        
      case 'installment_payment':
        message = `✅ Pembayaran Cicilan!\n\n`;
        message += `Nama: ${data.installmentName}\n`;
        message += `Jumlah: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.amount)}\n`;
        message += `Jumlah Pembayaran: ${data.installmentsPaid}\n`;
        message += `Status: ${data.isFullyPaid ? 'Lunas' : 'Belum Lunas'}\n`;
        message += `Tanggal: ${new Date(data.timestamp).toLocaleString('id-ID')}`;
        break;
        
      case 'test':
        message = `✅ Test Notification!\n\n`;
        message += `Message: ${data.message}\n`;
        message += `Timestamp: ${new Date(data.timestamp).toLocaleString('id-ID')}`;
        break;
        
      default:
        message = `🔔 Notifikasi Sistem!\n\n${JSON.stringify(data, null, 2)}`;
    }

    // Create a promise with timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Telegram notification request timed out')), 10000); // 10 second timeout
    });

    const responsePromise = fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    // Race between the response and timeout
    const response = await Promise.race([responsePromise, timeoutPromise]);

    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text());
    }
  } catch (error) {
    // Only log the error, don't throw it to prevent breaking the app
    console.error('Error sending Telegram notification:', error.message);
  }
};

/**
 * Gets the Indonesian label for a frequency
 * @param {string} frequency - The frequency value
 * @returns {string} Indonesian label
 */
const getFrequencyLabel = (frequency) => {
  const labels = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
    yearly: 'Tahunan',
  };
  return labels[frequency] || frequency;
};
