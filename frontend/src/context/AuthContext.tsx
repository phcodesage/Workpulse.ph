import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../lib/api';

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'employer' | 'jobseeker') => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // Check if token exists
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Fetch current user data
          const response = await authAPI.getMe();
          console.log('AuthContext: response from authAPI.getMe():', response);
          console.log('AuthContext: response.data from authAPI.getMe():', response.data);
          setCurrentUser(response.data);
        } catch (err) {
          // If token is invalid, clear localStorage
          console.error('Error fetching user data:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
        };

    fetchUser();
  }, []);

  // This useEffect will log currentUser whenever it changes
  useEffect(() => {
    console.log('AuthContext: currentUser updated:', currentUser);
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the login API
      const response = await authAPI.login(email, password);
      
      // Set the current user
      setCurrentUser(response.user);
      
      // Save token and user to localStorage for persistence
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return true;
    } catch (e) {
      let errorMessage = 'Login failed. Please try again.';
      if (typeof e === 'object' && e !== null && 'response' in e) {
        const errResponse = (e as { response?: { data?: { error?: string } } }).response;
        if (errResponse && typeof errResponse === 'object' && 'data' in errResponse) {
          const errData = errResponse.data;
          if (errData && typeof errData === 'object' && 'error' in errData && typeof errData.error === 'string') {
            errorMessage = errData.error;
          }
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'employer' | 'jobseeker'
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the register API
      const response = await authAPI.register(name, email, password, role);
      
      // Set the current user
      setCurrentUser(response.user);
      
      // Save token and user to localStorage for persistence
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return true;
    } catch (e) {
      let errorMessage = 'Registration failed. Please try again.';
      if (typeof e === 'object' && e !== null && 'response' in e) {
        const errResponse = (e as { response?: { data?: { error?: string } } }).response;
        if (errResponse && typeof errResponse === 'object' && 'data' in errResponse) {
          const errData = errResponse.data;
          if (errData && typeof errData === 'object' && 'error' in errData && typeof errData.error === 'string') {
            errorMessage = errData.error;
          }
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};