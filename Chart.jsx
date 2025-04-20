import { useEffect, useState } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";

const Chart = () => {
  const [chartData, setChartData] = useState({
    options: {
        chart: {
          id: "wallet-balance-chart",
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          title: { text: "Transaction # (in order)" },
          categories: [],
        },
        yaxis: {
          title: { text: "Wallet Balance (Rs.)" },
        },
        stroke: {
          curve: "stepline",
          width: 3,
          colors: ["#00BFFF"],
        },
      },
      
    series: [
      {
        name: "Wallet Balance",
        data: [],
      },
    ],
  });

  useEffect(() => {
    axios
      .get("/api/transactions")
      .then((res) => {
        const data = res.data;

        let runningBalance = 0;
        const balances = [];
        const txIndex = [];

        data.forEach((transaction, index) => {
          const amount = parseFloat(transaction.amount);
          if (transaction.type === "deposit") {
            runningBalance += amount;
          } else if (transaction.type === "withdrawal") {
            runningBalance -= amount;
          }

          txIndex.push(index + 1); // Transaction 1, 2, 3, ...
          balances.push(runningBalance);
        });

        setChartData((prev) => ({
          ...prev,
          options: {
            ...prev.options,
            xaxis: {
              categories: txIndex,
            },
          },
          series: [
            {
              name: "Wallet Balance",
              data: balances,
            },
          ],
        }));
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  return (
    <div className="p-4">
      <h2>Wallet Flow Chart</h2>
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

export default Chart;
