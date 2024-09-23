'use client';

import { useState } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (message: string) => {
    const newMessage: Message = { role: 'user', content: message };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, newMessage] }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the tutor');
      }

      const data = await response.json();
      const assistantResponse: Message = {
        role: 'assistant',
        content: data.content,
      };

      setMessages((prevMessages) => [...prevMessages, assistantResponse]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md">
      <div className="h-[500px] overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
}