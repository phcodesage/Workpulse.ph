import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Message } from '../types';
import { messagesAPI } from '../lib/api';

export interface MessageContextType {
  messages: Message[];
  loading: boolean;
  error: string | null;
  getConversation: (userId1: string, userId2: string) => Promise<Message[]>;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<void>;
  getUnreadCount: (userId: string) => Promise<number>;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getConversation = useCallback(async (userId1: string, userId2: string) => {
    try {
      setLoading(true);
      // Get conversation with the other user (not the current user)
      const otherUserId = userId1 === JSON.parse(localStorage.getItem('user') || '{}').id ? userId2 : userId1;
      const response = await messagesAPI.getConversation(otherUserId);
      return response.data;
    } catch (error: unknown) {
      let message = 'Failed to fetch conversation';
      if (typeof error === 'object' && error !== null) {
        const errAsAxiosLike = error as { response?: { data?: { error?: string } } };
        if (errAsAxiosLike.response?.data?.error) {
          message = errAsAxiosLike.response.data.error;
        } else if (error instanceof Error) {
          message = error.message;
        }
      } else if (typeof error === 'string') {
        message = error;
      }
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all messages for the current user
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        // Use the getAllMessages endpoint to get all conversations for the current user
        const response = await messagesAPI.getAllMessages();
        setMessages(response.data || []);
      }
    } catch (error: unknown) {
      let message = 'Failed to fetch messages';
      if (typeof error === 'object' && error !== null) {
        const errAsAxiosLike = error as { response?: { data?: { error?: string } } };
        if (errAsAxiosLike.response?.data?.error) {
          message = errAsAxiosLike.response.data.error;
        } else if (error instanceof Error) {
          message = error.message;
        }
      } else if (typeof error === 'string') {
        message = error;
      }
      setError(message);
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (senderId: string, receiverId: string, content: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const messageData = {
        senderId,
        receiverId,
        content
      };
      
      await messagesAPI.sendMessage(messageData);
      
      // Refresh messages
      fetchMessages();
      
      return true;
    } catch (error: unknown) {
      let message = 'Failed to send message. Please try again.';
      if (typeof error === 'object' && error !== null) {
        const errAsAxiosLike = error as { response?: { data?: { error?: string } } };
        if (errAsAxiosLike.response?.data?.error) {
          message = errAsAxiosLike.response.data.error;
        } else if (error instanceof Error) {
          message = error.message;
        }
      } else if (typeof error === 'string') {
        message = error;
      }
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchMessages]);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      setLoading(true);
      // In a real implementation, we would have an API endpoint for this
      // For now, we'll update the local state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error: unknown) {
      let message = 'Failed to mark message as read';
      if (typeof error === 'object' && error !== null) {
        const errAsAxiosLike = error as { response?: { data?: { error?: string } } };
        if (errAsAxiosLike.response?.data?.error) {
          message = errAsAxiosLike.response.data.error;
        } else if (error instanceof Error) {
          message = error.message;
        }
      } else if (typeof error === 'string') {
        message = error;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUnreadCount = useCallback(async (userId: string) => {
    try {
      const response = await messagesAPI.getUnreadCount();
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      // Fallback to client-side counting if API fails
      return messages.filter(msg => msg.receiverId === userId && !msg.read).length;
    }
  }, [messages]);

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

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