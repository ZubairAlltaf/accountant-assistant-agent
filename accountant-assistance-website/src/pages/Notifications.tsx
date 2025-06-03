
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Banknote, Wallet } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  category: 'bill' | 'review' | 'saving' | 'investment';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'alert' | 'tip';
  timestamp: string;
  read: boolean;
}

const Notifications = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Pay Credit Card Bill',
      description: 'Credit card payment due tomorrow',
      priority: 'high',
      dueDate: 'Tomorrow',
      completed: false,
      category: 'bill'
    },
    {
      id: '2',
      title: 'Review Weekly Spending',
      description: 'Check your expenses from last week',
      priority: 'medium',
      dueDate: 'Today',
      completed: false,
      category: 'review'
    },
    {
      id: '3',
      title: 'Transfer to Savings',
      description: 'Monthly transfer to emergency fund',
      priority: 'medium',
      dueDate: 'In 2 days',
      completed: false,
      category: 'saving'
    },
    {
      id: '4',
      title: 'Investment Portfolio Review',
      description: 'Quarterly review of investment performance',
      priority: 'low',
      dueDate: 'Next week',
      completed: true,
      category: 'investment'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Spending Alert',
      message: 'You\'ve spent 75% of your monthly budget',
      type: 'alert',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Savings Milestone',
      message: 'Congratulations! You\'ve reached 65% of your emergency fund goal',
      type: 'tip',
      timestamp: '1 day ago',
      read: false
    },
    {
      id: '3',
      title: 'Bill Reminder',
      message: 'Electricity bill due in 3 days',
      type: 'reminder',
      timestamp: '2 days ago',
      read: true
    }
  ]);

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bill': return <Banknote className="w-4 h-4" />;
      case 'saving': return <Wallet className="w-4 h-4" />;
      default: return <Banknote className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'alert': return 'border-l-red-500 bg-red-50';
      case 'tip': return 'border-l-green-500 bg-green-50';
      case 'reminder': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const unreadNotifications = notifications.filter(notif => !notif.read);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-gray-800">Tasks & Notifications</h1>
          <p className="text-gray-600">Stay on top of your financial tasks</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{pendingTasks.length}</div>
              <p className="text-sm text-gray-600">Pending Tasks</p>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {unreadNotifications.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800 flex items-center justify-between">
                Notifications
                <Badge variant="destructive" className="rounded-full">
                  {unreadNotifications.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-200 ${
                    getNotificationColor(notification.type)
                  } ${notification.read ? 'opacity-60' : ''}`}
                  onClick={() => markNotificationRead(notification.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-sm text-gray-800">{notification.title}</h4>
                    <span className="text-xs text-gray-500">{notification.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Pending Tasks */}
        <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskComplete(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-gray-800">{task.title}</h4>
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(task.category)}
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-blue-600 mt-1">Due: {task.dueDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg opacity-75">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskComplete(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm text-gray-800 line-through">{task.title}</h4>
                      {getCategoryIcon(task.category)}
                    </div>
                    <p className="text-sm text-gray-600 line-through">{task.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Automation Placeholder */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Smart Automation</h3>
            <p className="text-sm text-purple-100 mb-4">
              Set up automatic bill payments and savings transfers
            </p>
            <Button 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              Setup Automation
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
