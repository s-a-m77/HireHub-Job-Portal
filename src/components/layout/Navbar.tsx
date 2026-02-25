import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Briefcase,
  ChevronDown,
  Sun,
  Moon,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export function Navbar() {
  const {
    currentUser,
    currentPage,
    navigate,
    logout,
    theme,
    toggleTheme,
    getUnreadAdminMessagesCount,
    getUnreadStudentMessagesCount,
    getUnreadMessagesForAdminCount,
    getUnreadMessagesFromStudentCount,
  } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dk = theme === 'dark';

  const unreadAdminCount =
    currentUser?.role === 'employer' ? getUnreadAdminMessagesCount(currentUser.id) : 0;
  const unreadStudentCountForEmployer =
    currentUser?.role === 'employer' ? getUnreadMessagesFromStudentCount(currentUser.id) : 0;
  const unreadStudentCount =
    currentUser?.role === 'student' ? getUnreadStudentMessagesCount(currentUser.id) : 0;
  const unreadMessagesForAdmin =
    currentUser?.role === 'admin' ? getUnreadMessagesForAdminCount() : 0;
  const totalUnreadForEmployer = unreadAdminCount + unreadStudentCountForEmployer;

  const isActive = (page: string) => currentPage === page;
  const linkClass = (page: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(page)
        ? dk
          ? 'bg-indigo-900/50 text-indigo-300'
          : 'bg-indigo-100 text-indigo-700'
        : dk
        ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700'
        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
    }`;

  return (
    <nav
      className={`${
        dk ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-b sticky top-0 z-50 shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              HireHub
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!currentUser && (
              <>
                <button onClick={() => navigate('home')} className={linkClass('home')}>
                  Home
                </button>
                <button
                  onClick={() => navigate('browse-jobs')}
                  className={linkClass('browse-jobs')}
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => navigate('public-announcements')}
                  className={linkClass('public-announcements')}
                >
                  Announcements
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className={linkClass('contact')}
                >
                  Contact
                </button>
              </>
            )}

            {currentUser?.role === 'student' && (
              <>
                <button
                  onClick={() => navigate('student-dashboard')}
                  className={linkClass('student-dashboard')}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('browse-jobs')}
                  className={linkClass('browse-jobs')}
                >
                  Browse Jobs
                </button>
                <button
                  onClick={() => navigate('applied-jobs')}
                  className={linkClass('applied-jobs')}
                >
                  My Applications
                </button>
                <button
                  onClick={() => navigate('student-messages')}
                  className={linkClass('student-messages')}
                >
                  My Messages
                  {unreadStudentCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadStudentCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('browse-companies')}
                  className={linkClass('browse-companies')}
                >
                  Companies
                </button>
                <button
                  onClick={() => navigate('public-announcements')}
                  className={linkClass('public-announcements')}
                >
                  Announcements
                </button>
              </>
            )}

            {currentUser?.role === 'employer' && (
              <>
                <button
                  onClick={() => navigate('employer-dashboard')}
                  className={linkClass('employer-dashboard')}
                >
                  Dashboard
                </button>
                <button onClick={() => navigate('post-job')} className={linkClass('post-job')}>
                  Post Job
                </button>
                <button
                  onClick={() => navigate('manage-jobs')}
                  className={linkClass('manage-jobs')}
                >
                  My Jobs
                </button>
                <button
                  onClick={() => navigate('browse-companies')}
                  className={linkClass('browse-companies')}
                >
                  Companies
                </button>
                <button
                  onClick={() => navigate('public-announcements')}
                  className={linkClass('public-announcements')}
                >
                  Announcements
                </button>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
                      dk
                        ? 'text-gray-300 hover:text-indigo-400 hover:bg-gray-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }`}
                  >
                    More <ChevronDown className="w-3 h-3" />
                  </button>
                  {dropdownOpen && (
                    <div
                      className={`absolute right-0 mt-1 w-48 rounded-xl shadow-lg border py-1 z-50 ${
                        dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                      }`}
                    >
                      <button
                        onClick={() => {
                          navigate('find-talent');
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dk
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        Find Talent
                      </button>
                      <button
                        onClick={() => {
                          navigate('employer-branding');
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dk
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        Employer Branding
                      </button>
                      <button
                        onClick={() => {
                          navigate('campus-recruiting');
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dk
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        Campus Recruiting
                      </button>
                      <button
                        onClick={() => {
                          navigate('pricing');
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dk
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        Pricing Plans
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('admin-dashboard')}
                  className={linkClass('admin-dashboard')}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('manage-students')}
                  className={linkClass('manage-students')}
                >
                  Students
                </button>
                <button
                  onClick={() => navigate('manage-employers')}
                  className={linkClass('manage-employers')}
                >
                  Employers
                </button>
                <button
                  onClick={() => navigate('manage-all-jobs')}
                  className={linkClass('manage-all-jobs')}
                >
                  All Jobs
                </button>
                <button
                  onClick={() => navigate('announcements')}
                  className={linkClass('announcements')}
                >
                  Announcements
                </button>
                <button
                  onClick={() => navigate('admin-messages')}
                  className={linkClass('admin-messages')}
                >
                  Messages
                  {unreadMessagesForAdmin > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadMessagesForAdmin}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate('admin-contact-inbox')}
                  className={linkClass('admin-contact-inbox')}
                >
                  Contact Inbox
                </button>
              </>
            )}
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all ${
                dk
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={dk ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dk ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications for Employer */}
            {currentUser?.role === 'employer' && (
              <button
                onClick={() => navigate('employer-messages')}
                className={`relative p-2 rounded-xl transition-all ${
                  dk
                    ? 'bg-gray-800 text-indigo-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Messages"
              >
                <Bell className="w-5 h-5" />
                {totalUnreadForEmployer > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {totalUnreadForEmployer}
                  </span>
                )}
              </button>
            )}

            {/* Notifications for Student */}
            {currentUser?.role === 'student' && (
              <button
                onClick={() => navigate('student-messages')}
                className={`relative p-2 rounded-xl transition-all ${
                  dk
                    ? 'bg-gray-800 text-indigo-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="My Messages"
              >
                <Bell className="w-5 h-5" />
                {unreadStudentCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadStudentCount}
                  </span>
                )}
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (currentUser.role === 'student') navigate('student-profile');
                    else if (currentUser.role === 'employer') navigate('employer-branding');
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    dk ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(currentUser.name || currentUser.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-sm font-medium ${dk ? 'text-gray-100' : 'text-gray-900'}`}
                    >
                      {currentUser.name || currentUser.email || 'User'}
                    </div>
                    <div className={`text-xs capitalize ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentUser.role}
                    </div>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('login')}
                  className={`px-4 py-2 text-sm font-medium ${
                    dk
                      ? 'text-gray-300 hover:text-indigo-400'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-200"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Right Side - Mobile */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition ${
                dk ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
              }`}
              title={dk ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dk ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications for Employer */}
            {currentUser?.role === 'employer' && (
              <button
                onClick={() => {
                  navigate('employer-messages');
                  setMobileOpen(false);
                }}
                className={`relative p-2 rounded-lg transition ${
                  dk
                    ? 'text-indigo-400 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Messages"
              >
                <Bell className="w-5 h-5" />
                {totalUnreadForEmployer > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {totalUnreadForEmployer}
                  </span>
                )}
              </button>
            )}

            {/* Notifications for Student */}
            {currentUser?.role === 'student' && (
              <button
                onClick={() => {
                  navigate('student-messages');
                  setMobileOpen(false);
                }}
                className={`relative p-2 rounded-lg transition ${
                  dk
                    ? 'text-indigo-400 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="My Messages"
              >
                <Bell className="w-5 h-5" />
                {unreadStudentCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadStudentCount}
                  </span>
                )}
              </button>
            )}

            {/* User Menu for Authenticated Users */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${
                    dk ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {(currentUser.name || currentUser.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div
                      className={`text-sm font-medium ${dk ? 'text-gray-100' : 'text-gray-900'}`}
                    >
                      {currentUser.name || currentUser.email || 'User'}
                    </div>
                    <div className={`text-xs capitalize ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentUser.role}
                    </div>
                  </div>
                </button>
                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-1 z-50 ${
                      dk ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                    }`}
                  >
                    {currentUser.role === 'student' && (
                      <button
                        onClick={() => {
                          navigate('student-profile');
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm ${
                          dk
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
                            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                        }`}
                      >
                        Profile
                      </button>
                    )}
                    {currentUser.role === 'employer' && (
                      <>
                        <button
                          onClick={() => {
                            navigate('employer-branding');
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            dk
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
                              : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                        >
                          Branding
                        </button>
                        <button
                          onClick={() => {
                            navigate('find-talent');
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            dk
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
                              : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                        >
                          Find Talent
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Auth buttons for non-authenticated users */}
            {!currentUser && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigate('login');
                    setMobileOpen(false);
                  }}
                  className={`px-3 py-1.5 text-sm font-medium ${
                    dk
                      ? 'text-gray-300 hover:text-indigo-400'
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('register');
                    setMobileOpen(false);
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-lg ${
                dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`md:hidden border-t py-3 px-4 space-y-1 ${
            dk ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'
          }`}
        >
          {!currentUser && (
            <>
              <button
                onClick={() => {
                  navigate('home');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate('browse-jobs');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Find Jobs
              </button>
              <button
                onClick={() => {
                  navigate('public-announcements');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Announcements
              </button>
              <button
                onClick={() => {
                  navigate('contact');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Contact
              </button>
              <div className={`pt-2 border-t mt-2 space-y-1 ${dk ? 'border-gray-700' : ''}`}>
                <button
                  onClick={() => {
                    navigate('login');
                    setMobileOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    dk ? 'text-indigo-400' : 'text-indigo-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('register');
                    setMobileOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600"
                >
                  Get Started
                </button>
              </div>
            </>
          )}
          {currentUser?.role === 'student' && (
            <>
              <button
                onClick={() => {
                  navigate('student-dashboard');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate('browse-jobs');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Browse Jobs
              </button>
              <button
                onClick={() => {
                  navigate('applied-jobs');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                My Applications
              </button>
              <button
                onClick={() => {
                  navigate('student-messages');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                My Messages
              </button>
              <button
                onClick={() => {
                  navigate('public-announcements');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Announcements
              </button>
              <button
                onClick={() => {
                  navigate('student-profile');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Profile
              </button>
            </>
          )}
          {currentUser?.role === 'employer' && (
            <>
              <button
                onClick={() => {
                  navigate('employer-dashboard');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate('post-job');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Post Job
              </button>
              <button
                onClick={() => {
                  navigate('manage-jobs');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                My Jobs
              </button>
              <button
                onClick={() => {
                  navigate('find-talent');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Find Talent
              </button>
              <button
                onClick={() => {
                  navigate('browse-companies');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Companies
              </button>
              <button
                onClick={() => {
                  navigate('employer-branding');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Branding
              </button>
              <button
                onClick={() => {
                  navigate('campus-recruiting');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Campus Recruiting
              </button>
              <button
                onClick={() => {
                  navigate('public-announcements');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Announcements
              </button>
              <button
                onClick={() => {
                  navigate('pricing');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Pricing
              </button>
            </>
          )}
          {currentUser?.role === 'admin' && (
            <>
              <button
                onClick={() => {
                  navigate('admin-dashboard');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate('manage-students');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => {
                  navigate('manage-employers');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Employers
              </button>
              <button
                onClick={() => {
                  navigate('manage-all-jobs');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => {
                  navigate('admin-messages');
                  setMobileOpen(false);
                }}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                <span>Messages</span>
                {unreadMessagesForAdmin > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadMessagesForAdmin}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  navigate('admin-contact-inbox');
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  dk ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-indigo-50'
                }`}
              >
                Contact Inbox
              </button>
            </>
          )}
          {currentUser && (
            <div className={`pt-2 border-t mt-2 ${dk ? 'border-gray-700' : ''}`}>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
