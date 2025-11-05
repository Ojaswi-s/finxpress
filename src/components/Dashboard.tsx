import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, TrendingDown, TrendingUp, Target, Plus, UtensilsCrossed, Plane, Tv, ShoppingBag, Home, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ExpenseChart from "./ExpenseChart";

const categoryIcons: Record<string, React.ReactNode> = {
  Food: <UtensilsCrossed className="w-5 h-5" />,
  Travel: <Plane className="w-5 h-5" />,
  Subscriptions: <Tv className="w-5 h-5" />,
  Shopping: <ShoppingBag className="w-5 h-5" />,
  Utilities: <Home className="w-5 h-5" />,
  Other: <MoreHorizontal className="w-5 h-5" />,
};

const Dashboard = () => {
  const [expenses] = useState([
    { category: "Food", amount: 450, date: "2024-01-15" },
    { category: "Travel", amount: 200, date: "2024-01-18" },
    { category: "Subscriptions", amount: 99, date: "2024-01-20" },
    { category: "Shopping", amount: 350, date: "2024-01-22" },
  ]);

  const [goals] = useState([
    { name: "Emergency Fund", target: 50000, current: 28000, icon: <Target className="w-5 h-5" /> },
    { name: "Vacation", target: 30000, current: 12000, icon: <Plane className="w-5 h-5" /> },
    { name: "New Laptop", target: 80000, current: 45000, icon: <ShoppingBag className="w-5 h-5" /> },
  ]);

  const totalIncome = 8225;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = totalIncome - totalExpenses;

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">
              Financial Dashboard
            </h2>
            <p className="text-muted-foreground">
              Track your income, expenses, and savings at a glance
            </p>
          </div>
          <Button className="shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Income"
            value={`₹${totalIncome.toLocaleString()}`}
            icon={<Wallet className="w-5 h-5" />}
            trend="+12%"
            trendUp={true}
            gradient="from-primary to-primary-glow"
          />
          <StatCard
            title="Total Expenses"
            value={`₹${totalExpenses.toLocaleString()}`}
            icon={<TrendingDown className="w-5 h-5" />}
            trend="-8%"
            trendUp={false}
            gradient="from-destructive to-orange-500"
          />
          <StatCard
            title="Savings"
            value={`₹${savings.toLocaleString()}`}
            icon={<Target className="w-5 h-5" />}
            trend="+15%"
            trendUp={true}
            gradient="from-accent-foreground to-blue-600"
          />
        </div>

        {/* Goal Tracking */}
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Financial Goals</CardTitle>
            <CardDescription>Track your progress towards savings goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {goal.icon}
                      </div>
                      <span className="font-medium text-foreground">{goal.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all"
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {Math.round((goal.current / goal.target) * 100)}% complete
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts and Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Chart */}
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
              <CardDescription>Breakdown by category this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseChart expenses={expenses} />
            </CardContent>
          </Card>

          {/* Add Expense Form */}
          <Card className="shadow-lg border-border">
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
              <CardDescription>Track your spending with smart categorization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="₹0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="What did you spend on?" />
              </div>
              <Button className="w-full">Add Expense</Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.map((expense, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {categoryIcons[expense.category] || <MoreHorizontal className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{expense.category}</p>
                      <p className="text-sm text-muted-foreground">{expense.date}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-foreground">
                    ₹{expense.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendUp,
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  gradient: string;
}) => {
  return (
    <Card className="shadow-lg border-border overflow-hidden group hover:shadow-xl transition-all">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trendUp ? "text-primary" : "text-destructive"
          }`}>
            {trendUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
