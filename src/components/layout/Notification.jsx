import React from 'react';
import { AlertCircle } from 'lucide-react';

const Notification = ({ showNotification, setShowNotification }) => {
    if (!showNotification) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 md:space-x-3 max-w-sm">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                <div>
                    <p className="font-bold text-sm md:text-base">Budget Alert! 🚨</p>
                    <p className="text-xs md:text-sm opacity-90">
                        Ada kategori yang hampir melebihi budget
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Notification;
