import { Bell, CheckCheck, ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvidence } from '../hooks/useEvidence';
import SearchBar from './SearchBar';

export default function Navbar({ onOpenMobileMenu }) {
  const { user, logout } = useAuth();
  const { notifications, markAllNotificationsRead } = useEvidence();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    toast.success('Signed out of ForenSIQ');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-[#E5E7F0] px-4 sm:px-6 flex items-center justify-between gap-4 no-print">
      {/* Left: Mobile Menu Button + Global Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0 max-w-xl">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl border border-[#E5E7F0] text-[#172554] hover:bg-[#F5F6FC] shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <SearchBar placeholder="Search cases, evidence, people..." />
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
            aria-label="Toggle notifications"
            className="relative w-10 h-10 rounded-xl border border-[#E5E7F0] bg-white hover:bg-[#F5F6FC] flex items-center justify-center text-[#64748B] hover:text-[#172554] transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#7656E8] text-white text-[10px] font-semibold flex items-center justify-center tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E7F0] rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E5E7F0] flex items-center justify-between">
                <span className="text-sm font-semibold text-[#172554]">Notifications</span>
                <button
                  type="button"
                  onClick={() => {
                    markAllNotificationsRead();
                    toast.success('All notifications marked as read');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#7656E8] hover:text-[#5d3fd3]"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              </div>
              <ul className="divide-y divide-[#E5E7F0] max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <li
                    key={item.id}
                    className={`px-4 py-3 transition-colors ${
                      item.read ? 'bg-white' : 'bg-[#F5F6FC]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-[#172554]">{item.title}</p>
                      <span className="text-[11px] text-[#64748B] whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#64748B] leading-relaxed">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
            aria-label="Open profile menu"
            className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-xl border border-[#E5E7F0] bg-white hover:bg-[#F5F6FC] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7656E8] to-[#367FEA] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {user.initials || 'AC'}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-sm font-semibold text-[#172554] whitespace-nowrap">
                {user.name}
              </div>
              <div className="text-[11px] text-[#64748B] whitespace-nowrap">Investigator</div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-[#E5E7F0] rounded-2xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E5E7F0]">
                <p className="text-sm font-semibold text-[#172554]">{user.name}</p>
                <p className="text-xs text-[#64748B] truncate">{user.email}</p>
              </div>
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#172554] hover:bg-[#F5F6FC] transition-colors text-left"
                >
                  <User className="w-4 h-4 text-[#7656E8]" />
                  <span>Profile &amp; Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#172554] hover:bg-[#F5F6FC] transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-[#367FEA]" />
                  <span>Preferences</span>
                </button>
                <div className="my-1 border-t border-[#E5E7F0]" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

