import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message } from '../types';
import { messages as mockMessages } from '../data/mockData';

interface MessageContextType {
  messages: Message[];
  loading: boolean;
  error: string | null;
  getConversation: (userId1: string, userId2: string) => Message[];
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<boolean>;
  markAsRead: (messageId: string) => void;
  getUnreadCount: (userId: string) => number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConversation = (userId1: string, userId2: string) => {
    return messages.filter(
      msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) || 
        (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const sendMessage = async (senderId: string, receiverId: string, content: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMessage: Message = {
        id: String(Date.now()),
        senderId,
        receiverId,
        content,
        read: false,
        createdAt: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      return true;
    } catch (err) {
      setError('Failed to send message. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const getUnreadCount = (userId: string) => {
    return messages.filter(msg => msg.receiverId === userId && !msg.read).length;
  };

  const value = {
    messages,
    loading,
    error,
    getConversation,
    sendMessage,
    markAsRead,
    getUnreadCount
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};