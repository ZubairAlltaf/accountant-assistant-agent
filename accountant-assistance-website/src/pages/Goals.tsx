
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUp, Wallet } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  category: string;
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Emergency Fund', target: 10000, current: 6500, category: 'Savings' },
    { id: '2', title: 'New Car', target: 25000, current: 8200, category: 'Purchase' },
    { id: '3', title: 'Vacation Fund', target: 3000, current: 1800, category: 'Travel' },
  ]);

  const [budget, setBudget] = useState<BudgetCategory[]>([
    { name: 'Food & Dining', allocated: 600, spent: 420, color: 'bg-blue-500' },
    { name: 'Transportation', allocated: 300, spent: 180, color: 'bg-green-500' },
    { name: 'Shopping', allocated: 200, spent: 150, color: 'bg-yellow-500' },
    { name: 'Bills & Utilities', allocated: 400, spent: 380, color: 'bg-red-500' },
  ]);

  const [newGoal, setNewGoal] = useState({ title: '', target: '', category: 'Savings' });

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getBudgetPercentage = (spent: number, allocated: number) => {
    return Math.min((spent / allocated) * 100, 100);
  };

  const addGoal = () => {
    if (newGoal.title && newGoal.target) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        target: parseFloat(newGoal.target),
        current: 0,
        category: newGoal.category,
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', target: '', category: 'Savings' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-800">Goals & Budget</h1>
          <p className="text-gray-600">Track your progress and manage spending</p>
        </div>

        {/* Monthly Budget Overview */}
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-green-100 text-sm">Monthly Budget</p>
                <h2 className="text-3xl font-bold">$1,500</h2>
              </div>
              <Wallet className="w-8 h-8 text-green-200" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-100">Spent: $1,130</span>
              <span className="text-sm text-green-100">Remaining: $370</span>
            </div>
            <div className="mt-3 bg-green-600/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${(1130 / 1500) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budget.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-600">${category.spent} / ${category.allocated}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${category.color}`}
                    style={{ width: `${getBudgetPercentage(category.spent, category.allocated)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Savings Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{goal.title}</h3>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    {goal.category}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">
                    ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.round(getProgressPercentage(goal.current, goal.target))}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Add New Goal */}
        <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Add New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goalTitle" className="text-sm font-medium text-gray-700">Goal Title</Label>
              <Input
                id="goalTitle"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g., Emergency Fund"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="goalTarget" className="text-sm font-medium text-gray-700">Target Amount</Label>
              <Input
                id="goalTarget"
                type="number"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                placeholder="5000"
                className="mt-1"
              />
            </div>
            <Button 
              onClick={addGoal}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Goals;
