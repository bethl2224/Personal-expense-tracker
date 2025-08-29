import type { LargeNumberLike } from "crypto";

const weekHashamp = {
  1: "Mon",
  2: "Tues",
  3: "Weds",
  4: "Thurs",
  5: "Fri",
  6: "Sat",
  7: "Sun",
};

const monthHashmap = {
  1: "Jan",
  2: "Feb",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "Aug",
  9: "Sept",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

export function getTodaysDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();
  return `${month}-${day}, ${year}`;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 56,
      height: 56,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function formatCreatedDate(date: string): string {
  const dateObj = new Date(date);
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const year = String(dateObj.getFullYear()).slice(-2);
  return `${month}-${day}-${year}`;
}

// Sort transactions by date in descending order (newest first)
export function sortTransactionsByDate(
  transactions: Transaction[]
): Transaction[] {
  return transactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

// transaction of most recent week

// make sure use UTC method to get the standard mongth
export function sortTransactionWeekly(transactions: Transaction[]) {
  const transactionMap: { [key: string]: number } = {};
  const transactionUnAggregated: { [key: string]: TransactionMap[] } = {};
  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    console.log(date.getUTCMonth());
    const key =
      (date.getUTCMonth() + 1).toString() +
      "-" +
      Math.floor(date.getUTCDate() / 7).toString() +
      "-" +
      date.getUTCFullYear().toString();
    if (!transactionMap[key]) {
      transactionMap[key] = 0;
      transactionUnAggregated[key] = [];
    }
    transactionMap[key] += transaction.amount;
    transactionUnAggregated[key].push({
      date: transaction.date,
      amount: transaction.amount,
      categoryId: transaction.category_id,
    });
  }

  const recentWeekTransaction = getMostRecentWeek(transactionUnAggregated);
  console.log(recentWeekTransaction);

  const transactionWeeklyAnalysis = getWeeklyAnalysis(
    transactionUnAggregated[recentWeekTransaction]
  );

  console.log("weekly ⭐️", transactionWeeklyAnalysis);

  return {
    transactionWeeklyMap: transactionMap,
    transactionMostRecentWeek: transactionWeeklyAnalysis,
  };
}

// TODO: more weekly analsys
export function getWeeklyAnalysis(transactionMap: TransactionMap[]) {
  const transactionHashMap: TransactionWeekHashMap = {
    Mon: 0,
    Tues: 0,
    Weds: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };
  console.log("pass in transaction map", transactionMap);
  for (const transaction of transactionMap) {
    const dateOfWeek = new Date(transaction.date)
      .toLocaleString("en-US", { weekday: "short" })
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
    if (!transactionHashMap[dateOfWeek]) {
      transactionHashMap[dateOfWeek] = 0;
    }
    transactionHashMap[dateOfWeek] += transaction.amount;
  }

  return transactionHashMap;
}
// Get the most recent week - key with biggest value
export function getMostRecentWeek(transactionMap: {
  [key: string]: any[];
}): string {
  return Object.keys(transactionMap).reduce((a, b) => {
    const [monthA, weekA, yearA] = a.split("-").map(Number);
    const [monthB, weekB, yearB] = b.split("-").map(Number);
    if (yearA > yearB) return a;
    if (yearA < yearB) return b;
    if (monthA > monthB) return a;
    if (monthA < monthB) return b;
    return weekA > weekB ? a : b;
  });
}

// transaction of past 12 months
export function sortTransactionMonthly(transactions: Transaction[]) {
  const transactionMap: { [key: string]: TransactionMap[] } = {
    Jan: [],
    Feb: [],
    March: [],
    April: [],
    May: [],
    June: [],
    July: [],
    Aug: [],
    Sept: [],
    Oct: [],
    Nov: [],
    Dec: [],
  };

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const month = monthHashmap[Number(date.getUTCMonth() + 1)];

    if (!transactionMap[month]) {
      transactionMap[month] = [];
    }
    transactionMap[month].push({
      date: transaction.date,
      amount: transaction.amount,
      categoryId: transaction.category_id,
    });
  }

  // Sort months in ascending order
  const sortedMonths = Object.keys(transactionMap).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  // Create new sorted map
  const sortedTransactionMap: { [key: string]: TransactionMap[] } = {};
  sortedMonths.forEach((month) => {
    sortedTransactionMap[month] = transactionMap[month];
  });

  return sortedTransactionMap;
}
