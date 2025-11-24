import { useState } from "react";
import { INITIAL_RECURRING } from "../data/initialData";

export const useRecurring = () => {
  const [recurringTransactions, setRecurringTransactions] = useState(INITIAL_RECURRING);

  const addRecurring = (newRecurring) => {
    setRecurringTransactions([...recurringTransactions, newRecurring]);
  };

  const toggleRecurring = (id) => {
    setRecurringTransactions(
      recurringTransactions.map((rt) =>
        rt.id === id ? { ...rt, isActive: !rt.isActive } : rt
      )
    );
  };

  return {
    recurringTransactions,
    addRecurring,
    toggleRecurring,
  };
};
