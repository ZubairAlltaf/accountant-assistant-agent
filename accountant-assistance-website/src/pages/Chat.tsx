
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, ArrowUp, ArrowLeft } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Chat = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your finance assistant. How can I help you manage your money today?",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/39fe33f2-bb0c-41a3-b902-60357f14ad7e";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("Sending message to n8n webhook:", messageToSend);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 70000); // 70 second timeout
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          timestamp: new Date().toISOString(),
          user: user?.name || "User"
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const responseText = await response.text();
        console.log("Raw response text:", responseText);
        
        let assistantResponse = "";
        
        // Handle empty response
        if (!responseText.trim()) {
          console.log("Empty response received, waiting for data...");
          assistantResponse = "I received your message and I'm processing it. Please wait up to 70 seconds for the response.";
        } else {
          // Try to parse as JSON first
          try {
            const responseData = JSON.parse(responseText);
            console.log("Parsed response from n8n:", responseData);
            
            // Check if response contains success message with data
            if (responseData["YOur data has been succefully added"] || 
                responseData["Your data has been successfully added"] ||
                (typeof responseData === 'object' && Object.keys(responseData).some(key => 
                  key.toLowerCase().includes('data') && key.toLowerCase().includes('added')))) {
              assistantResponse = "Your data has been successfully added!";
            }
            // Handle different response formats from n8n
            else if (responseData.output) {
              assistantResponse = responseData.output;
            } else if (responseData.response) {
              assistantResponse = responseData.response;
            } else if (responseData.message && responseData.message !== "Workflow was started") {
              assistantResponse = responseData.message;
            } else if (responseData.data) {
              assistantResponse = typeof responseData.data === 'string' ? responseData.data : JSON.stringify(responseData.data);
            } else if (responseData.result) {
              assistantResponse = typeof responseData.result === 'string' ? responseData.result : JSON.stringify(responseData.result);
            } else {
              assistantResponse = "I received your message and I'm processing it. Please wait up to 70 seconds for the response.";
            }
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            console.log("Response text that failed to parse:", responseText);
            
            // Handle plain text responses
            if (responseText.toLowerCase().includes('data has been added successfully') || 
                responseText.toLowerCase().includes('data has been succesfully added')) {
              assistantResponse = "Your data has been successfully added!";
            } else {
              // Return the plain text response directly
              assistantResponse = responseText;
            }
          }
        }
        
        // Add assistant response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: assistantResponse,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        toast({
          title: "Message sent",
          description: "Your message was sent successfully!",
        });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending message to n8n:", error);
      
      if (error.name === 'AbortError') {
        toast({
          title: "Timeout",
          description: "Request timed out after 70 seconds. Please try again.",
          variant: "destructive",
        });
        
        const timeoutMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "The request timed out. The n8n workflow might need more time to process. Please try again.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, timeoutMessage]);
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        
        // Add error message from assistant
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I'm having trouble connecting right now. Please try again.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Avatar className="w-10 h-10 border-2 border-blue-200">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
              FP
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-gray-800">Finance Assistant</h1>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end space-x-2 max-w-xs ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {!message.isUser && (
                  <Avatar className="w-8 h-8 border border-blue-200">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs">
                      FP
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <Card className={`border-none shadow-md ${
                  message.isUser 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-white/80 backdrop-blur-sm'
                }`}>
                  <CardContent className="p-3">
                    <p className={`text-sm ${message.isUser ? 'text-white' : 'text-gray-800'}`}>
                      {message.content}
                    </p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </CardContent>
                </Card>

                {message.isUser && (
                  <Avatar className="w-8 h-8 border border-blue-200">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gray-400 text-white text-xs">
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2 max-w-xs">
                <Avatar className="w-8 h-8 border border-blue-200">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs">
                    FP
                  </AvatarFallback>
                </Avatar>
                <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center space-x-3">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            className={`rounded-full ${isRecording ? 'animate-pulse' : ''}`}
          >
            <Mic className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your finances..."
              className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-8 h-8"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
