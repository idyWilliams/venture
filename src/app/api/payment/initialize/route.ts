import { NextRequest, NextResponse } from 'next/server';
import { initializeTransaction } from '@/lib/paystack';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Extract payment data from request body
    const { email, amount, metadata } = await req.json();

    // Validate required fields
    if (!email || !amount) {
      return NextResponse.json(
        { error: 'Email and amount are required' },
        { status: 400 }
      );
    }

    // Generate a unique reference for this transaction
    const reference = `tx-${crypto.randomBytes(8).toString('hex')}`;

    // Convert amount to kobo (the smallest currency unit in Nigeria)
    // Paystack expects amount in kobo (1 Naira = 100 kobo)
    const amountInKobo = amount * 100;

    // Initialize the transaction with Paystack
    const response = await initializeTransaction(
      email,
      amountInKobo,
      reference,
      metadata
    );

    // Return the authorization URL and reference
    return NextResponse.json({
      authorizationUrl: response.data.authorization_url,
      reference: response.data.reference,
      accessCode: response.data.access_code,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}