import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  Food: "hsl(142 76% 45%)",
  Travel: "hsl(217 91% 60%)",
  Subscriptions: "hsl(280 87% 65%)",
  Shopping: "hsl(25 95% 58%)",
  Utilities: "hsl(187 85% 45%)",
  Entertainment: "hsl(340 82% 60%)",
  Health: "hsl(0 84% 60%)",
  Education: "hsl(45 93% 55%)",
  // Student categories
  Textbooks: "hsl(262 83% 58%)",
  Tuition: "hsl(198 93% 60%)",
  Cafeteria: "hsl(32 95% 50%)",
  "Hostel Fees": "hsl(355 78% 56%)",
  "Study Material": "hsl(168 76% 42%)",
  // Professional categories
  Commute: "hsl(240 70% 60%)",
  "Office Supplies": "hsl(15 90% 55%)",
  "Team Lunches": "hsl(48 96% 53%)",
  "House Rent": "hsl(308 70% 55%)",
  "Home Loan": "hsl(173 80% 40%)",
  Other: "hsl(220 14% 50%)",
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
