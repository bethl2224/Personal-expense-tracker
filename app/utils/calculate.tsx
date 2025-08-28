// totals, budgets, stats logic

// generate random id for data storing
export function generateRandomId(length: number): number {
  const chars = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return Number(result);
}

export function formatBalance(balance: number): string {
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function computeExpense(
  transactions: Transaction[],
  userBudget: number
) {
  const totalExpenseAmount = transactions
    .filter((t) => t.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = transactions
    .filter((t) => t.type === "income")
    .reduce((total, transactions) => total + transactions.amount, 0);
  return {
    totalExpense: totalExpenseAmount,
    balance: balance - totalExpenseAmount,
    remainingBudget: userBudget - totalExpenseAmount,
    percentage: ((totalExpenseAmount / userBudget) * 100).toFixed(2),
  };
}
