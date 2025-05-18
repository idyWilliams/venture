"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';

interface DealRoom {
  id: string;
  name: string;
  status: string;
  project: {
    id: string;
    title: string;
    description: string;
    industry: string;
    fundingStage: string;
    fundingAmount: number | null;
    equity: number | null;
    founder: {
      id: string;
      name: string;
      companyName: string | null;
      email: string;
    };
  };
  manager: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  participants: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
  documents: {
    id: string;
    name: string;
    fileUrl: string;
    documentType: string;
    createdAt: string;
  }[];
  conversations: {
    id: string;
    senderId: string;
    content: string;
    createdAt: string;
  }[];
}

interface DealMessage {
  id: string;
  senderId: string;
  senderName?: string;
  content: string;
  createdAt: string;
}

export default function DealRoomPage() {
  const params = useParams();
  const dealRoomId = params.id as string;

  const [dealRoom, setDealRoom] = useState<DealRoom | null>(null);
  const [messages, setMessages] = useState<DealMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  // Mock user ID (in a real app, this would come from authentication)
  const currentUserId = 'user-123';
  const currentUserName = 'Jane Investor';

  // Fetch deal room data
  useEffect(() => {
    const fetchDealRoom = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be a server fetch
        // const response = await fetch(`/api/deal-room/${dealRoomId}`);
        // const data = await response.json();

        // For this demo, we'll use mock data
        const mockDealRoom: DealRoom = {
          id: dealRoomId,
          name: "Series A Investment Deal",
          status: "active",
          project: {
            id: "project-123",
            title: "EcoTech Energy Solutions",
            description: "Renewable energy storage platform for residential use",
            industry: "Clean Energy",
            fundingStage: "Series A",
            fundingAmount: 2500000,
            equity: 15,
            founder: {
              id: "user-456",
              name: "Alex Chen",
              companyName: "EcoTech Inc.",
              email: "alex@ecotech.com"
            }
          },
          manager: {
            id: "user-789",
            name: "Sarah Johnson",
            email: "sarah@vcfirm.com",
            role: "INVESTOR"
          },
          participants: [
            {
              id: "user-123",
              name: "Jane Investor",
              email: "jane@investment.com",
              role: "INVESTOR"
            },
            {
              id: "user-456",
              name: "Alex Chen",
              email: "alex@ecotech.com",
              role: "FOUNDER"
            }
          ],
          documents: [
            {
              id: "doc-1",
              name: "Term Sheet v1",
              fileUrl: "/documents/term-sheet.pdf",
              documentType: "term_sheet",
              createdAt: "2025-04-20T10:30:00Z"
            },
            {
              id: "doc-2",
              name: "Financial Projections",
              fileUrl: "/documents/financials.xlsx",
              documentType: "financial",
              createdAt: "2025-04-21T14:15:00Z"
            },
            {
              id: "doc-3",
              name: "Due Diligence Report",
              fileUrl: "/documents/dd-report.pdf",
              documentType: "due_diligence",
              createdAt: "2025-04-25T09:45:00Z"
            }
          ],
          conversations: [
            {
              id: "msg-1",
              senderId: "user-789",
              content: "I've uploaded the initial term sheet for review. Please take a look and let me know your thoughts.",
              createdAt: "2025-04-20T10:35:00Z"
            },
            {
              id: "msg-2",
              senderId: "user-456",
              content: "Thanks for the term sheet. I've reviewed it and have a few questions about the vesting schedule for founder shares.",
              createdAt: "2025-04-21T11:20:00Z"
            },
            {
              id: "msg-3",
              senderId: "user-123",
              content: "I'd like to discuss the valuation cap. Let's schedule a call to go through the details.",
              createdAt: "2025-04-22T14:05:00Z"
            }
          ]
        };

        // Process messages to add sender names
        const mockMessages = mockDealRoom.conversations.map(msg => {
          const sender = mockDealRoom.participants.find(p => p.id === msg.senderId) || mockDealRoom.manager;
          return {
            ...msg,
            senderName: sender ? sender.name : 'Unknown User'
          };
        });

        setTimeout(() => {
          setDealRoom(mockDealRoom);
          setMessages(mockMessages);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching deal room:', err);
        setError('Failed to load deal room data');
        setLoading(false);
      }
    };

    fetchDealRoom();
  }, [dealRoomId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !dealRoom) return;

    try {
      // In a real implementation, this would be a server request
      // await fetch(`/api/deal-room/${dealRoomId}/messages`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newMessage, senderId: currentUserId })
      // });

      // For this demo, we'll update the state directly
      const newMsg: DealMessage = {
        id: `msg-${messages.length + 1}`,
        senderId: currentUserId,
        senderName: currentUserName,
        content: newMessage,
        createdAt: new Date().toISOString()
      };

      setMessages([...messages, newMsg]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentName || !documentType || !documentFile || !dealRoom) return;

    setUploadingDocument(true);

    try {
      // In a real implementation, this would upload the file to storage and create a DB record
      // const formData = new FormData();
      // formData.append('file', documentFile);
      // formData.append('name', documentName);
      // formData.append('documentType', documentType);
      // formData.append('uploadedBy', currentUserId);

      // const response = await fetch(`/api/deal-room/${dealRoomId}/documents`, {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await response.json();

      // For this demo, we'll update the state directly
      const newDocument = {
        id: `doc-${dealRoom.documents.length + 1}`,
        name: documentName,
        fileUrl: URL.createObjectURL(documentFile),
        documentType: documentType,
        createdAt: new Date().toISOString()
      };

      setDealRoom({
        ...dealRoom,
        documents: [...dealRoom.documents, newDocument]
      });

      // Add a message about the document upload
      const newMsg: DealMessage = {
        id: `msg-${messages.length + 1}`,
        senderId: currentUserId,
        senderName: currentUserName,
        content: `I uploaded a new document: ${documentName}`,
        createdAt: new Date().toISOString()
      };

      setMessages([...messages, newMsg]);

      // Reset form
      setDocumentName('');
      setDocumentType('');
      setDocumentFile(null);

      setTimeout(() => {
        setUploadingDocument(false);
      }, 1000);
    } catch (err) {
      console.error('Error uploading document:', err);
      alert('Failed to upload document');
      setUploadingDocument(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-blue-200 mb-6"></div>
            <div className="h-6 w-48 bg-blue-200 rounded mb-4"></div>
            <div className="h-4 w-64 bg-blue-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dealRoom) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{error || 'Failed to load deal room'}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{dealRoom.name}</h1>
        <div className="flex flex-wrap gap-2 items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            dealRoom.status === 'active' ? 'bg-green-100 text-green-800' :
            dealRoom.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {dealRoom.status.charAt(0).toUpperCase() + dealRoom.status.slice(1)}
          </span>
          <span className="text-gray-500">
            Project: <span className="font-medium">{dealRoom.project.title}</span>
          </span>
          <span className="text-gray-500">
            Industry: <span className="font-medium">{dealRoom.project.industry}</span>
          </span>
          <span className="text-gray-500">
            Funding: <span className="font-medium">${dealRoom.project.fundingAmount?.toLocaleString()}</span>
          </span>
          <span className="text-gray-500">
            Equity: <span className="font-medium">{dealRoom.project.equity}%</span>
          </span>
        </div>
        <p className="text-gray-700">{dealRoom.project.description}</p>
      </div>

      <Tabs defaultValue="conversations">
        <TabsList className="mb-6">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="details">Deal Details</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
              <CardDescription>
                Secure communication between deal participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 border rounded-md">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === currentUserId
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="font-medium text-sm mb-1">
                          {message.senderName}
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <div className={`text-xs mt-1 ${
                          message.senderId === currentUserId
                            ? 'text-blue-200'
                            : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Securely share and manage deal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {dealRoom.documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-500 mb-3">
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <h3 className="font-medium mb-1">{doc.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {doc.documentType.replace('_', ' ').charAt(0).toUpperCase() + doc.documentType.replace('_', ' ').slice(1)}
                        </p>
                        <div className="text-xs text-gray-400 mb-4">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                        <Button variant="outline" size="sm">
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-lg mb-4">Upload New Document</h3>
                <form onSubmit={handleUploadDocument} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="documentName">Document Name</Label>
                      <Input
                        id="documentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="documentType">Document Type</Label>
                      <select
                        id="documentType"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        required
                      >
                        <option value="">Select document type</option>
                        <option value="term_sheet">Term Sheet</option>
                        <option value="contract">Contract</option>
                        <option value="financial">Financial Documents</option>
                        <option value="pitch_deck">Pitch Deck</option>
                        <option value="due_diligence">Due Diligence</option>
                        <option value="legal">Legal Documents</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="documentFile">File</Label>
                    <Input
                      id="documentFile"
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setDocumentFile(e.target.files[0]);
                        }
                      }}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={uploadingDocument}>
                    {uploadingDocument ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                People involved in this deal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-medium text-lg mb-3">Deal Manager</h3>
                <Card>
                  <CardContent className="pt-6 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg mr-4">
                      {dealRoom.manager.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{dealRoom.manager.name}</h4>
                      <p className="text-sm text-gray-500">{dealRoom.manager.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{dealRoom.manager.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-3">Participants</h3>
                <div className="space-y-3">
                  {dealRoom.participants.map((participant) => (
                    <Card key={participant.id}>
                      <CardContent className="pt-6 flex items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-lg mr-4">
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium">{participant.name}</h4>
                          <p className="text-sm text-gray-500">{participant.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {participant.role === 'FOUNDER' ? 'Founder' :
                             participant.role === 'INVESTOR' ? 'Investor' : participant.role}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <Button variant="outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Invite Participant
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Deal Details</CardTitle>
              <CardDescription>
                Key information about the investment deal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-lg mb-4">Project Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Project Title</p>
                      <p className="font-medium">{dealRoom.project.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Industry</p>
                      <p className="font-medium">{dealRoom.project.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Funding Stage</p>
                      <p className="font-medium">{dealRoom.project.fundingStage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Funding Amount</p>
                      <p className="font-medium">
                        ${dealRoom.project.fundingAmount?.toLocaleString() || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Equity Offering</p>
                      <p className="font-medium">
                        {dealRoom.project.equity !== null ? `${dealRoom.project.equity}%` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-lg mb-4">Founder Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Founder Name</p>
                      <p className="font-medium">{dealRoom.project.founder.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{dealRoom.project.founder.companyName || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{dealRoom.project.founder.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-medium text-lg mb-4">Deal Status</h3>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-2 rounded-md ${
                    dealRoom.status === 'active' ? 'bg-green-100 text-green-800' :
                    dealRoom.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {dealRoom.status.charAt(0).toUpperCase() + dealRoom.status.slice(1)}
                  </div>

                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Change Status
                    </Button>
                    {dealRoom.status === 'active' && (
                      <Button size="sm">
                        Finalize Deal
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}