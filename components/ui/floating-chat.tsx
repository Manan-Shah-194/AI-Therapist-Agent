"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { MessageCircle, Send, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  // Create a chat session when component mounts
  useEffect(() => {
    if (session?.user?.id && isOpen && !sessionId) {
      createChatSession();
    }
  }, [session, isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createChatSession = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chat/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat session");
      }

      const data = await response.json();
      setSessionId(data.sessionId);
      
      // Add welcome message
      setMessages([
        {
          role: "assistant",
          content: "Hi there! I'm Aura, your AI therapist. How are you feeling today?",
        },
      ]);
    } catch (error) {
      console.error("Error creating chat session:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !sessionId || !session?.user?.id) return;

    const userMessage = message;
    setMessage("");
    
    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/chat/${sessionId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            userId: session.user.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      
      // Add AI response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleFullChat = () => {
    router.push('/chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 sm:w-96 h-96 flex flex-col shadow-lg border border-primary/20">
          <div className="flex items-center justify-between bg-primary/10 p-3 border-b border-primary/20">
            <h3 className="font-semibold text-primary">Chat with Aura</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleFullChat}
                className="h-8 w-8 p-0"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleChat}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary/20 ml-auto"
                    : "bg-secondary/20"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-secondary/20 max-w-[80%] p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-primary/20">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 resize-none border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                disabled={isLoading || !message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}