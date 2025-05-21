"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/src/contexts/UserRoleContext';
import { Button } from '@/components/ui/button';
import {
  Archive,
  Check,
  ChevronDown,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Phone,
  PlusCircle,
  Search,
  Trash2,
  Video,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for messages
const conversations = [
  {
    id: 'conv-1',
    participants: [
      { id: 'user-1', name: 'Jane Investor', avatar: 'JI', role: 'investor', company: 'VC Capital' },
      { id: 'user-2', name: 'John Smith', avatar: 'JS', role: 'founder', company: 'TechStartup X' }
    ],
    lastMessage: {
      id: 'msg-1',
      text: 'I\'ve reviewed your pitch deck and I\'m impressed with your traction. Would you be available for a call tomorrow to discuss potential investment?',
      sender: 'user-1',
      timestamp: '2024-05-08T15:30:00Z',
      read: true
    },
    unreadCount: 0,
    hasDealRoom: true,
    projectName: 'TechStartup X'
  },
  {
    id: 'conv-2',
    participants: [
      { id: 'user-3', name: 'Robert Angel', avatar: 'RA', role: 'investor', company: 'Angel Investments' },
      { id: 'user-2', name: 'John Smith', avatar: 'JS', role: 'founder', company: 'TechStartup X' }
    ],
    lastMessage: {
      id: 'msg-2',
      text: 'Your AI technology is quite interesting. Could you share more details about your proprietary algorithms?',
      sender: 'user-3',
      timestamp: '2024-05-07T11:45:00Z',
      read: false
    },
    unreadCount: 3,
    hasDealRoom: false,
    projectName: 'TechStartup X'
  },
  {
    id: 'conv-3',
    participants: [
      { id: 'user-4', name: 'Sarah Chen', avatar: 'SC', role: 'founder', company: 'FinanceAI' },
      { id: 'user-5', name: 'Michael Wong', avatar: 'MW', role: 'investor', company: 'Horizon Ventures' }
    ],
    lastMessage: {
      id: 'msg-3',
      text: 'Thanks for the detailed financials. Let\'s schedule a meeting next week with our investment committee.',
      sender: 'user-5',
      timestamp: '2024-05-06T09:15:00Z',
      read: true
    },
    unreadCount: 0,
    hasDealRoom: true,
    projectName: 'FinanceAI'
  },
  {
    id: 'conv-4',
    participants: [
      { id: 'user-6', name: 'David Thompson', avatar: 'DT', role: 'investor', company: 'Tech Ventures' },
      { id: 'user-2', name: 'John Smith', avatar: 'JS', role: 'founder', company: 'TechStartup X' }
    ],
    lastMessage: {
      id: 'msg-4',
      text: 'Your customer acquisition costs seem high. Do you have plans to optimize this in the near term?',
      sender: 'user-6',
      timestamp: '2024-05-05T14:20:00Z',
      read: true
    },
    unreadCount: 0,
    hasDealRoom: false,
    projectName: 'TechStartup X'
  },
  {
    id: 'conv-5',
    participants: [
      { id: 'user-7', name: 'Emma Johnson', avatar: 'EJ', role: 'founder', company: 'EcoSolutions' },
      { id: 'user-8', name: 'Alex Green', avatar: 'AG', role: 'investor', company: 'Climate Capital' }
    ],
    lastMessage: {
      id: 'msg-5',
      text: 'I\'ve shared our term sheet with you. Looking forward to your feedback.',
      sender: 'user-8',
      timestamp: '2024-05-04T16:40:00Z',
      read: false
    },
    unreadCount: 1,
    hasDealRoom: true,
    projectName: 'EcoSolutions'
  }
];

export default function MessagesPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Filter conversations based on user role
  const userId = role === 'founder' ? 'user-2' : 'user-1'; // For demo purposes
  const filteredConversations = conversations.filter(conv => {
    // Filter for the current user's conversations
    const isParticipant = conv.participants.some(p => p.id === userId);

    // Apply additional filters
    if (filter === 'unread') {
      return isParticipant && conv.unreadCount > 0;
    } else if (filter === 'deal-rooms') {
      return isParticipant && conv.hasDealRoom;
    } else {
      return isParticipant;
    }
  }).sort((a, b) => {
    // Sort by most recent first
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // If yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // If within a week, show day name
    const daysDiff = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }

    // Otherwise show date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Get the other participant (not the current user)
  const getOtherParticipant = (conversation: typeof conversations[0]) => {
    return conversation.participants.find(p => p.id !== userId) || conversation.participants[0];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Left Column - Conversation List */}
        <div className="border rounded-lg overflow-hidden bg-white">
          {/* Search and Filter */}
          <div className="p-4 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread
              </Button>
              <Button
                variant={filter === 'deal-rooms' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('deal-rooms')}
              >
                Deal Rooms
              </Button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">No messages found</p>
                <Button className="mt-4" size="sm">Start a conversation</Button>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const otherPerson = getOtherParticipant(conversation);
                return (
                  <div
                    key={conversation.id}
                    className={`border-b p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedConversation === conversation.id ? 'bg-blue-50' : ''
                    } ${conversation.unreadCount > 0 ? 'bg-blue-50/30' : ''}`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
                        otherPerson.role === 'investor' ? 'bg-purple-600' : 'bg-blue-600'
                      }`}>
                        {otherPerson.avatar}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-medium truncate">{otherPerson.name}</div>
                          <div className="text-xs text-gray-500">{formatDate(conversation.lastMessage.timestamp)}</div>
                        </div>

                        <div className="text-sm text-gray-600 truncate mb-1">
                          {conversation.lastMessage.sender === userId ? (
                            <span className="text-gray-400">You: </span>
                          ) : null}
                          {conversation.lastMessage.text}
                        </div>

                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 truncate mr-2">
                            {conversation.projectName}
                          </span>

                          {conversation.hasDealRoom && (
                            <Link
                              href={`/deal-rooms?project=${conversation.projectName}`}
                              className="text-xs text-blue-600 hover:underline inline-flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Deal Room
                            </Link>
                          )}

                          {conversation.unreadCount > 0 && (
                            <div className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column - Message View */}
        <div className="col-span-2 border rounded-lg bg-white overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium mr-3">
                    {getOtherParticipant(filteredConversations.find(c => c.id === selectedConversation)!).avatar}
                  </div>
                  <div>
                    <div className="font-medium">
                      {getOtherParticipant(filteredConversations.find(c => c.id === selectedConversation)!).name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getOtherParticipant(filteredConversations.find(c => c.id === selectedConversation)!).company}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Message Area */}
              <div className="flex-grow p-4 bg-gray-50 overflow-y-auto" style={{ minHeight: '300px' }}>
                <div className="flex justify-center mb-4">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    Today
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col max-w-[70%] ml-auto">
                    <div className="rounded-lg bg-blue-600 text-white p-3">
                      Hello, I'm interested in discussing your startup further. Your approach to AI optimization is quite innovative.
                    </div>
                    <div className="text-xs text-gray-500 self-end mt-1">
                      3:15 PM <Check className="h-3 w-3 inline ml-1" />
                    </div>
                  </div>

                  <div className="flex flex-col max-w-[70%]">
                    <div className="rounded-lg bg-gray-200 p-3">
                      Thanks for your interest! I'd be happy to walk you through our technology and business model in more detail. Would you like to schedule a call this week?
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      3:20 PM
                    </div>
                  </div>

                  <div className="flex flex-col max-w-[70%] ml-auto">
                    <div className="rounded-lg bg-blue-600 text-white p-3">
                      That sounds great. How about Thursday at 2 PM? We can discuss your traction so far and potential investment terms.
                    </div>
                    <div className="text-xs text-gray-500 self-end mt-1">
                      3:23 PM <Check className="h-3 w-3 inline ml-1" />
                    </div>
                  </div>

                  <div className="flex flex-col max-w-[70%]">
                    <div className="rounded-lg bg-gray-200 p-3">
                      Thursday at 2 PM works perfectly for me. I'll send over our latest pitch deck and financials in advance. Looking forward to our conversation!
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      3:30 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-3 border-t">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-grow border rounded-l-md py-2 px-3"
                  />
                  <Button className="rounded-l-none">Send</Button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Select a conversation from the list or start a new one to begin messaging
              </p>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}