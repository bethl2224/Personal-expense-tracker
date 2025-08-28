// Bring in express framework and store in a constant
import { data } from "./dummy.js";

import express from "express";

const app = express();
app.use(express.json()); // to parse JSON bodies

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// view personal info

// app.get(User: user id)
const PORT = 3000;

app.get("/api/users/:userId", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log("user id", req.params.userId);
    const user = data.users.find((user) => user.user_id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "Error finding user" });
  }
});

// The user should be able to create an expense with an expense and income type
// app.post(expense new)
app.post("/api/transactions", (req, res) => {
  try {
    const { user_id, category_id, amount, date, type } = req.body;

    if (!user_id || !category_id || !amount || !date || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // add new expense
    data.transactions.push(req.body);

    return res.status(201).json(req.body);
  } catch (error) {
    return res.status(500).json({ error: "Error adding expense" });
  }
});

app.get("/api/transactions/users/:userId", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    return res
      .status(200)
      .json(
        data.transactions.filter(
          (transaction) => transaction.user_id === userId
        )
      );
  } catch (error) {
    return res.status(500).json({ error: "Error getting transactions" });
  }
});

app.get("/api/categories", (req, res) => {
  try {
    return res.status(200).json(data.categories[0]);
  } catch (error) {
    return res.status(500).json({ error: "Error getting categories" });
  }
});

// set up budget
// app.patch(user: budget) ✅
app.post("/api/users/:userId/budget", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const newBudget = parseInt(req.body.budget);
    console.log(userId, newBudget);

    const user = data.users.find((user) => user.user_id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const originalBudget = user.user_budget;
    user.user_budget = newBudget;

    const res_user = { ...user, originalBudget: originalBudget };

    res.json({
      message: "Budget updated successfully",
      res_user,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error updating user budget" });
  }
});

// get remaining budget of user
// app.get(user: budget) ✅
app.get("/api/users/:userId/budget", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log(userId, "userid");
    const user = data.users.find((e) => e.user_id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res
      .status(200)
      .json({ budget: user.user_budget, userName: user.name });
  } catch (error) {
    return res.status(500).json({ error: "error in getting budget" });
  }
});
// app.get (expense sum total for user) ✅
app.get("/api/users/:userId/transaction-sum", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log(userId);
    const transactions = data.transactions.filter((e) => userId === e.user_id);
    // return sum of the user expense
    const transactionTotal = transactions.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    console.log(transactionTotal);
    return res.status(200).json({
      userId: userId,
      totalExpense: transactionTotal,
    });
  } catch (error) {
    return res.status(500).json({ error: "error in finding user expense sum" });
  }
});

// get remaining budget of user  ✅
app.get("/api/users/:userId/remaining-budget", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = data.users.find((user) => user.user_id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactions = data.transactions.filter((e) => e.user_id === userId);
    const totalTransactions = transactions.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    console.log("user budget", user.user_budget);
    console.log(totalTransactions);

    const remaining = user.user_budget - totalTransactions;
    return res
      .status(200)
      .json({ userId: userId, name: user.name, remainingBudget: remaining });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "error gettting user remaining budget" });
  }
});

// delete expense  ✅
app.delete("/api/transactions/:transactionId", (req, res) => {
  try {
    const transactionId = parseInt(req.params.transactionId);
    const transaction = data.transactions.find(
      (e) => e.transaction_id === transactionId
    );

    if (!transaction) {
      return res.status(400).json({ error: "Expense does not exist" });
    }
    console.log(transaction);

    data.transactions.pop(transactionId);
    console.log(data.transactions);
    return res.json({ message: "Expense deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Error in deleting expenses" });
  }
});

// stats page
// app.get(expense by day) ✅
app.get("/api/transaction/:userId/daily", (req, res) => {
  const userId = parseInt(req.params.userId);
  const transactions = data.transactions.filter((e) => e.user_id === userId);

  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return res.status(200).json(transactions);
});
// sort by month and year ✅
app.get("/api/transaction/:userId/monthly", (req, res) => {
  const userId = parseInt(req.params.userId);

  let transactions = data.transactions.filter((e) => e.user_id === userId);

  // Group by year + month
  const grouped = {};

  transactions.forEach((e) => {
    const d = new Date(e.date);
    const year = d.getFullYear();
    // pad the month, the month is at least two digits long
    // getUTCMonth to avoid date error
    const month = String(d.getUTCMonth() + 1).padStart(2, "0"); // 01–12
    const key = `${year}-${month}`; // e.g., "2025-08"

    // group the transaction based on this
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(e);
  });

  // Sort each group by date (optional)
  for (const key in grouped) {
    grouped[key].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  res.json(grouped);
});

// expense by category ✅

app.get("/api/transaction/:userId/category", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log(userId);

    const transactions = data.transactions.filter((e) => e.user_id === userId);

    // Group by year + month
    const grouped = {};
    const categories = data.categories[0];

    transactions.forEach((e) => {
      const key = categories[e.category_id];
      console.log("key", key);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(e);
    });

    console.log(grouped);

    // Sort expense by categories and by date (optional)
    for (const key in grouped) {
      grouped[key].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    res.json(grouped);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error getting userId sort by category" });
  }
});

// see MOST recently transaction ✅
// app.get (Trasaction by userid sort by date limit 5)
app.get("/api/transaction/:userId", (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    let transactions = data.transactions.filter((e) => e.user_id === userId);
    transactions = transactions.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ error: "error getting user transaction" });
  }
});

app.listen(PORT, () => console.log(`Server running on port  ${3000}`));
