import { BottomNav } from "components";
import type { Route } from "./+types/stats";
import { sortTransactionMonthly, sortTransactionWeekly } from "~/utils/date";
import { BarChart } from "@mui/x-charts/BarChart";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";

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
  const [type, setType] = useState<string>("Weekly");

  console.log(transactionWeeklyMap);
  console.log("Most recent week", transactionMostRecentWeek);
  const transactionMonthlyMap = sortTransactionMonthly(transactions);

  // Calculate total monthly spending by summing all values in transactionMonthlyMap
  const transactionMonthValues = Object.entries(transactionMonthlyMap).map(
    ([month, transactionArray]: [string, TransactionMap[]]) => {
      return transactionArray.reduce(
        (monthSum, transaction) => monthSum + transaction.amount,
        0
      );
    }
  );

  return (
    <main className="w-full p-20">
      <h1 className="text-black font-bold text-4xl pb-2">
        {`Spending Analysis 📈`}
      </h1>

      <ToggleButtonGroup
        className="m-20 rounded-3xl flex "
        value={type}
        color="primary"
        exclusive
        onChange={(e, newValue) => {
          setType(newValue);
          console.log(newValue);
        }}
        aria-label="Platform"
      >
        <ToggleButton value="Weekly">Weekly</ToggleButton>
        <ToggleButton value="Monthly">Monthly</ToggleButton>
        <ToggleButton value="Yearly">Yearly</ToggleButton>
      </ToggleButtonGroup>

      <section className="m-20 flex justify-center items-center ">
        {type === "Weekly" ? (
          <BarChart
            title="Weekly Transaction"
            xAxis={[
              {
                data: Object.keys(transactionMostRecentWeek),
                label: "Weekday",
              },
            ]}
            yAxis={[{ label: "Amount" }]}
            series={[
              {
                data: Object.values(transactionMostRecentWeek),
                label: "Weekly Transactions",
              },
            ]}
            height={300}
          />
        ) : type === "Monthly" ? (
          <BarChart
            title=" Monthly Transaction "
            xAxis={[
              { data: Object.keys(transactionMonthlyMap), label: "Month" },
            ]}
            yAxis={[{ label: "Amount" }]}
            series={[
              {
                data: Object.values(transactionMonthValues),
                label: "Monthly Transactions",
              },
            ]}
            height={200}
          />
        ) : (
          <div>Year chart</div>
        )}
        {/* <BarChart
          title=" Monthly Transaction "
          xAxis={[{ data: Object.keys(transactionMonthlyMap), label: "Month" }]}
          yAxis={[{ label: "Amount" }]}
          series={[
            {
              data: Object.values(transactionMonthValues),
              label: "Monthly Transactions",
            },
          ]}
          height={200}
        /> */}
      </section>

      <section>
        <h1 className="text-black font-bold text-4xl pb-2">{`Top Categories 🚀`}</h1>
      </section>

      <BottomNav />
    </main>
  );
};

export default Stats;
