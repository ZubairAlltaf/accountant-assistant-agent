
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "./contexts/UserContext";
import Welcome from "./pages/Welcome";
import Chat from "./pages/Chat";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<{ name: string; isGuest: boolean } | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserContext.Provider value={{ user, setUser }}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </div>
          </BrowserRouter>
        </UserContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
