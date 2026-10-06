import React from 'react';
import { HiOutlineBell, HiX } from 'react-icons/hi';
import {
  AiOutlineMessage,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineUserAdd,
} from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';

// Helper: convert "2025-07-30 10:42:19" → relative time
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Just now";
  const now = new Date();
  const then = new Date(timestamp.replace(" ", "T"));
  const seconds = Math.floor((now - then) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (seconds < 60) return rtf.format(-seconds, 'second');
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), 'minute');
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), 'hour');
  return rtf.format(-Math.floor(seconds / 86400), 'day');
};

// Map type → icon with enhanced styling
const getIcon = (type, iconObj) => {
  if (iconObj?.url) {
    return (
      <div
        className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm"
        style={{
          backgroundColor: iconObj.background_color || "#F3F4F6",
        }}
      >
        <img src={iconObj.url} alt="icon" className="w-6 h-6" />
      </div>
    );
  }

  const iconConfig = {
    'message': { icon: AiOutlineMessage, bg: 'bg-blue-50', color: 'text-blue-600' },
    'success': { icon: AiOutlineCheckCircle, bg: 'bg-green-50', color: 'text-green-600' },
    'warning': { icon: AiOutlineWarning, bg: 'bg-yellow-50', color: 'text-yellow-600' },
    'lead.created': { icon: AiOutlineUserAdd, bg: 'bg-purple-50', color: 'text-purple-600' },
    'default': { icon: HiOutlineBell, bg: 'bg-gray-50', color: 'text-gray-600' }
  };

  const config = iconConfig[type] || iconConfig['default'];
  const IconComponent = config.icon;

  return (
    <div className={`w-10 h-10 flex items-center justify-center rounded-full ${config.bg}`}>
      <IconComponent className={`${config.color} text-xl`} />
    </div>
  );
};

const NotificationPanel = ({ notifications, isOpen, onClose, onMarkRead }) => {
  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border ring-2  border-accent"
          >
            {/* Header */}
            <div className="px-6 py-4 border-blue-700 ring-2 bg-gradient-to-r from-blue-700 to-accent text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiOutlineBell className="text-2xl" />
                  <h2 className="text-lg font-bold">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2.5 py-0.5 bg-white text-blue-700 text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="cursor-pointer p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <HiX className="text-xl" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
              {(!notifications || notifications.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <HiOutlineBell className="text-3xl text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No notifications yet</p>
                  <p className="text-gray-400 text-sm mt-1">We'll notify you when something arrives</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((note, index) => (
                    <motion.div
                      key={note.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer group ${!note.is_read ? 'bg-blue-50/30' : ''
                        }`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(note.type, note.icon)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 leading-snug">
                            {note.title}
                          </p>
                          {!note.is_read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5"></span>
                          )}
                        </div>

                        {note.body && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {note.body}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500 font-medium">
                            {note.timestamp ? formatRelativeTime(note.timestamp) : "Just now"}
                          </p>

                          {!note.is_read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkRead(note.id);
                              }}
                              className="text-xs text-blue-600 font-medium hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications && notifications.length > 0 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <button className="w-full text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;