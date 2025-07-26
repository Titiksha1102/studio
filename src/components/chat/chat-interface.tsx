"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'agent';
};

export function ChatInterface() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.crypto) {
        setSessionId(crypto.randomUUID());
    }
    setMessages([
      { id: 'initial-message', text: "Hello! I'm your assistant. How can I help you today?", sender: 'agent' }
    ]);
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // TODO: Replace this with your custom backend call
    try {
      // const response = await fetch('YOUR_BACKEND_ENDPOINT', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: currentInput, sessionId }),
      // });
      // if (!response.ok) throw new Error('Network response was not ok');
      // const data = await response.json();
      // const agentMessage: Message = {
      //   id: crypto.randomUUID(),
      //   text: data.reply, // Make sure your backend response has a 'reply' field
      //   sender: 'agent',
      // };
      // setMessages((prev) => [...prev, agentMessage]);
      
      // Simulating backend response for this frontend prototype
      setTimeout(() => {
        const agentResponse: Message = {
          id: crypto.randomUUID(),
          text: `This is a simulated response to: "${currentInput}"`,
          sender: 'agent',
        };
        setMessages((prev) => [...prev, agentResponse]);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'agent',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground max-w-md mx-auto border-x border-border/20 shadow-2xl">
      <header className="p-4 border-b border-border/20 shadow-sm bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center font-headline flex items-center justify-center gap-2">
          <Bot className="text-primary" />
          Chat
        </h1>
      </header>
      
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-3 w-full ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'agent' && (
                <Avatar className="h-8 w-8 bg-secondary">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="text-secondary-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 shadow-md font-body text-sm ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-secondary">
                <AvatarFallback className="bg-transparent">
                    <Bot className="text-secondary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-secondary rounded-2xl p-3 shadow-md rounded-bl-none">
                <div className="flex items-center justify-center space-x-1.5">
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <footer className="p-4 border-t border-border/20 bg-background/80 backdrop-blur-sm sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-input border-border/50 focus:ring-primary h-11 rounded-full px-5"
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} className="rounded-full flex-shrink-0 h-11 w-11">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
