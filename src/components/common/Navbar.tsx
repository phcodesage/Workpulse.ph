import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase as BriefcaseBusiness, PanelTop, User, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMessages } from '../../context/MessageContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { getUnreadCount } = useMessages();
  const navigate = useNavigate();
  
  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BriefcaseBusiness className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">WorkPulse</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <PanelTop className="h-5 w-5 mr-1" />
                    <span>Dashboard</span>
                  </div>
                </Link>
                
                <Link 
                  to="/messages" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors relative"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-1" />
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
                
                <Link 
                  to="/profile" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-1" />
                    <span>Profile</span>
                  </div>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-1" />
                    <span>Logout</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;