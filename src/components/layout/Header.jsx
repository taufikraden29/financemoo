import { Wallet, Download, Eye, EyeOff, Plus } from "lucide-react";

const Header = ({ 
  hideBalance, 
  setHideBalance, 
  onExport, 
  onAddTransaction 
}) => {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 md:p-2 rounded-lg md:rounded-xl">
              <Wallet className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900">
                MoneyTrack
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Kelola keuanganmu dengan mudah
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onExport}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Data"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {hideBalance ? (
                <EyeOff className="w-5 h-5 text-gray-600" />
              ) : (
                <Eye className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={onAddTransaction}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl flex items-center space-x-1 md:space-x-2 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-sm md:text-base">Tambah</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
