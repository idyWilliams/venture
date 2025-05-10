// Deal Room Service
// Handles creation, access, and management of deal rooms between founders and investors

import { db } from '@/lib/db';
import { openai } from '@/lib/openai';

export type DealRoomStatus = 
  | 'pending' 
  | 'active' 
  | 'negotiation' 
  | 'due_diligence' 
  | 'signed' 
  | 'closed' 
  | 'rejected';

export type DealType = 
  | 'equity' 
  | 'convertible_note' 
  | 'safe' 
  | 'revenue_share' 
  | 'grant' 
  | 'other';

export interface DealTerms {
  investmentAmount?: number;
  equity?: number;
  valuation?: number;
  closingDate?: string;
  minimumInvestment?: number;
  notes?: string;
  additionalTerms?: string;
  dealType?: DealType;
  // For convertible notes or SAFEs
  conversionDiscount?: number;
  valuationCap?: number;
  interestRate?: number;
  maturityDate?: string;
  // For revenue share
  revenuePercentage?: number;
  returnCap?: number;
  paymentFrequency?: 'monthly' | 'quarterly' | 'annually';
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  description?: string;
  isConfidential: boolean;
}

export interface DealRoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'founder' | 'investor';
  content: string;
  timestamp: string;
  isSystemMessage: boolean;
  attachments?: DocumentInfo[];
}

export interface DealRoomActivity {
  id: string;
  type: 'message' | 'document' | 'term_update' | 'status_change' | 'user_joined';
  userId: string;
  userName: string;
  userRole: 'founder' | 'investor';
  timestamp: string;
  details: any;
}

export interface DealRoom {
  id: string;
  projectId: string;
  projectName: string;
  founderUserId: string;
  founderName: string;
  investorUserId: string;
  investorName: string;
  createdAt: string;
  updatedAt: string;
  status: DealRoomStatus;
  terms: DealTerms;
  messages: DealRoomMessage[];
  activities: DealRoomActivity[];
  documents: DocumentInfo[];
  isArchived: boolean;
  lastActivity: string;
}

// Create a new deal room
export async function createDealRoom(
  projectId: string,
  projectName: string,
  founderUserId: string,
  founderName: string,
  investorUserId: string,
  investorName: string,
  initialTerms?: DealTerms
): Promise<DealRoom> {
  try {
    const now = new Date().toISOString();
    const dealRoomId = `dr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create initial system message
    const initialMessage: DealRoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'founder', // Default, not really used for system
      content: `Deal room created between ${founderName} (Founder) and ${investorName} (Investor) for project "${projectName}".`,
      timestamp: now,
      isSystemMessage: true
    };
    
    // Create initial activity record
    const initialActivity: DealRoomActivity = {
      id: `act-${Date.now()}`,
      type: 'user_joined',
      userId: 'system',
      userName: 'System',
      userRole: 'founder', // Default, not really used for system
      timestamp: now,
      details: {
        message: `Deal room created for project "${projectName}"`
      }
    };
    
    // Create the new deal room
    const newDealRoom: DealRoom = {
      id: dealRoomId,
      projectId,
      projectName,
      founderUserId,
      founderName,
      investorUserId,
      investorName,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      terms: initialTerms || {},
      messages: [initialMessage],
      activities: [initialActivity],
      documents: [],
      isArchived: false,
      lastActivity: now
    };
    
    // TODO: Save to database once schema is implemented
    // await db.dealRooms.create({ data: newDealRoom });
    
    return newDealRoom;
  } catch (error) {
    console.error('Error creating deal room:', error);
    throw new Error('Failed to create deal room');
  }
}

// Get a specific deal room by ID
export async function getDealRoom(dealRoomId: string): Promise<DealRoom | null> {
  try {
    // TODO: Implement database query when schema is ready
    // const dealRoom = await db.dealRooms.findUnique({ where: { id: dealRoomId } });
    // return dealRoom;
    return null;
  } catch (error) {
    console.error('Error fetching deal room:', error);
    throw new Error('Failed to fetch deal room');
  }
}

// Get all deal rooms for a specific user (investor or founder)
export async function getUserDealRooms(
  userId: string,
  role: 'founder' | 'investor',
  filter?: 'active' | 'archived' | 'all'
): Promise<DealRoom[]> {
  try {
    // TODO: Implement database query when schema is ready
    // const query = { 
    //   where: { 
    //     [role === 'founder' ? 'founderUserId' : 'investorUserId']: userId,
    //     ...(filter === 'active' ? { isArchived: false } : {}),
    //     ...(filter === 'archived' ? { isArchived: true } : {})
    //   }
    // };
    // const dealRooms = await db.dealRooms.findMany(query);
    // return dealRooms;
    return [];
  } catch (error) {
    console.error('Error fetching user deal rooms:', error);
    throw new Error('Failed to fetch user deal rooms');
  }
}

// Update deal room terms
export async function updateDealTerms(
  dealRoomId: string,
  updatedTerms: DealTerms,
  userId: string,
  userName: string,
  userRole: 'founder' | 'investor'
): Promise<DealRoom> {
  try {
    // Get the current deal room
    const dealRoom = await getDealRoom(dealRoomId);
    if (!dealRoom) {
      throw new Error('Deal room not found');
    }
    
    // Check if user has permission to update
    if (userRole === 'founder' && dealRoom.founderUserId !== userId) {
      throw new Error('You do not have permission to update this deal room');
    }
    if (userRole === 'investor' && dealRoom.investorUserId !== userId) {
      throw new Error('You do not have permission to update this deal room');
    }
    
    const now = new Date().toISOString();
    
    // Create a record of the terms update
    const termUpdateActivity: DealRoomActivity = {
      id: `act-${Date.now()}`,
      type: 'term_update',
      userId,
      userName,
      userRole,
      timestamp: now,
      details: {
        previousTerms: dealRoom.terms,
        newTerms: updatedTerms
      }
    };
    
    // Create a system message about the terms update
    const termUpdateMessage: DealRoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'founder', // Default, not really used for system
      content: `${userName} (${userRole}) updated the deal terms.`,
      timestamp: now,
      isSystemMessage: true
    };
    
    // Update the deal room
    const updatedDealRoom: DealRoom = {
      ...dealRoom,
      terms: updatedTerms,
      activities: [...dealRoom.activities, termUpdateActivity],
      messages: [...dealRoom.messages, termUpdateMessage],
      updatedAt: now,
      lastActivity: now
    };
    
    // TODO: Save to database once schema is implemented
    // await db.dealRooms.update({ 
    //   where: { id: dealRoomId },
    //   data: updatedDealRoom
    // });
    
    return updatedDealRoom;
  } catch (error) {
    console.error('Error updating deal terms:', error);
    throw new Error('Failed to update deal terms');
  }
}

// Update deal room status
export async function updateDealStatus(
  dealRoomId: string,
  newStatus: DealRoomStatus,
  userId: string,
  userName: string,
  userRole: 'founder' | 'investor'
): Promise<DealRoom> {
  try {
    // Get the current deal room
    const dealRoom = await getDealRoom(dealRoomId);
    if (!dealRoom) {
      throw new Error('Deal room not found');
    }
    
    // Check if user has permission to update
    if (userRole === 'founder' && dealRoom.founderUserId !== userId) {
      throw new Error('You do not have permission to update this deal room');
    }
    if (userRole === 'investor' && dealRoom.investorUserId !== userId) {
      throw new Error('You do not have permission to update this deal room');
    }
    
    const now = new Date().toISOString();
    
    // Create a record of the status update
    const statusUpdateActivity: DealRoomActivity = {
      id: `act-${Date.now()}`,
      type: 'status_change',
      userId,
      userName,
      userRole,
      timestamp: now,
      details: {
        previousStatus: dealRoom.status,
        newStatus
      }
    };
    
    // Create a system message about the status update
    const statusMessage: DealRoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'founder', // Default, not really used for system
      content: `${userName} (${userRole}) changed the deal status from ${dealRoom.status} to ${newStatus}.`,
      timestamp: now,
      isSystemMessage: true
    };
    
    // Update the deal room
    const updatedDealRoom: DealRoom = {
      ...dealRoom,
      status: newStatus,
      activities: [...dealRoom.activities, statusUpdateActivity],
      messages: [...dealRoom.messages, statusMessage],
      updatedAt: now,
      lastActivity: now
    };
    
    // TODO: Save to database once schema is implemented
    // await db.dealRooms.update({ 
    //   where: { id: dealRoomId },
    //   data: updatedDealRoom
    // });
    
    return updatedDealRoom;
  } catch (error) {
    console.error('Error updating deal status:', error);
    throw new Error('Failed to update deal status');
  }
}

// Send a message in the deal room
export async function sendMessage(
  dealRoomId: string,
  userId: string,
  userName: string,
  userRole: 'founder' | 'investor',
  content: string,
  attachments?: DocumentInfo[]
): Promise<DealRoomMessage> {
  try {
    // Get the current deal room
    const dealRoom = await getDealRoom(dealRoomId);
    if (!dealRoom) {
      throw new Error('Deal room not found');
    }
    
    // Check if user has permission to send messages
    if (userRole === 'founder' && dealRoom.founderUserId !== userId) {
      throw new Error('You do not have permission to send messages in this deal room');
    }
    if (userRole === 'investor' && dealRoom.investorUserId !== userId) {
      throw new Error('You do not have permission to send messages in this deal room');
    }
    
    const now = new Date().toISOString();
    
    // Create the new message
    const newMessage: DealRoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      content,
      timestamp: now,
      isSystemMessage: false,
      attachments
    };
    
    // Add message to deal room
    const updatedDealRoom: DealRoom = {
      ...dealRoom,
      messages: [...dealRoom.messages, newMessage],
      updatedAt: now,
      lastActivity: now
    };
    
    // TODO: Save to database once schema is implemented
    // await db.dealRooms.update({ 
    //   where: { id: dealRoomId },
    //   data: updatedDealRoom
    // });
    
    // TODO: Send notifications to other party
    
    return newMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
}

// Generate deal terms analysis using AI
export async function analyzeDealTerms(terms: DealTerms, projectDetails: any): Promise<string> {
  try {
    // Extract key information about the deal
    const dealType = terms.dealType || 'equity';
    const valuation = terms.valuation || 'unknown';
    const equity = terms.equity || 'unknown';
    const investmentAmount = terms.investmentAmount || 'unknown';
    
    // Construct a prompt for the AI
    const prompt = `
      I need an analysis of the following startup investment deal terms:
      
      Deal Type: ${dealType}
      Valuation: ${valuation}
      Equity Offered: ${equity}%
      Investment Amount: ${investmentAmount}
      ${terms.conversionDiscount ? `Conversion Discount: ${terms.conversionDiscount}%` : ''}
      ${terms.valuationCap ? `Valuation Cap: ${terms.valuationCap}` : ''}
      ${terms.interestRate ? `Interest Rate: ${terms.interestRate}%` : ''}
      ${terms.revenuePercentage ? `Revenue Percentage: ${terms.revenuePercentage}%` : ''}
      
      Project Information:
      Industry: ${projectDetails.industry || 'Unknown'}
      Stage: ${projectDetails.stage || 'Unknown'}
      Revenue: ${projectDetails.revenue || 'No revenue yet'}
      Team Size: ${projectDetails.teamSize || 'Unknown'}
      
      Please provide a balanced analysis of these terms from both the investor and founder perspective. 
      Identify if any terms are particularly favorable or unfavorable to either party compared to market standards.
      Include recommendations for potential negotiation points. 
      Keep the analysis concise and professional.
    `;
    
    // TODO: Use OpenAI to analyze the terms
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7,
    //   max_tokens: 1000
    // });
    
    // return response.choices[0].message.content || "Unable to generate analysis.";
    
    // Placeholder until OpenAI integration is complete
    return "Deal terms analysis will be available once AI integration is complete.";
  } catch (error) {
    console.error('Error analyzing deal terms:', error);
    return "Error generating deal analysis. Please try again later.";
  }
}

// Upload a document to the deal room
export async function uploadDocument(
  dealRoomId: string,
  userId: string,
  userName: string,
  userRole: 'founder' | 'investor',
  file: File,
  description?: string,
  isConfidential: boolean = false
): Promise<DocumentInfo> {
  try {
    // Get the current deal room
    const dealRoom = await getDealRoom(dealRoomId);
    if (!dealRoom) {
      throw new Error('Deal room not found');
    }
    
    // Check if user has permission
    if (userRole === 'founder' && dealRoom.founderUserId !== userId) {
      throw new Error('You do not have permission to upload documents to this deal room');
    }
    if (userRole === 'investor' && dealRoom.investorUserId !== userId) {
      throw new Error('You do not have permission to upload documents to this deal room');
    }
    
    const now = new Date().toISOString();
    
    // TODO: Implement actual file upload to storage service
    // const uploadResult = await uploadToStorage(file);
    
    // Create document record
    const newDocument: DocumentInfo = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type,
      url: 'placeholder-url', // Replace with actual URL from storage
      uploadedBy: userId,
      uploadedAt: now,
      size: file.size,
      description,
      isConfidential
    };
    
    // Create activity record
    const documentActivity: DealRoomActivity = {
      id: `act-${Date.now()}`,
      type: 'document',
      userId,
      userName,
      userRole,
      timestamp: now,
      details: {
        documentId: newDocument.id,
        documentName: newDocument.name,
        action: 'uploaded'
      }
    };
    
    // Create system message
    const documentMessage: DealRoomMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      senderRole: 'founder', // Default, not really used for system
      content: `${userName} (${userRole}) uploaded document: ${file.name}`,
      timestamp: now,
      isSystemMessage: true
    };
    
    // Update deal room
    const updatedDealRoom: DealRoom = {
      ...dealRoom,
      documents: [...dealRoom.documents, newDocument],
      activities: [...dealRoom.activities, documentActivity],
      messages: [...dealRoom.messages, documentMessage],
      updatedAt: now,
      lastActivity: now
    };
    
    // TODO: Save to database once schema is implemented
    // await db.dealRooms.update({ 
    //   where: { id: dealRoomId },
    //   data: updatedDealRoom
    // });
    
    return newDocument;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error('Failed to upload document');
  }
}

// Archive or unarchive a deal room
export async function toggleArchiveDealRoom(
  dealRoomId: string,
  userId: string,
  archive: boolean
): Promise<DealRoom> {
  try {
    // Get the current deal room
    const dealRoom = await getDealRoom(dealRoomId);
    if (!dealRoom) {
      throw new Error('Deal room not found');
    }
    
    // Check if user has permission
    if (dealRoom.founderUserId !== userId && dealRoom.investorUserId !== userId) {
      throw new Error('You do not have permission to archive/unarchive this deal room');
    }
    
    // Update archive status
    const updatedDealRoom: DealRoom = {
      ...dealRoom,
      isArchived: archive,
      updatedAt: new Date().toISOString()
    };
    
    // TODO: Save to database once schema is implemented
    // await db.dealRooms.update({ 
    //   where: { id: dealRoomId },
    //   data: { isArchived: archive }
    // });
    
    return updatedDealRoom;
  } catch (error) {
    console.error('Error toggling archive status:', error);
    throw new Error('Failed to update deal room archive status');
  }
}

// Get deal room statistics
export async function getDealRoomStats(userId: string, role: 'founder' | 'investor'): Promise<any> {
  try {
    // TODO: Implement database queries when schema is ready
    // const totalDealRooms = await db.dealRooms.count({
    //   where: { [role === 'founder' ? 'founderUserId' : 'investorUserId']: userId }
    // });
    
    // const activeDealRooms = await db.dealRooms.count({
    //   where: { 
    //     [role === 'founder' ? 'founderUserId' : 'investorUserId']: userId,
    //     isArchived: false,
    //     status: { notIn: ['closed', 'rejected'] }
    //   }
    // });
    
    // const closedDeals = await db.dealRooms.count({
    //   where: { 
    //     [role === 'founder' ? 'founderUserId' : 'investorUserId']: userId,
    //     status: 'closed'
    //   }
    // });
    
    // // Get status distribution
    // const statusDistribution = await db.dealRooms.groupBy({
    //   by: ['status'],
    //   where: { [role === 'founder' ? 'founderUserId' : 'investorUserId']: userId },
    //   _count: true
    // });
    
    // // Format the status distribution
    // const formattedStatusDistribution = statusDistribution.reduce((acc, item) => {
    //   acc[item.status] = item._count;
    //   return acc;
    // }, {});
    
    return {
      totalDealRooms: 0,
      activeDealRooms: 0,
      closedDeals: 0,
      statusDistribution: {}
    };
  } catch (error) {
    console.error('Error getting deal room stats:', error);
    throw new Error('Failed to get deal room statistics');
  }
}