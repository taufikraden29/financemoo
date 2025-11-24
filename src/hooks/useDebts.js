import { useState } from "react";
import { INITIAL_DEBTS } from "../data/initialData";

export const useDebts = () => {
  const [debts, setDebts] = useState(INITIAL_DEBTS);

  const addDebt = (newDebt) => {
    setDebts([...debts, newDebt]);
  };

  const payDebt = (debtId, amount) => {
    let isFullyPaid = false;
    
    setDebts(
      debts.map((debt) => {
        if (debt.id === debtId) {
          const newPaidAmount = Math.min(debt.paidAmount + amount, debt.totalAmount);
          isFullyPaid = newPaidAmount === debt.totalAmount;
          return { ...debt, paidAmount: newPaidAmount };
        }
        return debt;
      })
    );

    return isFullyPaid;
  };

  const totalDebt = debts.reduce(
    (sum, debt) => sum + (debt.totalAmount - debt.paidAmount), 
    0
  );

  const totalDebtPaid = debts.reduce((sum, debt) => sum + debt.paidAmount, 0);

  return {
    debts,
    totalDebt,
    totalDebtPaid,
    addDebt,
    payDebt,
  };
};
