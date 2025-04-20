import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  const fetchTransactions = async () => {
    const res = await axios.get("/api/transactions");
    setTransactions(res.data);
  };

  const fetchBalance = async () => {
    const res = await axios.get("/api/balance");
    setBalance(parseFloat(res.data.running_balance) || 0);
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  const addDeposit = async (amount) => {
    await axios.post("/api/deposit", { amount });
    await fetchBalance();
    await fetchTransactions();
  };

  const addWithdrawal = async (name, amount) => {
    await axios.post("/api/withdraw", { name, amount });
    await fetchBalance();
    await fetchTransactions();
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, balance, addDeposit, addWithdrawal }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
