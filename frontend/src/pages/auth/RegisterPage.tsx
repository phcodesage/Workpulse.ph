import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

import RegisterForm from '../../components/auth/RegisterForm';
import { useAuth } from '../../context/useAuth';

const RegisterPage: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;