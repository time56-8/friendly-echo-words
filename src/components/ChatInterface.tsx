
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  sender: "admin" | "mentor";
  content: string;
  timestamp: string;
  read: boolean;
}

interface ChatInterfaceProps {
  adminMode?: boolean;
  mentorName?: string;
  adminName?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  adminMode = false,
  mentorName = "Jane Doe",
  adminName = "Admin User" 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "admin",
      content: "Hello! How can I help you today?",
      timestamp: new Date(2025, 4, 15, 9, 30).toISOString(),
      read: true,
    },
    {
      id: "2",
      sender: "mentor",
      content: "Hi, I had a question about my latest payout. The amount seems lower than expected.",
      timestamp: new Date(2025, 4, 15, 9, 32).toISOString(),
      read: true,
    },
    {
      id: "3",
      sender: "admin",
      content: "I'll look into that for you. Can you specify which receipt you're referring to?",
      timestamp: new Date(2025, 4, 15, 9, 35).toISOString(),
      read: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: crypto.randomUUID(),
      sender: adminMode ? "admin" : "mentor",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate reply in 1 second
    setTimeout(() => {
      const replyMessage: Message = {
        id: crypto.randomUUID(),
        sender: adminMode ? "mentor" : "admin",
        content: "Thanks for your message. I'll get back to you shortly.",
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="text-xl">
          {adminMode ? `Chat with ${mentorName}` : `Chat with Support`}
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = 
              (adminMode && message.sender === "admin") || 
              (!adminMode && message.sender === "mentor");
              
            return (
              <div 
                key={message.id}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.sender === "admin" ? adminName.charAt(0) : mentorName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div 
                      className={`max-w-sm rounded-lg p-3 ${
                        isCurrentUser 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
