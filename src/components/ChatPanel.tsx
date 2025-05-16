
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Mentor } from "@/types";

interface Message {
  id: string;
  sender: string;
  timestamp: string;
  content: string;
}

interface ChatPanelProps {
  mentor: Mentor;
  mentorView?: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ mentor, mentorView = false }) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: mentorView ? "Admin" : mentor.name,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      content: "Hello there! I had a question about my recent payout.",
    },
    {
      id: "2",
      sender: mentorView ? "You" : "Admin",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      content: "Hi! Sure, what would you like to know?",
    },
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender: mentorView ? "You" : "Admin",
      timestamp: new Date().toISOString(),
      content: message,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    
    toast({
      title: "Message sent",
      description: `Message sent to ${mentorView ? "Admin" : mentor.name}`,
    });

    // Simulate a reply after a delay
    setTimeout(() => {
      const autoReply: Message = {
        id: crypto.randomUUID(),
        sender: mentorView ? "Admin" : mentor.name,
        timestamp: new Date().toISOString(),
        content: "Thank you for your message! I'll look into this and get back to you soon.",
      };
      setMessages(prev => [...prev, autoReply]);
    }, 3000);
  };

  return (
    <div className="flex h-[500px] flex-col rounded-md border">
      <div className="border-b p-3">
        <h3 className="font-medium">
          {mentorView ? "Chat with Admin" : `Chat with ${mentor.name}`}
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 max-w-[80%] rounded-lg p-3 ${
              msg.sender === (mentorView ? "You" : "Admin")
                ? "ml-auto bg-primary text-primary-foreground"
                : "mr-auto bg-muted"
            }`}
          >
            <div className="mb-1 flex justify-between text-xs">
              <span>{msg.sender}</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      
      <div className="border-t p-3">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};
