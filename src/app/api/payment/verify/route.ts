import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/paystack';

export async function POST(req: NextRequest) {
  try {
    // Extract reference from request body
    const { reference } = await req.json();

    // Validate required fields
    if (!reference) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }

    // Verify the transaction
    const response = await verifyTransaction(reference);

    // Check if the transaction was successful
    if (response.data.status === 'success') {
      // Here, you'd typically update your database to mark the payment as successful
      // and possibly upgrade the user's subscription or grant access to paid features
      
      return NextResponse.json({
        success: true,
        data: response.data,
        message: 'Payment verified successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        data: response.data,
        message: `Payment verification failed: ${response.data.status}`,
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}