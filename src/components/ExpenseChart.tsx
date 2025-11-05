import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  Food: "hsl(158 64% 52%)",
  Travel: "hsl(210 100% 50%)",
  Subscriptions: "hsl(280 70% 60%)",
  Shopping: "hsl(30 100% 60%)",
  Utilities: "hsl(200 70% 50%)",
  Other: "hsl(0 0% 60%)",
};

interface Expense {
  category: string;
  amount: number;
  date: string;
}

const ExpenseChart = ({ expenses }: { expenses: Expense[] }) => {
  // Aggregate expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other} 
            />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
