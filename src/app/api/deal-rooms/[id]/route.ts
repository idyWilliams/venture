import { NextRequest, NextResponse } from 'next/server';
import { getDealRoom, toggleArchiveDealRoom, updateDealStatus } from '@/lib/services/dealRoomService';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/deal-rooms/[id] - Get a specific deal room
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const dealRoomId = params.id;
    
    // Get deal room
    const dealRoom = await getDealRoom(dealRoomId);
    
    if (!dealRoom) {
      return NextResponse.json(
        { error: 'Deal room not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(dealRoom);
  } catch (error) {
    console.error('Error fetching deal room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal room' },
      { status: 500 }
    );
  }
}

// PATCH /api/deal-rooms/[id] - Update deal room status or archive status
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const dealRoomId = params.id;
    const { action, status, userId, userName, userRole } = await req.json();
    
    if (!dealRoomId || !userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    let result;
    
    if (action === 'updateStatus' && status && userName && userRole) {
      // Update deal status
      result = await updateDealStatus(
        dealRoomId,
        status,
        userId,
        userName,
        userRole as 'founder' | 'investor'
      );
    } else if (action === 'toggleArchive') {
      // Archive or unarchive the deal room
      const archive = req.nextUrl.searchParams.get('archive') === 'true';
      result = await toggleArchiveDealRoom(dealRoomId, userId, archive);
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating deal room:', error);
    return NextResponse.json(
      { error: 'Failed to update deal room' },
      { status: 500 }
    );
  }
}