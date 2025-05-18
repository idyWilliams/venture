"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PaymentForm from '@/src/components/payment/PaymentForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [planDetails, setPlanDetails] = useState<{
    name: string;
    description: string;
    price: number;
    isSubscription: boolean;
  } | null>(null);

  useEffect(() => {
    // Get plan details from URL parameters
    const plan = searchParams.get('plan');
    const isSubscription = searchParams.get('subscription') === 'true';
    const price = parseFloat(searchParams.get('price') || '0');

    // Set plan details based on the plan ID
    if (plan === 'founder') {
      setPlanDetails({
        name: 'Founder Plan',
        description: 'Perfect for startup founders looking to connect with investors',
        price: price || 29,
        isSubscription
      });
    } else if (plan === 'founder-pro') {
      setPlanDetails({
        name: 'Founder Pro Plan',
        description: 'For founders serious about fundraising and growth',
        price: price || 69,
        isSubscription
      });
    } else if (plan === 'investor') {
      setPlanDetails({
        name: 'Investor Plan',
        description: 'For angel investors and venture capitalists',
        price: price || 149,
        isSubscription
      });
    } else {
      // Default to basic plan if no match
      setPlanDetails({
        name: 'Basic Plan',
        description: 'Standard access to VentureHive Pro platform',
        price: price || 29,
        isSubscription
      });
    }
  }, [searchParams]);

  if (!planDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/pricing" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to pricing
        </Link>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Complete your purchase
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          You're just one step away from accessing VentureHive Pro.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{planDetails.name}</span>
              <span>₦{planDetails.price.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {planDetails.isSubscription ? 'Monthly subscription' : 'One-time payment'}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₦{planDetails.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <PaymentForm
            amount={planDetails.price}
            planName={planDetails.name}
            description={planDetails.description}
            isSubscription={planDetails.isSubscription}
          />
        </div>
      </div>
    </div>
  );
}