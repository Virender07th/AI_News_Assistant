// Header.jsx - Fixed version
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, LogOut, User } from "lucide-react";
import avatar from "../../assets/bg1.jpg";
import ConfirmationModal from "../Resusable/ConfirmationModal";
import { useDispatch } from "react-redux";
import { logout } from "../../Service/Operations/AuthAPI";

export const headerData = [
  {
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Latest News", path: "/latest" },
      { label: "All News", path: "/all-news" },
    ],
  },
  {
    items: [
      { label: "AI Journalist Agents", path: "/ai-journalist" },
      { label: "AI News Anchor", path: "/news-anchor" },
    ],
  },
  {
    items: [
      { label: "Profile", path: "/profile" },
      { label: "Logout", path: "/logout" },
    ],
  },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout(navigate));
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI News Assistant
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[...headerData[0].items, ...headerData[1].items].map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  }`
                }
              >
                {item.label}
                {/* Active indicator */}
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-200 ${
                  location.pathname === item.path ? 'bg-blue-600' : 'bg-transparent'
                }`} />
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <button 
              className="relative flex items-center justify-center w-10 h-10 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <img
                  src={avatar}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                />
                <ChevronDown
                  className={`hidden sm:block text-gray-500 transition-transform duration-200 ${
                    showProfileDropdown ? 'rotate-180' : ''
                  }`}
                  size={16}
                />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50">
                  {/* User Info */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">Harsh Singh</p>
                    <p className="text-sm text-gray-500 truncate">harsh@example.com</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-1">
                    {headerData[2].items.map((item) =>
                      item.label === "Logout" ? (
                        <button
                          key={item.label}
                          onClick={() => {
                            setShowModal(true);
                            setShowProfileDropdown(false);
                          }}
                          className="group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {item.label}
                        </button>
                      ) : (
                        <NavLink
                          key={item.label}
                          to={item.path}
                          onClick={() => setShowProfileDropdown(false)}
                          className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
                        >
                          <User className="mr-3 h-4 w-4" />
                          {item.label}
                        </NavLink>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ease-in-out opacity-100 visibility-visible transform translate-y-0">
            <nav className="px-4 py-4 space-y-2">
              {[...headerData[0].items, ...headerData[1].items].map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex m-90 items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
          <ConfirmationModal
            title="Are you sure you want to logout?"
            subtitle="You will be redirected to the home page."
            btnContent1="Cancel"
            btnContent2="Logout"
            onCancel={() => setShowModal(false)}
            onConfirm={handleLogout}
          />
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;