"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { useUserRole } from '@/src/contexts/UserRoleContext';
import { useApiQuery } from '@/src/hooks/useApi';
import {
  DealRoom,
  DealRoomStatus
} from '@/src/lib/services/dealRoomService';
import { Button } from '@/src/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import {
  Plus,
  Archive,
  MessageSquare,
  Users,
  Filter,
  Search,
  Loader2,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import CreateDealRoomModal from '@/src/components/deal-room/CreateDealRoomModal';
import { useUserRole } from '@/src/contexts/UserRoleContext';
// import { useUserRole } from '@/src/src/contexts/UserRoleContext';

// Get the badge color and text for deal status
function getStatusBadge(status: DealRoomStatus) {
  switch (status) {
    case 'pending':
      return { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' };
    case 'active':
      return { color: 'bg-blue-100 text-blue-800', text: 'Active' };
    case 'negotiation':
      return { color: 'bg-purple-100 text-purple-800', text: 'In Negotiation' };
    case 'due_diligence':
      return { color: 'bg-indigo-100 text-indigo-800', text: 'Due Diligence' };
    case 'signed':
      return { color: 'bg-green-100 text-green-800', text: 'Signed' };
    case 'closed':
      return { color: 'bg-green-100 text-green-800', text: 'Closed' };
    case 'rejected':
      return { color: 'bg-red-100 text-red-800', text: 'Rejected' };
    default:
      return { color: 'bg-gray-100 text-gray-800', text: status };
  }
}

// Format date for display
function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}

export default function DealRoomsPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();
  const [filter, setFilter] = useState<'active' | 'archived' | 'all'>('active');
  const [sortBy, setSortBy] = useState<'lastActivity' | 'createdAt'>('lastActivity');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Using test user IDs for demo purposes
  // In a real app, this would come from authentication
  const userId = role === 'founder' ? 'founder-1' : 'investor-1';

  // Fetch deal rooms
  const { data: dealRooms, isLoading, error, refetch } = useApiQuery<DealRoom[]>(
    `/api/deal-rooms?userId=${userId}&role=${role}&filter=${filter}`,
    ['deal-rooms', userId, role, filter],
    undefined,
    {
      enabled: !!userId && !!role,
      // Refetch every 30 seconds to keep data fresh
      refetchInterval: 30000
    }
  );

  // Handle sort toggle
  const toggleSort = (key: 'lastActivity' | 'createdAt') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  // Sort deal rooms
  const sortedDealRooms = dealRooms
    ? [...dealRooms].sort((a, b) => {
        const dateA = new Date(a[sortBy]).getTime();
        const dateB = new Date(b[sortBy]).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      })
    : [];

  // Handle filter change
  const handleFilterChange = (value: 'active' | 'archived' | 'all') => {
    setFilter(value);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Deal Rooms</h1>
        <CreateDealRoomModal />
      </div>

      <Tabs defaultValue="active" value={filter} onValueChange={handleFilterChange as any} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search deal rooms..."
                className="h-10 w-full rounded-md border pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button variant="outline" size="sm" title="Sort by last activity">
              <ArrowUpDown
                className="h-4 w-4 mr-1"
                onClick={() => toggleSort('lastActivity')}
              />
              Activity
            </Button>
          </div>
        </div>

        <TabsContent value="active" className="mt-0">
          {renderDealRooms(false)}
        </TabsContent>

        <TabsContent value="archived" className="mt-0">
          {renderDealRooms(true)}
        </TabsContent>

        <TabsContent value="all" className="mt-0">
          {renderDealRooms(null)}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render deal rooms based on filter
  function renderDealRooms(archived: boolean | null) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-gray-600">Loading deal rooms...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center py-16 text-center">
          <div>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Error loading deal rooms
            </h3>
            <p className="text-gray-600 mb-4">
              There was a problem fetching your deal rooms. Please try again.
            </p>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    const filteredRooms = archived !== null
      ? sortedDealRooms.filter(room => room.isArchived === archived)
      : sortedDealRooms;

    if (!filteredRooms || filteredRooms.length === 0) {
      return (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No deal rooms found
          </h3>
          <p className="text-gray-600 mb-4">
            {archived
              ? "You don't have any archived deal rooms."
              : "Start a conversation with an investor to create a deal room."}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {archived
              ? "View Active Deal Rooms"
              : "Create New Deal Room"}
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {filteredRooms.map((dealRoom) => {
          const statusBadge = getStatusBadge(dealRoom.status);
          const otherPartyName = role === 'founder' ? dealRoom.investorName : dealRoom.founderName;
          const otherPartyRole = role === 'founder' ? 'Investor' : 'Founder';

          return (
            <Link
              href={`/deal-rooms/${dealRoom.id}`}
              key={dealRoom.id}
              className="block"
            >
              <div className="border rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {dealRoom.projectName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      With {otherPartyName} ({otherPartyRole})
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm font-medium">
                      {formatDate(dealRoom.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Activity</p>
                    <p className="text-sm font-medium">
                      {formatDate(dealRoom.lastActivity)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Messages</p>
                    <p className="text-sm font-medium">
                      {dealRoom.messages.length}
                    </p>
                  </div>
                </div>

                {dealRoom.terms.investmentAmount && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500">Investment Amount</p>
                    <p className="text-sm font-medium">
                      ₦{dealRoom.terms.investmentAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }
}