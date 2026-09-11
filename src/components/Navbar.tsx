import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Info, 
  Mail, 
  User, 
  ArrowLeft,
  Bot,
  Users,
  Bell
} from 'lucide-react';
import { ActivePage, CommunityNotification } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { NotificationDropdown } from './community/NotificationDropdown';
import { communityService } from '../services/communityService';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  hasActiveAnalysis: boolean;
  onResetAnalysis?: () => void;
  historyCount: number;
  user: { email: string; name: string } | null;
  onOpenAuth: () => void;
  onOpenChat?: () => void;
  isChatOpen?: boolean;
  onSelectCommunityPost?: (postId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  hasActiveAnalysis,
  onResetAnalysis,
  historyCount,
  user,
  onOpenAuth,
  onOpenChat,
  isChatOpen,
  onSelectCommunityPost
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const userId = user ? user.email : 'guest-user';

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadNotifications = () => {
    const list = communityService.getNotifications(userId);
    setNotifications(list);
    setUnreadCount(communityService.getUnreadNotificationCount(userId));
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isNotificationOpen]);

  const handleMarkAsRead = (id: string) => {
    communityService.markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    communityService.markAllNotificationsAsRead(userId);
    loadNotifications();
  };

  const handleSelectNotification = (postId: string) => {
    setActivePage('community');
    if (onSelectCommunityPost) {
      onSelectCommunityPost(postId);
    }
  };
  return (
    <header className="sticky top-0 z-40 w-full h-[60px] border-b border-[#2a2e35] bg-[#181b1f]/95 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          <button
            id="nav-brand-btn"
            onClick={() => {
              setActivePage('home');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="ClearClause Logo"
              className="w-7 h-7 rounded-md object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-['Space_Grotesk']">
                ClearClause
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-[#121417] text-[#94a3b8] border border-[#2a2e35]">
                AI Legal
              </span>
            </div>
          </button>

          {/* If inside an active analysis on home page, show quick "New Analysis" link */}
          {hasActiveAnalysis && activePage === 'home' && onResetAnalysis && (
            <button
              id="nav-new-analysis-btn"
              onClick={onResetAnalysis}
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#94a3b8] hover:text-white px-2.5 py-1 rounded-md bg-[#121417] border border-[#2a2e35] hover:border-slate-600 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>New Analysis</span>
            </button>
          )}
        </div>

        {/* Center/Right Nav Links */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            id="nav-analysis-btn"
            onClick={() => setActivePage('home')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'home'
                ? 'text-[#3b82f6] font-semibold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Analysis
          </button>

          <button
            id="nav-history-btn"
            onClick={() => setActivePage('history')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'history'
                ? 'text-[#3b82f6] font-semibold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-semibold rounded-full bg-[#121417] text-[#3b82f6] border border-[#2a2e35]">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="nav-community-btn"
            onClick={() => setActivePage('community')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'community'
                ? 'text-[#3b82f6] font-semibold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            <Users className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Community</span>
          </button>

          <button
            id="nav-about-btn"
            onClick={() => setActivePage('about')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'about'
                ? 'text-[#3b82f6] font-semibold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            About
          </button>

          <button
            id="nav-contact-btn"
            onClick={() => setActivePage('contact')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'contact'
                ? 'text-[#3b82f6] font-semibold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Contact
          </button>

          <button
            id="nav-settings-btn"
            onClick={() => setActivePage('settings')}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activePage === 'settings'
                ? 'text-[#3b82f6] font-semibold'
                : 'text-[#94a3b8] hover:text-[#f1f5f9]'
            }`}
          >
            Settings
          </button>

          {/* Clear Clause AI Chat Trigger */}
          {onOpenChat && (
            <button
              id="nav-chat-btn"
              onClick={onOpenChat}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition shadow-sm cursor-pointer ${
                isChatOpen
                  ? 'bg-[#1677FF] text-white'
                  : 'bg-[#081426] text-[#2F8CFF] border border-[#172B46] hover:border-[#1677FF] hover:bg-[#0B1F3A]'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Clause AI</span>
              <span className="sm:hidden">AI Chat</span>
            </button>
          )}

          {/* Community Notification Bell Trigger (#15) */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              id="nav-notification-bell-btn"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181b1f] border border-transparent hover:border-[#2a2e35] transition cursor-pointer"
              title="Community Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onSelectNotification={handleSelectNotification}
            />
          </div>

          {/* Theme Mode Toggle (☀️ Light | 🌙 Dark) */}
          <div className="ml-1 sm:ml-2 pl-2 border-l border-[#2a2e35] flex items-center">
            <ThemeToggle />
          </div>

          {/* User Auth or Profile Button */}
          <div className="ml-1 sm:ml-2 pl-2 border-l border-[#2a2e35] flex items-center">
            {user ? (
              <button
                id="nav-profile-btn"
                onClick={() => setActivePage('settings')}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#f1f5f9] bg-[#121417] hover:bg-[#1c1f26] border border-[#2a2e35] rounded-full transition cursor-pointer"
                title={user.email}
              >
                <div className="w-5 h-5 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-[10px] font-bold uppercase">
                  {user.name ? user.name[0] : user.email[0]}
                </div>
                <span className="hidden md:inline max-w-[110px] truncate text-[#94a3b8]">
                  {user.name || user.email.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-lg transition shadow-sm cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
};
