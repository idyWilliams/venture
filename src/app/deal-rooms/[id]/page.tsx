"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useUserRole } from '@/src/contexts/UserRoleContext';
import { useApiQuery, useApiMutation } from '@/src/hooks/useApi';
import { DealRoom, DealRoomStatus } from '@/src/lib/services/dealRoomService';
import DealRoomLayout from '@/src/components/deal-room/DealRoomLayout';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DealRoomDetailPage() {
  const params = useParams();
  const dealRoomId = params.id as string;
  const { role } = useUserRole();

  // Using test user IDs for demo purposes
  // In a real app, this would come from authentication
  const userId = role === 'founder' ? 'founder-1' : 'investor-1';
  const userName = role === 'founder' ? 'John Founder' : 'Jane Investor';

  // Fetch deal room details
  const {
    data: dealRoom,
    isLoading,
    error,
    refetch
  } = useApiQuery<DealRoom>(
    `/api/deal-rooms/${dealRoomId}`,
    ['deal-room', dealRoomId],
    undefined,
    {
      enabled: !!dealRoomId,
      refetchInterval: 10000 // Refetch every 10 seconds to keep chat updated
    }
  );

  // Mutation for updating deal status
  const updateStatusMutation = useApiMutation<DealRoom, {
    action: 'updateStatus';
    status: DealRoomStatus;
    userId: string;
    userName: string;
    userRole: 'founder' | 'investor';
  }>('patch', `/api/deal-rooms/${dealRoomId}`, {
    invalidateQueries: [['deal-room', dealRoomId]],
  });

  // Mutation for archiving/unarchiving
  const toggleArchiveMutation = useApiMutation<DealRoom, {
    action: 'toggleArchive';
    userId: string;
  }>('patch', `/api/deal-rooms/${dealRoomId}?archive=${!dealRoom?.isArchived}`, {
    invalidateQueries: [['deal-room', dealRoomId], ['deal-rooms']]
  });

  // Handle status update
  const handleUpdateStatus = (newStatus: string) => {
    updateStatusMutation.mutate({
      action: 'updateStatus',
      status: newStatus as DealRoomStatus,
      userId,
      userName,
      userRole: role as 'founder' | 'investor'
    });
  };

  // Handle archive toggle
  const handleArchiveToggle = () => {
    toggleArchiveMutation.mutate({
      action: 'toggleArchive',
      userId
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading deal room...</span>
      </div>
    );
  }

  if (error || !dealRoom) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <div>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Error loading deal room
          </h3>
          <p className="text-gray-600 mb-4">
            There was a problem fetching the deal room details. Please try again.
          </p>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DealRoomLayout
      dealRoom={dealRoom}
      currentUserId={userId}
      currentUserRole={role as 'founder' | 'investor'}
      onUpdateStatus={handleUpdateStatus}
      onArchive={handleArchiveToggle}
    />
  );
}