// All achievements start locked - user will unlock them by completing tasks
export const INITIAL_ACHIEVEMENTS = [
  { 
    id: 1, 
    name: "First Transaction", 
    description: "Add your first transaction", 
    unlocked: false, 
    icon: "Star", 
    reward: 50 
  },
  { 
    id: 2, 
    name: "Budget Master", 
    description: "Set budget for 5 categories", 
    unlocked: false, 
    icon: "Target", 
    reward: 100 
  },
  { 
    id: 3, 
    name: "Savings Hero", 
    description: "Save 20% of income", 
    unlocked: false, 
    icon: "Trophy", 
    reward: 150 
  },
  { 
    id: 4, 
    name: "Debt Free", 
    description: "Pay off all debts", 
    unlocked: false, 
    icon: "CheckCircle", 
    reward: 200 
  },
  { 
    id: 5, 
    name: "Consistent Tracker", 
    description: "7-day tracking streak", 
    unlocked: false, 
    icon: "Zap", 
    reward: 100 
  },
  { 
    id: 6, 
    name: "Budget Guardian", 
    description: "Stay under budget for 3 months", 
    unlocked: false, 
    icon: "Award", 
    reward: 250 
  },
];

export const XP_REWARDS = {
  ADD_TRANSACTION: 15,
  ADD_RECURRING: 25,
  ADD_DEBT: 30,
  PAY_DEBT: 20,
  PAY_DEBT_FULL: 100,
  EXPORT_DATA: 50,
  LEVEL_UP: 100,
};
