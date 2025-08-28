import {
  Autocomplete,
  Box,
  Modal,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useState } from "react";
import { generateRandomId } from "~/utils/calculate";
import { useRevalidator } from "react-router";

const BASEURL = "http://localhost:3000/api";

export const categories = [
  "Groceries",
  "Entertainment",
  "Transportation",
  "Utilities",
  "Rent",
  "Salary",
  "Bills",
];

export const categoriesMap = [
  {
    1: "Groceries",
    2: "Entertainment",
    3: "Transportation",
    4: "Utilities",
    5: "Rent",
    6: "Salary",
    7: "Bills",
  },
];

const TransactionForm = ({ open, handleClose }: TransactionFormProps) => {
  const [newExpense, setExpense] = useState<TransactionData>({
    user_id: 0,
    category_id: 1, // default is groceries
    amount: 0,
    description: "",
    type: "expense",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const revalidator = useRevalidator();
  const handleChange = (key: keyof TransactionData, value: string | number) => {
    setExpense({ ...newExpense, [key]: value });
  };

  // # TODO: call endpoint to createExpense here
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (Number.isNaN(newExpense.amount)) {
      setError("Please enter a valid amount");
      console.log("Please enter valid number amount");
      setLoading(false);
      return;
    }

    try {
      const date = new Date().toISOString();
      const user_id = 1; // TODO: dummy for now
      // Find the category object in categoriesMap, then find the key that matches the selected category
      const category_id = Number(
        Object.entries(categoriesMap[0]).find(
          ([key, value]) => value === newExpense.category_id.toString()
        )?.[0]
      );

      console.log("NEW EXPENSE 🛑", newExpense);
      // frontend make sure the data is format correctly to pass in the data
      const transaction: Transaction = {
        ...newExpense,
        category_id: category_id,
        user_id: user_id,
        transaction_id: generateRandomId(10), // generate a random 10 id
        date: date,
      };

      // create Transaction
      const response = await fetch(`${BASEURL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      const result: Transaction = await response.json();

      if (result) {
        console.log("NEW TRANSACTION 💰", result);
        handleClose(false);

        revalidator.revalidate(); // it calls the loader function in your route again to refresh data
      } else {
        console.error("Error in creating transaction");
      }

      console.log("final data: ", transaction);
    } catch (error) {
      console.log("Error creating expense");
      setLoading(false);
      handleClose(false);
    } finally {
      setLoading(false);
      handleClose(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 sm:w-[500px] max-w-lg">
        <form
          method="post"
          className="bg-white p-6 rounded-lg shadow-md w-full"
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Add Transaction
          </h2>
          <ToggleButtonGroup
            className="rounded-3xl  pl-35"
            value={newExpense.type}
            color="primary"
            exclusive
            onChange={(e, newValue) => {
              handleChange("type", newValue);
              console.log(newValue);
            }}
            aria-label="Platform"
          >
            <ToggleButton value="expense">Expense</ToggleButton>
            <ToggleButton value="income">Income</ToggleButton>
          </ToggleButtonGroup>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="amount"
            >
              Amount
            </label>
            <TextField
              required
              name="amount"
              className="w-full"
              placeholder="$0.00"
              onChange={(e) => handleChange("amount", Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <Autocomplete
              disablePortal
              defaultValue={categories[0]}
              options={categories}
              onChange={(e, newValue) => handleChange("category_id", newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="category"
            >
              Description (optional)
            </label>
            <TextField
              className="w-full"
              placeholder="Grocery Shopping"
              rows={4}
              multiline
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="flex justify-between items-start">
            <button
              className="bg-blue-400 rounded w-20 h-10 text-white"
              onClick={() => handleClose(false)}
            >
              Cancel
            </button>

            <button
              className="bg-amber-600 rounded w-20 h-10 text-white"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default TransactionForm;
