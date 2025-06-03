
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { ArrowUp, ArrowDown, Wallet, Banknote } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const { user } = useUser();

  const expenseData = [
    { name: "Mon", amount: 120 },
    { name: "Tue", amount: 85 },
    { name: "Wed", amount: 200 },
    { name: "Thu", amount: 150 },
    { name: "Fri", amount: 300 },
    { name: "Sat", amount: 180 },
    { name: "Sun", amount: 95 },
  ];

  const categoryData = [
    { name: "Food", value: 400, color: "#8884d8" },
    { name: "Transport", value: 200, color: "#82ca9d" },
    { name: "Shopping", value: 150, color: "#ffc658" },
    { name: "Bills", value: 180, color: "#ff7c7c" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.name}!</h1>
            <p className="text-gray-600">Here's your financial overview</p>
          </div>
          <Avatar className="w-12 h-12 border-2 border-blue-200">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
              {user?.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm">Total Balance</p>
                <h2 className="text-3xl font-bold">$4,250.80</h2>
              </div>
              <Wallet className="w-8 h-8 text-blue-200" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <ArrowUp className="w-4 h-4 text-green-300" />
                <span className="text-sm text-blue-100">Income: $3,200</span>
              </div>
              <div className="flex items-center space-x-1">
                <ArrowDown className="w-4 h-4 text-red-300" />
                <span className="text-sm text-blue-100">Expenses: $1,130</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-xl font-bold text-gray-800">+$320</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Banknote className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Saved</p>
              <p className="text-xl font-bold text-gray-800">$850</p>
            </CardContent>
          </Card>
        </div>

        {/* Spending Chart */}
        <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Weekly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-32"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={expenseData}>
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    fill="url(#colorAmount)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">${category.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
