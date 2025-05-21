'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Notification {
  id: string;
  type: 'view' | 'like' | 'comment' | 'contact_request';
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
}

export default function NotificationList({ notifications, onMarkAllRead }: NotificationListProps) {
  if (!notifications) {
    return (
      <div className="text-center py-4 text-gray-500">
        No notifications to display
      </div>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'view':
        return (
          <div className="rounded-full bg-blue-100 p-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        );
      case 'like':
        return (
          <div className="rounded-full bg-red-100 p-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="rounded-full bg-green-100 p-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        );
      case 'contact_request':
        return (
          <div className="rounded-full bg-purple-100 p-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
        );
      default:
        return (
          <div className="rounded-full bg-gray-100 p-2 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        );
    }
  };

  return (
    <div>

      {notifications.length > 0 && (
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkAllRead}
            className="text-xs"
          >
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start p-3 rounded-lg ${notification.isRead ? 'bg-white' : 'bg-blue-50'}`}
          >
            {getNotificationIcon(notification.type)}
            <div className="ml-3 flex-1">
              <p className={`text-sm ${notification.isRead ? 'text-gray-700' : 'font-medium text-gray-900'}`}>
                {notification.content}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(notification.createdAt)}
              </p>
            </div>
            {!notification.isRead && (
              <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
