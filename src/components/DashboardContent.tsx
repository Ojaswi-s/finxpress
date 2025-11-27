import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, TrendingDown, TrendingUp, Target, Plus, UtensilsCrossed, Plane, Tv, ShoppingBag, Home, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import ExpenseChart from "./ExpenseChart";

const categoryIcons: Record<string, React.ReactNode> = {
  Food: <UtensilsCrossed className="w-5 h-5" />,
  Travel: <Plane className="w-5 h-5" />,
  Subscriptions: <Tv className="w-5 h-5" />,
  Shopping: <ShoppingBag className="w-5 h-5" />,
  Utilities: <Home className="w-5 h-5" />,
  Other: <MoreHorizontal className="w-5 h-5" />,
};

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
}

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  icon: string | null;
}

const DashboardContent = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [userType, setUserType] = useState<"student" | "professional">("professional");
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [expenseForm, setExpenseForm] = useState({ amount: "", category: "", description: "" });
  const [goalForm, setGoalForm] = useState({ name: "", target_amount: "", current_amount: "", icon: "Target" });
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [expensesRes, goalsRes, incomeRes, profileRes] = await Promise.all([
        supabase.from("expenses").select("*").order("date", { ascending: false }),
        supabase.from("goals").select("*"),
        supabase.from("income").select("amount"),
        supabase.from("profiles").select("user_type").single(),
      ]);

      if (expensesRes.error) throw expensesRes.error;
      if (goalsRes.error) throw goalsRes.error;
      if (incomeRes.error) throw incomeRes.error;

      setExpenses(expensesRes.data || []);
      setGoals(goalsRes.data || []);
      setTotalIncome(incomeRes.data?.reduce((sum, inc) => sum + parseFloat(String(inc.amount)), 0) || 0);
      
      if (profileRes.data?.user_type) {
        setUserType(profileRes.data.user_type);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async () => {
    if (!expenseForm.amount || !expenseForm.category) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("expenses").insert({
        user_id: user?.id,
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category,
        description: expenseForm.description || null,
      });

      if (error) throw error;

      toast.success("Expense added successfully!");
      setExpenseForm({ amount: "", category: "", description: "" });
      setIsExpenseDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      toast.success("Expense deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addGoal = async () => {
    if (!goalForm.name || !goalForm.target_amount) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const { error } = await supabase.from("goals").insert({
        user_id: user?.id,
        name: goalForm.name,
        target_amount: parseFloat(goalForm.target_amount),
        current_amount: parseFloat(goalForm.current_amount) || 0,
        icon: goalForm.icon,
      });

      if (error) throw error;

      toast.success("Goal created successfully!");
      setGoalForm({ name: "", target_amount: "", current_amount: "", icon: "Target" });
      setIsGoalDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
      toast.success("Goal deleted!");
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(String(exp.amount)), 0);
  const savings = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">Financial Dashboard</h2>
            <p className="text-muted-foreground">Track your income, expenses, and savings at a glance</p>
          </div>
          <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Track your spending with smart categorization</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({ ...expenseForm, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Subscriptions">Subscriptions</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What did you spend on?"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  />
                </div>
                <Button onClick={addExpense} className="w-full">Add Expense</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title={userType === "student" ? "Monthly Pocket Money" : "Monthly Income"}
            value={`₹${totalIncome.toLocaleString()}`}
            icon={<Wallet className="w-5 h-5" />}
            gradient="from-primary to-primary-glow"
          />
          <StatCard
            title="Total Expenses"
            value={`₹${totalExpenses.toLocaleString()}`}
            icon={<TrendingDown className="w-5 h-5" />}
            gradient="from-destructive to-orange-500"
          />
          <StatCard
            title="Savings"
            value={`₹${savings.toLocaleString()}`}
            icon={<Target className="w-5 h-5" />}
            gradient="from-accent-foreground to-blue-600"
          />
        </div>

        {/* Goal Tracking */}
        <Card className="shadow-lg border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Financial Goals</CardTitle>
              <CardDescription>Track your progress towards savings goals</CardDescription>
            </div>
            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>Set a financial target to work towards</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input
                      id="goal-name"
                      placeholder="Emergency Fund"
                      value={goalForm.name}
                      onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Amount (₹)</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="50000"
                      value={goalForm.target_amount}
                      onChange={(e) => setGoalForm({ ...goalForm, target_amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Amount (₹)</Label>
                    <Input
                      id="current"
                      type="number"
                      placeholder="0"
                      value={goalForm.current_amount}
                      onChange={(e) => setGoalForm({ ...goalForm, current_amount: e.target.value })}
                    />
                  </div>
                  <Button onClick={addGoal} className="w-full">Create Goal</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No goals yet. Create your first goal!</p>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Target className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-foreground">{goal.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          ₹{parseFloat(String(goal.current_amount)).toLocaleString()} / ₹{parseFloat(String(goal.target_amount)).toLocaleString()}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all"
                        style={{ width: `${Math.min((parseFloat(String(goal.current_amount)) / parseFloat(String(goal.target_amount))) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {Math.round((parseFloat(String(goal.current_amount)) / parseFloat(String(goal.target_amount))) * 100)}% complete
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Chart */}
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <ExpenseChart expenses={expenses} />
            ) : (
              <p className="text-center text-muted-foreground py-8">No expenses yet. Add your first expense!</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No transactions yet. Start tracking your expenses!</p>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 10).map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        {categoryIcons[expense.category] || <MoreHorizontal className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{expense.category}</p>
                        <p className="text-sm text-muted-foreground">{expense.description || "No description"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">₹{parseFloat(String(expense.amount)).toLocaleString()}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}) => {
  return (
    <Card className="shadow-lg border-border overflow-hidden group hover:shadow-xl transition-all">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white`}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardContent;
