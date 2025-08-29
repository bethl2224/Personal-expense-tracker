import { BottomNav } from "components";
import type { Route } from "./+types/stats";
import { sortTransactionMonthly, sortTransactionWeekly } from "~/utils/date";
import { BarChart } from "@mui/x-charts/BarChart";

const BASEURL = "http://localhost:3000/api";
const userId = "1";
export async function loader() {
  try {
    const transactions = await fetch(`${BASEURL}/transactions/users/${userId}`);
    const categories = await fetch(`${BASEURL}/categories`);
    const user = await fetch(`${BASEURL}/users/${userId}`);

    console.log("reload loader", transactions);

    return {
      transactions: await transactions.json(),
      categories: await categories.json(),
      user: await user.json(),
    };
  } catch (error) {
    console.log("error fetching loader data", error);
  }
}

const Stats = ({ loaderData }: Route.ComponentProps) => {
  const { transactions, categories, user } = loaderData;
  const { transactionWeeklyMap, transactionMostRecentWeek } =
    sortTransactionWeekly(transactions);

  console.log(transactionWeeklyMap);
  console.log("Most recent week", transactionMostRecentWeek);
  console.log("Month", sortTransactionMonthly(transactions));

  return (
    <main className="w-full p-20">
      <h1>Spending Analysis</h1>
      <BarChart
        xAxis={[{ data: Object.keys(transactionMostRecentWeek) }]}
        series={[{ data: Object.values(transactionMostRecentWeek) }]}
        height={200}
      />
      <BottomNav />
    </main>
  );
};

export default Stats;
