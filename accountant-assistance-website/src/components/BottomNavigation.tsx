import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, MessageCircle, Wallet, Banknote } from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/chat", icon: MessageCircle, label: "Chat" },
    { path: "/goals", icon: Wallet, label: "Goals" },
    { path: "/notifications", icon: Banknote, label: "Tasks" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center h-16 space-y-1 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-t from-blue-50 to-purple-50 text-blue-600" 
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : ""}`} />
                <span className={`text-xs font-medium ${isActive ? "text-blue-600" : ""}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
