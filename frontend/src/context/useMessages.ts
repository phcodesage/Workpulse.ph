import { useContext } from 'react';
import { MessageContext, MessageContextType } from './MessageContext';

export const useMessages = (): MessageContextType => {
  const context = useContext<MessageContextType | undefined>(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
