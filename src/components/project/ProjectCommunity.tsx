'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
// import { formatDate } from '@/lib/utils';
import { joinCommunityRoom, leaveCommunityRoom, sendCommunityMessage, listenToCommunityMessages, initializeSocket } from '@/src/lib/socket';
 const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toLocaleDateString("en-US", {
     year: "numeric",
     month: "short",
     day: "numeric",
   });
 };
interface Message {
  id: string;
  userId: string;
  userName: string;
  userRole: 'founder' | 'investor';
  content: string;
  timestamp: string;
}

interface ProjectCommunityProps {
  projectId: string;
}

export default function ProjectCommunity({ projectId }: ProjectCommunityProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: 'founder' | 'investor';
  }>({
    id: 'current-user', // This would come from auth in a real app
    name: 'You', // This would come from auth in a real app
    role: 'investor', // This would come from auth in a real app
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = initializeSocket(currentUser.id);
    setIsConnected(true);

    // Join the community room for this project
    joinCommunityRoom(projectId);

    // Listen for new messages
    const unsubscribe = listenToCommunityMessages((data) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        userId: data.userId,
        userName: data.userName,
        userRole: data.userRole,
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newMessage]);
    });

    // In a real app, we would fetch previous messages from the API
    // fetchCommunityMessages(projectId).then(setMessages);

    // For demo purposes, let's add some mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        userId: 'founder-1',
        userName: 'John Smith (Founder)',
        userRole: 'founder',
        content: 'Welcome to our community discussion! Feel free to ask any questions about our healthcare assistant.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
      {
        id: '2',
        userId: 'investor-1',
        userName: 'Sarah Johnson',
        userRole: 'investor',
        content: 'Thanks for creating this space. I\'m curious about your ML model training process. How large is your dataset?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      },
      {
        id: '3',
        userId: 'founder-1',
        userName: 'John Smith (Founder)',
        userRole: 'founder',
        content: 'Great question! We\'ve trained our models on over 1M anonymized health records in partnership with three major research hospitals.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(), // 11 hours ago
      },
      {
        id: '4',
        userId: 'investor-2',
        userName: 'Michael Wong',
        userRole: 'investor',
        content: 'How are you addressing data privacy concerns, especially with health data being so sensitive?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      },
    ];

    setMessages(mockMessages);

    return () => {
      // Clean up when component unmounts
      leaveCommunityRoom(projectId);
      if (unsubscribe) unsubscribe();
    };
  }, [projectId, currentUser.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    // In a real app, this would send the message through the socket
    sendCommunityMessage(projectId, newMessage);

    // For demo purposes, let's add the message locally too
    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Community Discussion</h3>
          <div className="text-sm text-gray-500 flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isConnected ? 'Connected' : 'Connecting...'}
          </div>
        </div>

        {/* Messages container */}
        <div className="bg-gray-50 rounded-md p-4 h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.userId === currentUser.id
                        ? 'bg-blue-500 text-white'
                        : message.userRole === 'founder'
                          ? 'bg-blue-100'
                          : 'bg-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-medium text-sm ${
                        message.userId === currentUser.id
                          ? 'text-blue-100'
                          : message.userRole === 'founder'
                            ? 'text-blue-800'
                            : 'text-gray-800'
                      }`}>
                        {message.userName}
                      </span>
                      <span className={`text-xs ml-2 ${
                        message.userId === currentUser.id
                          ? 'text-blue-200'
                          : 'text-gray-500'
                      }`}>
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className={`${
                      message.userId === currentUser.id
                        ? 'text-white'
                        : 'text-gray-800'
                    }`}>
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message input */}
        <div className="flex items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 mr-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            Send
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          This is a real-time community discussion. Be respectful and follow our community guidelines.
        </p>
      </CardContent>
    </Card>
  );
}
