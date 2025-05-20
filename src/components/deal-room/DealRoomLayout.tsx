"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { DealRoom } from '@/src/lib/services/dealRoomService';
import DealRoomMessages from './DealRoomMessages';
import DealRoomTerms from './DealRoomTerms';
import DealRoomDocuments from './DealRoomDocuments';
import DealRoomActivity from './DealRoomActivity';
import { ArrowLeft, Archive, RotateCcw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/src/components/ui/badge';

// Get the status badge color and text
function getStatusBadge(status: string) {
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

interface DealRoomLayoutProps {
  dealRoom: DealRoom;
  currentUserId: string;
  currentUserRole: 'founder' | 'investor';
  onUpdateStatus: (newStatus: string) => void;
  onArchive: () => void;
}

export default function DealRoomLayout({
  dealRoom,
  currentUserId,
  currentUserRole,
  onUpdateStatus,
  onArchive
}: DealRoomLayoutProps) {
  const [activeTab, setActiveTab] = useState('messages');

  const statusBadge = getStatusBadge(dealRoom.status);
  const otherPartyName = currentUserRole === 'founder' ? dealRoom.investorName : dealRoom.founderName;
  const otherPartyRole = currentUserRole === 'founder' ? 'Investor' : 'Founder';

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/deal-rooms" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Deal Rooms
          </Link>
          <h1 className="text-2xl font-bold mt-2">{dealRoom.projectName}</h1>
          <div className="flex items-center mt-1">
            <Badge variant="outline" className={`${statusBadge.color} mr-2`}>
              {statusBadge.text}
            </Badge>
            <span className="text-gray-600 text-sm">
              With {otherPartyName} ({otherPartyRole})
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          {!dealRoom.isArchived && (
            <Button variant="outline" size="sm" onClick={onArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          )}
          {dealRoom.isArchived && (
            <Button variant="outline" size="sm" onClick={onArchive}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Unarchive
            </Button>
          )}
          <Button variant="secondary" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Meeting
          </Button>
        </div>
      </div>

      <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="terms">Deal Terms</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-0">
          <DealRoomMessages
            messages={dealRoom.messages}
            dealRoomId={dealRoom.id}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        </TabsContent>

        <TabsContent value="terms" className="mt-0">
          <DealRoomTerms
            terms={dealRoom.terms}
            dealRoomId={dealRoom.id}
            projectName={dealRoom.projectName}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
            status={dealRoom.status}
            onUpdateStatus={onUpdateStatus}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <DealRoomDocuments
            documents={dealRoom.documents}
            dealRoomId={dealRoom.id}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <DealRoomActivity activities={dealRoom.activities} />
        </TabsContent>
      </Tabs>
    </div>
  );
}