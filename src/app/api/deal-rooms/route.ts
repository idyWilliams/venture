import { NextRequest, NextResponse } from 'next/server';
import { createDealRoom, getUserDealRooms } from '@/lib/services/dealRoomService';

// GET /api/deal-rooms - Get all deal rooms for the current user
export async function GET(req: NextRequest) {
  try {
    // Get user from auth session
    // For now, since we don't have real auth in place, we'll use query params for testing
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const role = searchParams.get('role') as 'founder' | 'investor';
    const filter = searchParams.get('filter') as 'active' | 'archived' | 'all' | undefined;
    
    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }
    
    // Get deal rooms for the user
    const dealRooms = await getUserDealRooms(userId, role, filter);
    
    return NextResponse.json(dealRooms);
  } catch (error) {
    console.error('Error fetching deal rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deal rooms' },
      { status: 500 }
    );
  }
}

// POST /api/deal-rooms - Create a new deal room
export async function POST(req: NextRequest) {
  try {
    const { 
      projectId, 
      projectName, 
      founderUserId, 
      founderName, 
      investorUserId, 
      investorName,
      initialTerms
    } = await req.json();
    
    // Validate required fields
    if (!projectId || !projectName || !founderUserId || !founderName || !investorUserId || !investorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new deal room
    const dealRoom = await createDealRoom(
      projectId,
      projectName,
      founderUserId,
      founderName,
      investorUserId,
      investorName,
      initialTerms
    );
    
    return NextResponse.json(dealRoom, { status: 201 });
  } catch (error) {
    console.error('Error creating deal room:', error);
    return NextResponse.json(
      { error: 'Failed to create deal room' },
      { status: 500 }
    );
  }
}