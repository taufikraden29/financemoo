// Start with empty transactions - user will add their own
export const INITIAL_TRANSACTIONS = [];

// Start with empty budgets - user will set their own
export const INITIAL_BUDGETS = {};

// Start with empty debts - user will add their own
export const INITIAL_DEBTS = [];

// Start with empty recurring transactions - user will add their own
export const INITIAL_RECURRING = [];

// Start with empty savings goal - user will set their own target
export const INITIAL_SAVINGS_GOAL = {
  target: 0,
  current: 0,
  name: "",
  deadline: "",
};

// Start fresh - Level 1, no XP, no transactions
export const INITIAL_USER_STATS = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  totalTransactions: 0,
  streakDays: 0,
  coinsEarned: 0,
};
