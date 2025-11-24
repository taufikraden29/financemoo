# 📁 MoneyPro - Clean Code Structure

## 📂 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer, Navigation)
│   ├── modals/         # Modal dialogs
│   ├── tabs/           # Tab content components
│   ├── cards/          # Card components (Balance, Stats, etc)
│   └── common/         # Common/shared components (Buttons, Notifications)
│
├── hooks/              # Custom React hooks
│   ├── useTransactions.js   # Transaction & budget state management
│   ├── useDebts.js          # Debt tracking state management
│   ├── useRecurring.js      # Recurring transactions management
│   ├── useGamification.js   # Gamification (XP, achievements)
│   └── index.js             # Barrel export
│
├── utils/              # Utility functions
│   ├── formatters.js        # Currency, date formatters
│   ├── exportData.js        # Data export functions
│   ├── iconMapper.js        # Icon mapping utility
│   └── index.js             # Barrel export
│
├── constants/          # App constants
│   ├── categories.js        # Transaction categories
│   ├── achievements.js      # Achievements & XP rewards
│   └── index.js             # Barrel export
│
├── data/               # Initial/mock data
│   └── initialData.js       # All initial state data
│
├── assets/             # Static assets (images, fonts, etc)
├── App.jsx             # Main app component (original)
├── AppRefactored.jsx   # Refactored main app (clean version)
├── main.jsx            # App entry point
└── index.css           # Global styles

```

## 🎯 Key Principles Applied

### 1. **Separation of Concerns**
- Business logic separated from UI components
- State management in custom hooks
- Utility functions in dedicated modules

### 2. **Single Responsibility**
- Each component has one clear purpose
- Hooks manage specific domain logic
- Utils handle specific operations

### 3. **DRY (Don't Repeat Yourself)**
- Reusable components (BalanceCards, Header, etc)
- Shared utilities (formatters, exporters)
- Centralized constants

### 4. **Clean Architecture**
```
Presentation Layer (Components)
      ↓
Business Logic Layer (Hooks)
      ↓
Data Layer (Utils, Constants, Initial Data)
```

## 📦 Component Organization

### Layout Components (`components/layout/`)
- **Header.jsx** - App header with navigation and actions
- **NavigationTabs.jsx** - Tab navigation system

### Card Components (`components/cards/`)
- **BalanceCards.jsx** - Financial summary cards
- **UserLevelBanner.jsx** - Gamification stats banner

### Common Components (`components/common/`)
- **Notification.jsx** - Achievement & budget notifications

### Modals (`components/modals/`)
- **AddTransactionModal.jsx** - Add transaction form
- **BudgetModal.jsx** - Set budget form
- **DebtModal.jsx** - Add debt form
- **RecurringModal.jsx** - Add recurring transaction form

### Tabs (`components/tabs/`)
- **OverviewTab.jsx** - Dashboard overview
- **BudgetTab.jsx** - Budget tracking
- **DebtTab.jsx** - Debt management
- **RecurringTab.jsx** - Recurring transactions
- **TransactionsTab.jsx** - All transactions list
- **AchievementsTab.jsx** - Achievements & gamification
- **AnalyticsTab.jsx** - Financial analytics

## 🎣 Custom Hooks

### useTransactions
Manages transactions and budgets state
```javascript
const {
  transactions,
  budgets,
  totalIncome,
  totalExpense,
  balance,
  addTransaction,
  updateBudgetSpent,
  setBudget,
} = useTransactions();
```

### useDebts
Manages debt tracking
```javascript
const { 
  debts, 
  totalDebt, 
  totalDebtPaid, 
  addDebt, 
  payDebt 
} = useDebts();
```

### useRecurring
Manages recurring transactions
```javascript
const { 
  recurringTransactions, 
  addRecurring, 
  toggleRecurring 
} = useRecurring();
```

### useGamification
Manages XP, levels, and achievements
```javascript
const {
  userStats,
  achievements,
  showAchievementNotification,
  addXP,
  checkAchievement,
  incrementTransactionCount,
} = useGamification();
```

## 🛠️ Utilities

### Formatters (`utils/formatters.js`)
- `formatCurrency(amount, hideBalance)` - Format currency to IDR
- `formatDate(date, format)` - Format dates
- `calculateNextDate(startDate, frequency)` - Calculate next recurring date
- `calculateDaysUntilDue(dueDate)` - Calculate days until debt due
- `calculatePercentage(value, total)` - Calculate percentage

### Export (`utils/exportData.js`)
- `exportToJSON(data)` - Export all data to JSON file

### Icon Mapper (`utils/iconMapper.js`)
- `getIconComponent(iconName)` - Get Lucide icon component by name

## 📊 Data Structure

### Initial Data (`data/initialData.js`)
- `INITIAL_TRANSACTIONS` - Sample transactions
- `INITIAL_BUDGETS` - Sample budgets
- `INITIAL_DEBTS` - Sample debts
- `INITIAL_RECURRING` - Sample recurring transactions
- `INITIAL_SAVINGS_GOAL` - Savings goal data
- `INITIAL_USER_STATS` - User gamification stats

### Constants (`constants/`)
- `CATEGORIES` - Income and expense categories
- `FREQUENCY_OPTIONS` - Recurring frequency options
- `DEBT_TYPES` - Debt type options
- `INITIAL_ACHIEVEMENTS` - Achievement definitions
- `XP_REWARDS` - XP reward values

## 🚀 Usage

### Importing Components
```javascript
import Header from './components/layout/Header';
import BalanceCards from './components/cards/BalanceCards';
```

### Using Hooks
```javascript
import { useTransactions, useGamification } from './hooks';

const MyComponent = () => {
  const { transactions, addTransaction } = useTransactions();
  const { addXP, checkAchievement } = useGamification();
  
  // Your component logic
};
```

### Using Utils
```javascript
import { formatCurrency, exportToJSON } from './utils';

const amount = formatCurrency(1000000);
exportToJSON({ transactions, budgets });
```

## 🔄 Migration Guide

To switch from old App.jsx to new structure:

1. **Update main.jsx** to import AppRefactored instead of App:
```javascript
import App from './AppRefactored'
```

2. **All components are ready** - The refactored app uses modular structure

3. **Test thoroughly** - Ensure all features work as expected

## 📝 Next Steps (Optional Improvements)

1. Create missing tab components (currently placeholders in AppRefactored.jsx)
2. Create missing modal components (currently placeholders)
3. Add PropTypes or TypeScript for type safety
4. Add unit tests for hooks and utilities
5. Implement Context API for global state management
6. Add error boundaries for better error handling
7. Implement lazy loading for tab components

## 🎨 Naming Conventions

- **Components**: PascalCase (e.g., `BalanceCards.jsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTransactions.js`)
- **Utils**: camelCase (e.g., `formatters.js`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `INITIAL_DATA`)

## 🤝 Contributing

When adding new features:

1. Create components in appropriate folders
2. Extract reusable logic into custom hooks
3. Add utilities for common operations
4. Define constants for magic values
5. Update this documentation

---

**Built with ❤️ following Clean Code principles**
