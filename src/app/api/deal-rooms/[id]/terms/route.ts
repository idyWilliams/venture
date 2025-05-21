import { NextRequest, NextResponse } from 'next/server';
import { updateDealTerms, DealTerms } from '@/src/lib/services/dealRoomService';

interface Params {
  params: {
    id: string;
  };
}

// PUT /api/deal-rooms/[id]/terms - Update deal terms
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const dealRoomId = params.id;
    const { terms, userId, userName, userRole } = await req.json();

    if (!dealRoomId || !terms || !userId || !userName || !userRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update deal terms
    const result = await updateDealTerms(
      dealRoomId,
      terms as DealTerms,
      userId,
      userName,
      userRole as 'founder' | 'investor'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating deal terms:', error);
    return NextResponse.json(
      { error: 'Failed to update deal terms' },
      { status: 500 }
    );
  }
}