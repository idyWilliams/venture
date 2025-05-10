"use client";

import { DealRoomActivity as ActivityType } from '@/lib/services/dealRoomService';
import { format, formatDistance } from 'date-fns';
import { MessageSquare, FileText, RotateCcw, AlertCircle, Users } from 'lucide-react';

interface DealRoomActivityProps {
  activities: ActivityType[];
}

export default function DealRoomActivity({ activities }: DealRoomActivityProps) {
  // Format timestamp to display in a readable format
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return timestamp;
    }
  };
  
  // Calculate the relative time (e.g., "2 hours ago")
  const getRelativeTime = (timestamp: string) => {
    try {
      return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };
  
  // Get the icon based on the activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'term_update':
        return <RotateCcw className="h-5 w-5 text-purple-500" />;
      case 'status_change':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'user_joined':
        return <Users className="h-5 w-5 text-indigo-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get activity description
  const getActivityDescription = (activity: ActivityType) => {
    const { type, userName, userRole, details } = activity;
    
    switch (type) {
      case 'message':
        return `${userName} (${userRole}) sent a message`;
      
      case 'document':
        if (details.action === 'uploaded') {
          return `${userName} (${userRole}) uploaded document: ${details.documentName}`;
        } else {
          return `${userName} (${userRole}) ${details.action} document: ${details.documentName}`;
        }
      
      case 'term_update':
        return `${userName} (${userRole}) updated the deal terms`;
      
      case 'status_change':
        return `${userName} (${userRole}) changed deal status from "${details.previousStatus}" to "${details.newStatus}"`;
      
      case 'user_joined':
        if (details.message) {
          return details.message;
        }
        return `${userName} joined the deal room`;
      
      default:
        return `${userName} performed an action`;
    }
  };
  
  // Group activities by date
  const groupActivitiesByDate = () => {
    const grouped: Record<string, ActivityType[]> = {};
    
    activities.forEach(activity => {
      try {
        const date = format(new Date(activity.timestamp), 'yyyy-MM-dd');
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(activity);
      } catch (error) {
        const date = 'Unknown Date';
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(activity);
      }
    });
    
    // Sort dates in descending order (most recent first)
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => {
        if (dateA === 'Unknown Date') return 1;
        if (dateB === 'Unknown Date') return -1;
        return dateB.localeCompare(dateA);
      })
      .map(([date, acts]) => ({
        date,
        activities: acts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      }));
  };
  
  const groupedActivities = groupActivitiesByDate();
  
  // Format the date header
  const formatDateHeader = (dateStr: string) => {
    if (dateStr === 'Unknown Date') return 'Unknown Date';
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
      
      if (dateStr === today) {
        return 'Today';
      } else if (dateStr === yesterday) {
        return 'Yesterday';
      } else {
        return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
      }
    } catch (error) {
      return dateStr;
    }
  };
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-10">
        <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No activity recorded yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {groupedActivities.map(({ date, activities }) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-gray-500 mb-4 sticky top-0 bg-white py-2">
            {formatDateHeader(date)}
          </h3>
          
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-start space-x-3 border-l-2 border-gray-200 pl-4 pb-1"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-grow">
                  <p className="text-gray-800">
                    {getActivityDescription(activity)}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>{formatTimestamp(activity.timestamp)}</span>
                    <span className="mx-1">•</span>
                    <span>{getRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}