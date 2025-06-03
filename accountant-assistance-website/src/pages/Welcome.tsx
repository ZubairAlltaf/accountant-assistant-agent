
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";

const Welcome = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleStart = () => {
    setUser({ name: "User", isGuest: true });
    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">FinPal</h1>
          <p className="text-gray-600">Your friendly finance assistant</p>
        </div>

        {/* Assistant Avatar */}
        <Card className="border-none shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-blue-200">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xl">
                FP
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Hi! I'm your Finance Assistant
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              I'm here to help you manage your finances, track expenses, and reach your financial goals. Let's get started!
            </p>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="space-y-3">
          <Button 
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 text-lg font-medium"
          >
            Start Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
