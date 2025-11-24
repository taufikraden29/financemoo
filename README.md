# 💰 MoneyPro - Personal Finance Tracker

A comprehensive personal finance management application built with **React + Vite** following **Clean Code Architecture** principles.

## ✨ Features

### 💸 Core Features
- **Transaction Management** - Track income and expenses with categories
- **Budget Tracking** - Set budgets and get warnings at 80% usage
- **Debt Tracker** - Monitor debts with installment tracking
- **Recurring Transactions** - Automate regular income/expenses
- **Savings Goals** - Track progress towards financial goals

### 🎮 Gamification
- **XP & Levels** - Earn experience points for financial activities
- **Achievements** - Unlock rewards for milestones
- **Streak System** - Track consistency (7-day streak)
- **Coins System** - Collect coins from every action

### 📊 Analytics & Reports
- **Financial Insights** - Dashboard with key metrics
- **Expense Distribution** - Visual breakdown by category
- **Budget vs Actual** - Compare spending against limits
- **Savings Rate** - Track financial health percentage
- **Financial Health Score** - Comprehensive financial assessment
- **Payment Method Distribution** - Track spending patterns
- **Transaction Trends** - Historical analysis

### 🔧 Additional Features
- **Export/Import Data** - Backup and restore all your financial data
- **Hide Balance** - Privacy mode for sensitive information
- **Cash/Digital Balance Tracking** - Separate wallet management
- **Balance Transfer** - Move money between wallets
- **Responsive Design** - Works on mobile and desktop
- **Beautiful UI** - Modern gradient design with animations

## 🏗️ Clean Code Architecture

This project follows **Clean Code** principles with a well-organized structure:

```
src/
├── components/         # Reusable UI components
│   ├── features/       # Feature-specific components
│   ├── layout/         # Layout components
│   ├── modals/         # Modal components
│   ├── tabs/           # Tab-specific components
│   └── ui/             # UI components
├── constants/          # App constants and configurations
├── hooks/              # Custom React hooks for state management
│   ├── business/       # Business logic hooks
│   └── ui/             # UI state hooks
├── utils/              # Utility functions
│   ├── analytics/      # Analytics calculations
│   ├── calculations/   # Financial calculations
│   ├── formatters/     # Data formatters
│   ├── helpers/        # Helper functions
│   └── validation/     # Validation utilities
└── data/               # Initial/mock data
```

**Key Benefits:**
- ✅ Separation of concerns
- ✅ Highly maintainable
- ✅ Easily testable modules
- ✅ Reusable components and hooks
- ✅ Professional structure

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd MoneyPro

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5174` to see the app.

### Build for Production

```bash
npm run build
```

## 📚 Documentation

Comprehensive documentation available in `.doc/` folder:

- **[SUMMARY.md](./.doc/SUMMARY.md)** - Quick overview of restructuring
- **[STRUCTURE.md](./.doc/STRUCTURE.md)** - Detailed folder structure
- **[ARCHITECTURE.md](./.doc/ARCHITECTURE.md)** - System architecture & patterns
- **[REFACTORING_GUIDE.md](./.doc/REFACTORING_GUIDE.md)** - Migration guide
- **[README_REFACTORING.md](./.doc/README_REFACTORING.md)** - Complete refactoring summary

## 🎯 Project Statistics

- **Modular architecture** with clean separation of concerns
- **Custom hooks** for business logic and UI state
- **Comprehensive validation** for all input data
- **Enhanced analytics** with financial health scores
- **Improved UX** with consistent styling
- **Production ready** code quality

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library
- **ESLint** - Code linting
- **react-hot-toast** - Notifications

## 🎨 Code Quality

Following industry best practices:
- ✅ SOLID Principles
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple)
- ✅ Separation of Concerns
- ✅ Component Composition
- ✅ Consistent UI/UX
- ✅ Proper Error Handling
- ✅ Input Validation

## 📦 Project Structure

```
MoneyPro/
├── src/
│   ├── components/      # UI components (layout, cards, modals, tabs)
│   ├── constants/       # Constants and configuration
│   ├── hooks/           # Custom hooks (business, UI logic)
│   ├── utils/           # Utilities (formatters, calculations, validation)
│   │   ├── analytics/   # Analytics calculations
│   │   ├── calculations/ # Financial calculations
│   │   ├── formatters/   # Data formatting utilities
│   │   ├── helpers/      # Helper functions
│   │   └── validation/   # Input validation utilities
│   └── App.jsx          # Main application
├── public/              # Static assets
└── docs/                # Documentation (*.md files)
```

## 🎓 Learning Value

Perfect for:
- Learning Clean Code principles
- Understanding React hooks patterns
- Studying component architecture
- Learning financial application logic
- Portfolio showcase
- Job interview preparation

## 📈 Future Enhancements

Potential improvements:
- [ ] TypeScript migration
- [ ] Unit & integration tests
- [ ] Backend integration (REST API/GraphQL)
- [ ] Dark mode theme
- [ ] Multi-currency support
- [ ] Data visualization charts (Chart.js/D3)
- [ ] Advanced reporting
- [ ] Email/PDF export

## 🤝 Contributing

This is an open-source showcase project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - Feel free to use for learning and portfolio.

## 🙏 Acknowledgments

Built with ❤️ following Clean Code principles and React best practices.

---

**Status**: ✅ Production Ready
**Quality**: 🌟🌟🌟🌟🌟 (5/5)
**Date**: November 2025

🚀 **Happy Coding!**
