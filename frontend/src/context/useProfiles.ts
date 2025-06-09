import { useContext } from 'react';
import { ProfileContext, ProfileContextType } from './ProfileContext';

export const useProfiles = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
};
