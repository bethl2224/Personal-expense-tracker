import { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import AddIcon from "@mui/icons-material/Add";
import { TransactionForm, TransactionItem } from "components";
import { computeExpense, formatBalance } from "~/utils/calculate";
import { sortTransactionsByDate } from "~/utils/date";

const Balance = ({ transactions, categories, userBudget }: BalanceProps) => {
  const [open, setOpened] = useState<boolean>(false);
  console.log("Transactions count:", transactions.length);
  console.log(transactions);
  const { totalExpense, remainingBudget, balance, percentage } = computeExpense(
    transactions,
    userBudget
  );

  const TransactionsDesc = sortTransactionsByDate(transactions);
  console.log("recalcualte", totalExpense, remainingBudget, percentage);

  return (
    <article className="mb-10">
      <h1 className="text-gray-600 font text-2xl mb-5">Your Balance</h1>
      <span className="text-4xl">
        <span className="text-gray-300">$</span>&nbsp;
        <span className="text-gray-700 font-bold tracking-[0.03em]">
          {formatBalance(balance)}
        </span>
        <span className="text-gray-300">.00</span>
      </span>
      <div className="bg-[#6bc5e3] rounded-xl mt-8 p-10">
        <h1 className="text-white font-semibold text-2xl">Monthly Budget</h1>
        <LinearProgress className="mt-10 " variant="determinate" value={50} />
        <div className="flex justify-between items-start">
          <p className="mt-5 text-white">{`$${totalExpense}/${userBudget}`}</p>
          <p className="mt-5 text-white">{`${percentage}%`}</p>
        </div>
      </div>

      <div>
        <h2 className="text-gray-600 font-bold text-2xl mt-10">
          Recent Transactions
          {TransactionsDesc.map((transaction: Transaction) => (
            <TransactionItem
              key={transaction.transaction_id}
              date={transaction.date}
              category={
                typeof transaction.category_id == "number"
                  ? categories[transaction.category_id]
                  : ""
              }
              amount={transaction.amount}
              type={transaction.type}
            />
          ))}
        </h2>
        <button
          onClick={() => setOpened(true)}
          className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-100 bg-green-500 px-4 py-2 rounded-3xl "
        >
          <AddIcon className="text-white" />
        </button>
        <TransactionForm open={open} handleClose={setOpened} />
      </div>
    </article>
  );
};

export default Balance;
