"use client";

import { useState, useRef, useEffect } from 'react';
import { DealRoomMessage } from '@/lib/services/dealRoomService';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useApiMutation } from '@/hooks/useApi';

interface DealRoomMessagesProps {
  messages: DealRoomMessage[];
  dealRoomId: string;
  currentUserId: string;
  currentUserRole: 'founder' | 'investor';
}

export default function DealRoomMessages({
  messages,
  dealRoomId,
  currentUserId,
  currentUserRole
}: DealRoomMessagesProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Mutation for sending a message
  const sendMessageMutation = useApiMutation<DealRoomMessage, {
    dealRoomId: string;
    content: string;
  }>('post', `/api/deal-rooms/${dealRoomId}/messages`, {
    invalidateQueries: [[`/api/deal-rooms/${dealRoomId}`]],
    onSuccess: () => {
      setNewMessage('');
    }
  });
  
  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      dealRoomId,
      content: newMessage
    });
  };
  
  // Format timestamp to display in a readable format
  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return timestamp;
    }
  };
  
  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${
                message.isSystemMessage
                  ? 'justify-center'
                  : message.senderId === currentUserId
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {message.isSystemMessage ? (
                <div className="bg-gray-100 text-gray-600 rounded-md py-2 px-4 text-sm max-w-[80%]">
                  <div>{message.content}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              ) : message.senderId === currentUserId ? (
                <div className="bg-blue-600 text-white rounded-lg py-2 px-4 max-w-[80%]">
                  <div>{message.content}</div>
                  <div className="text-xs text-blue-200 mt-1 text-right">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-200 text-gray-800 rounded-lg py-2 px-4 max-w-[80%]">
                  <div className="font-medium text-sm text-gray-600 mb-1">
                    {message.senderName} ({message.senderRole})
                  </div>
                  <div>{message.content}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            className="shrink-0"
            title="Attach file (coming soon)"
            disabled
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <Button 
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="shrink-0"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}