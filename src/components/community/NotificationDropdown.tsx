import React from 'react';
import { 
  Bell, 
  Check, 
  MessageSquare, 
  Reply, 
  CheckCircle2, 
  Pin, 
  ShieldAlert, 
  X 
} from 'lucide-react';
import { CommunityNotification } from '../../types';
import { formatTimeAgo } from '../../utils/timeAgo';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CommunityNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectNotification: (postId: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  const getIcon = (type: CommunityNotification['type']) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
      case 'reply':
        return <Reply className="w-3.5 h-3.5 text-indigo-400" />;
      case 'best_answer':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'pinned':
        return <Pin className="w-3.5 h-3.5 text-amber-400" />;
      case 'report_reviewed':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div 
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-[#1c1f26] border border-[#2a2e35] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 text-left"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-3.5 px-4 bg-[#14171c] border-b border-[#2a2e35] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#3b82f6]" />
          <span className="text-xs font-semibold text-white">Community Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
          >
            Mark all read
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#252a33] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#2a2e35]/60">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No notifications right now.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onMarkAsRead(n.id);
                onSelectNotification(n.postId);
                onClose();
              }}
              className={`p-3.5 flex items-start gap-3 hover:bg-[#252a33] transition cursor-pointer text-xs ${
                !n.read ? 'bg-blue-500/5' : ''
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#14171c] border border-[#2a2e35] flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between gap-1">
                  <p className="font-semibold text-white truncate">{n.title}</p>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                </div>
                <p className="text-slate-300 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {formatTimeAgo(n.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
