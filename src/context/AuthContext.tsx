import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { users, employers, jobSeekers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'employer' | 'jobseeker') => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        setCurrentUser(userObj);
      } catch (err) {
        console.error('Error parsing stored user', err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // For this MVP, we're simulating with a timeout and mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in real app, would validate password too)
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        setError('Invalid email or password');
        return false;
      }
      
      // Set the current user
      setCurrentUser(user);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      
      return true;
    } catch (err) {
      setError('Login failed. Please try again.');
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
      
      // In a real app, this would be an API call
      // For this MVP, we're simulating with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is already in use
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        setError('Email is already in use');
        return false;
      }
      
      // Create a new user (in a real app, would save to database)
      const newUser: User = {
        id: `${users.length + 1}`,
        name,
        email,
        role,
        createdAt: new Date()
      };
      
      // Set the current user
      setCurrentUser(newUser);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
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