// define all interface object
declare interface User {
  user_id: number;
  name: string;
  email: string;
  user_budget: string;
}

declare interface Category {
  category_id: number;
  user_id: string;
  name:
    | "Groceries"
    | "Entertainment"
    | "Transportation"
    | "Utilities"
    | "Rent"
    | "Salary"
    | "Bills";
  budget?: number;
}

declare interface Transaction {
  // transaction_id: number;
  user_id: number;
  category_id: number;
  amount: number;
  date: string;
  description?: string;
  type: "expense" | "income";
}

declare interface TransactionData {
  user_id: number;
  category_id: number | string; // string is for storing value initially
  amount: number;
  description?: string;
  type: "expense" | "income";
}

declare interface BalanceProps {
  transactions: Transaction[];
  categories: { [key: number]: string };
  userBudget: number;
}

declare interface TransactionItemProps {
  date: string;
  category: string;
  amount: number;
  type: "expense" | "income";
}

declare interface TransactionFormProps {
  open: boolean;
  handleClose: (value: boolean) => void;
}
