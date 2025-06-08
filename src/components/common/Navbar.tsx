import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase as BriefcaseBusiness,
  PanelTop,
  User,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";

const Navbar: React.FC = () => {
  const menuItems = [
    {
      link: "/dashboard",
      icon: <PanelTop className="h-5 w-5 mr-1" />,
      label: "Dashboard",
      hasBadge: false,
    },
    {
      link: "/messages",
      icon: <MessageSquare className="h-5 w-5 mr-1" />,
      label: "Messages",
      hasBadge: true,
    },
    {
      link: "/profile",
      icon: <User className="h-5 w-5 mr-1" />,
      label: "Profile",
      hasBadge: false,
    },
  ];
  const { currentUser, logout } = useAuth();
  const { getUnreadCount } = useMessages();
  const navigate = useNavigate();
  const unreadCount = currentUser ? getUnreadCount(currentUser.id) : 0;
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <BriefcaseBusiness className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                WorkPulse
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            {currentUser ? (
              <>
                {menuItems.map((data, key) => (
                  <Link
                    key={key}
                    to={data.link}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      {data.icon}
                      <span>{data.label}</span>
                      {data.hasBadge && unreadCount > 0 && (
                        <span className="-top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center relative">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
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
