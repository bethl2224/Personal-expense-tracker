import { Balance, BottomNav, HeaderBar } from "components";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

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

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="w-full p-20">
      <HeaderBar userInfo={loaderData?.user || {}} />
      <Balance
        transactions={loaderData?.transactions || []}
        categories={loaderData?.categories}
        userBudget={loaderData?.user.user_budget}
      />
      <BottomNav />
    </main>
  );
}
