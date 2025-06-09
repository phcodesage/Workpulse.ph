import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Button from '../common/Button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {(formError || error) && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {formError || error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            Sign in
          </Button>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-600">
            For demo purposes, use: john@techcorp.com (employer) or sarah@webexpert.com (job seeker)
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;