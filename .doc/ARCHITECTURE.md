# 🏗️ MoneyPro Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface (UI)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Header   │  │ Navigation │  │   Modals   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Tab Components (7 tabs)             │       │
│  │  Overview | Budget | Debt | Recurring | ...      │       │
│  └──────────────────────────────────────────────────┘       │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Reusable UI Components (Cards)            │     │
│  │  Balance Cards | User Level Banner | ...          │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │useTransactions│  │  useDebts    │  │ useRecurring │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐                                           │
│  │useGamification│    Custom React Hooks                    │
│  └──────────────┘    (State Management + Logic)             │
└─────────────────────────────────────────────────────────────┘
                          ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    Utility & Data Layer                      │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐    │
│  │  Formatters   │  │  Icon Mapper  │  │  Export Data │    │
│  └───────────────┘  └───────────────┘  └──────────────┘    │
│  ┌───────────────┐  ┌───────────────┐                      │
│  │  Constants    │  │ Initial Data  │                      │
│  └───────────────┘  └───────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action (Click, Input)
        ↓
UI Component (Button, Form)
        ↓
Event Handler (onClick, onChange)
        ↓
Hook Function (addTransaction, addXP)
        ↓
State Update (useState, setState)
        ↓
Re-render Component
        ↓
Updated UI
```

## Feature Architecture

### 1. Transaction Management
```
TransactionTab Component
        ↓
useTransactions Hook
        ├── transactions (state)
        ├── budgets (state)
        ├── addTransaction()
        ├── updateBudgetSpent()
        └── calculations (totalIncome, totalExpense, balance)
        ↓
formatCurrency (util)
iconMapper (util)
```

### 2. Debt Tracking
```
DebtTab Component
        ↓
useDebts Hook
        ├── debts (state)
        ├── addDebt()
        ├── payDebt()
        └── calculations (totalDebt, totalDebtPaid)
        ↓
formatCurrency (util)
calculateDaysUntilDue (util)
```

### 3. Gamification System
```
Any User Action
        ↓
useGamification Hook
        ├── userStats (state)
        ├── achievements (state)
        ├── addXP()
        ├── checkAchievement()
        └── showAchievementPopup()
        ↓
Achievement Notification Component
        ↓
XP_REWARDS (constants)
```

### 4. Export Feature
```
Export Button (Header)
        ↓
handleExportData()
        ↓
Collect all data from hooks
        ↓
exportToJSON (util)
        ↓
Download JSON file
        ↓
addXP (reward user)
```

## State Management Strategy

### Local State (useState)
- UI state (modals, active tabs, forms)
- Temporary data (form inputs)

### Custom Hooks (State + Logic)
- Domain-specific state
- Business logic
- Calculated values
- Side effects

### Benefits:
✅ Isolated concerns
✅ Easy to test
✅ Reusable logic
✅ Clear dependencies
✅ No prop drilling

## Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── Actions (Export, Hide Balance, Add Button)
├── UserLevelBanner
├── BalanceCards (4 cards)
├── NavigationTabs
└── Tab Content
    ├── OverviewTab
    │   ├── Financial Insights Card
    │   ├── Top Expenses Card
    │   └── Recent Transactions Card
    ├── BudgetTab
    │   ├── Budget List
    │   └── Budget Progress Bars
    ├── DebtTab
    │   ├── Debt Summary Cards
    │   └── Debt List with Actions
    ├── RecurringTab
    │   └── Recurring Transaction Cards
    ├── TransactionsTab
    │   └── Transaction List
    ├── AchievementsTab
    │   ├── Progress Banner
    │   ├── Achievement Cards
    │   └── Stats Overview
    └── AnalyticsTab
        ├── Summary Cards
        └── Expense Distribution
```

## Performance Optimizations

### Already Implemented
- Functional components (faster than class)
- useState for local state
- Custom hooks for reusable logic
- Lazy calculations (only when needed)
- Event handler memoization via functions

### Future Improvements
- React.memo() for expensive components
- useMemo() for expensive calculations
- useCallback() for event handlers
- Code splitting with lazy() and Suspense
- Virtual scrolling for long lists

## Security Considerations

### Implemented
✅ No eval() or innerHTML
✅ Safe data export (JSON)
✅ Input validation in forms
✅ Type checking (implicit)

### To Consider
- Add input sanitization
- Implement data encryption for export
- Add CSRF protection if adding backend
- Implement rate limiting for actions

## Testing Strategy

### Unit Tests (Recommended)
```javascript
// Test formatters
describe('formatCurrency', () => {
  it('formats IDR correctly', () => {
    expect(formatCurrency(1000000)).toBe('Rp 1.000.000');
  });
});

// Test hooks
describe('useTransactions', () => {
  it('adds transaction correctly', () => {
    // Test hook logic
  });
});
```

### Integration Tests
- Test component + hook interactions
- Test modal flows
- Test data export

### E2E Tests
- Complete user flows
- Multi-step processes

## Error Handling

### Current Approach
- Form validation (if checks)
- Safe calculations (default values)
- Graceful fallbacks (|| operator)

### Recommended Additions
```javascript
// Error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    // Log error
  }
}

// Try-catch in async operations
try {
  await exportData();
} catch (error) {
  showErrorNotification(error.message);
}
```

## Scalability Path

### Phase 1: Current (Client-side only)
- Local state management
- In-memory data
- Manual data export

### Phase 2: Add Persistence
- LocalStorage integration
- Auto-save functionality
- Data recovery

### Phase 3: Add Backend
- REST API integration
- User authentication
- Cloud sync

### Phase 4: Advanced Features
- Real-time updates (WebSocket)
- Collaborative features
- Advanced analytics

## Code Quality Metrics

### Maintainability
- **Low coupling**: Components don't depend on each other
- **High cohesion**: Related code grouped together
- **Clear naming**: Self-documenting code
- **Small functions**: Single responsibility

### Readability
- Consistent naming conventions
- Logical file organization
- Clear component structure
- Minimal nesting

### Reusability
- Generic components (BalanceCards, Header)
- Utility functions (formatters)
- Custom hooks (domain logic)

---

**Architecture designed for scalability, maintainability, and clean code principles**
