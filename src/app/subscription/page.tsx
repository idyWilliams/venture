"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/src/contexts/UserRoleContext';
import { Button } from '@/components/ui/button';
import {
  Check,
  ChevronsUpDown,
  CreditCard,
  HelpCircle,
  Loader2,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: PlanFeature[];
  popular?: boolean;
  forRole: 'founder' | 'investor' | 'both';
}

const plans: PricingPlan[] = [
  {
    id: 'founder-basic',
    name: 'Founder Basic',
    description: 'Essential tools for early-stage startups looking to get discovered',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      { name: 'Company profile', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Up to 2 active deal rooms', included: true },
      { name: 'Community forum access', included: true },
      { name: 'AI-powered pitch feedback', included: false },
      { name: 'Investor matching', included: false },
      { name: 'Advanced analytics', included: false },
      { name: 'Priority support', included: false },
    ],
    forRole: 'founder',
  },
  {
    id: 'founder-pro',
    name: 'Founder Pro',
    description: 'Advanced features to accelerate fundraising and growth',
    price: 99,
    billingPeriod: 'monthly',
    features: [
      { name: 'Everything in Basic', included: true },
      { name: 'AI-powered pitch feedback', included: true },
      { name: 'Investor matching', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Unlimited deal rooms', included: true },
      { name: 'Priority listing', included: true },
      { name: 'Priority support', included: true },
      { name: 'Investor intro requests (5/month)', included: true },
    ],
    popular: true,
    forRole: 'founder',
  },
  {
    id: 'investor-basic',
    name: 'Investor Basic',
    description: 'Discovery tools for angel investors and small VCs',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      { name: 'Investor profile', included: true },
      { name: 'Browse startups', included: true },
      { name: 'Up to 3 active deal rooms', included: true },
      { name: 'Basic deal flow management', included: true },
      { name: 'AI startup screening', included: false },
      { name: 'Advanced filters', included: false },
      { name: 'Market insights', included: false },
      { name: 'Investment analytics', included: false },
    ],
    forRole: 'investor',
  },
  {
    id: 'investor-pro',
    name: 'Investor Pro',
    description: 'Comprehensive suite for professional investors',
    price: 149,
    billingPeriod: 'monthly',
    features: [
      { name: 'Everything in Basic', included: true },
      { name: 'AI startup screening and scoring', included: true },
      { name: 'Advanced filters and search', included: true },
      { name: 'Market insights and trends', included: true },
      { name: 'Unlimited deal rooms', included: true },
      { name: 'Investment analytics', included: true },
      { name: 'Priority access to demo days', included: true },
      { name: 'Founder direct messaging', included: true },
    ],
    popular: true,
    forRole: 'investor',
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [yearlyDiscount] = useState(20); // 20% discount for yearly billing
  const [processingPayment, setProcessingPayment] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Calculate price with yearly discount applied
  const getDiscountedPrice = (price: number) => {
    if (billingPeriod === 'yearly') {
      return price * 12 * (1 - yearlyDiscount / 100);
    }
    return price;
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Filter plans relevant to the user's role
  const relevantPlans = plans.filter(
    plan => plan.forRole === role || plan.forRole === 'both'
  );

  // Handle subscription checkout
  const handleCheckout = (plan: PricingPlan) => {
    setProcessingPayment(true);

    // In a real implementation, we would call the API
    // For demo purposes, we'll just redirect to a checkout page
    setTimeout(() => {
      router.push(`/payment/checkout?plan=${plan.id}&price=${plan.price}&subscription=true`);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the right plan to accelerate your {role === 'founder' ? 'fundraising journey' : 'investment strategy'}
          with our AI-powered tools and expert community.
        </p>

        {/* Billing period toggle */}
        <div className="flex justify-center mt-6">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              className={`px-4 py-2 text-sm rounded-md ${
                billingPeriod === 'monthly'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingPeriod('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-md flex items-center ${
                billingPeriod === 'yearly'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setBillingPeriod('yearly')}
            >
              Yearly
              <span className="ml-1 bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
                Save {yearlyDiscount}%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {relevantPlans.map((plan) => {
          const price = getDiscountedPrice(plan.price);

          return (
            <div
              key={plan.id}
              className={`border rounded-xl overflow-hidden ${
                plan.popular
                  ? 'border-blue-200 shadow-md relative'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                    Popular choice
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                  </div>
                  {plan.popular && (
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>

                <div className="mt-5">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{formatPrice(price)}</span>
                    <span className="text-gray-500 ml-2">
                      {billingPeriod === 'monthly' ? '/month' : '/year'}
                    </span>
                  </div>

                  {plan.price === 0 ? (
                    <p className="text-sm text-gray-500 mt-1">No credit card required</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      {billingPeriod === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                    </p>
                  )}
                </div>

                <Button
                  className={`w-full mt-6 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  disabled={processingPayment}
                  onClick={() => handleCheckout(plan)}
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : plan.price === 0 ? (
                    'Get Started'
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Subscribe Now
                    </>
                  )}
                </Button>

                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                          feature.included ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {feature.included ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <div className="h-1 w-1 bg-gray-400 rounded-full" />
                          )}
                        </div>
                        <span className={`ml-2 text-sm ${
                          feature.included ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="font-medium">Can I upgrade or downgrade my plan later?</h3>
              <ChevronsUpDown className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              Yes, you can upgrade or downgrade your plan at any time. Changes to your plan will take effect immediately, and any price differences will be prorated.
            </p>
          </div>

          <div className="border-b pb-4">
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="font-medium">What payment methods are accepted?</h3>
              <ChevronsUpDown className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              We accept all major credit cards, debit cards, and local payment methods through Paystack. Bank transfers are also available for annual subscriptions.
            </p>
          </div>

          <div className="border-b pb-4">
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="font-medium">Is there a refund policy?</h3>
              <ChevronsUpDown className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              If you're not satisfied with your subscription, you can cancel within the first 14 days for a full refund. After that, you can cancel anytime but refunds are not provided for partial months.
            </p>
          </div>

          <div className="border-b pb-4">
            <div className="flex justify-between items-center cursor-pointer">
              <h3 className="font-medium">Do you offer special pricing for accelerators or incubators?</h3>
              <ChevronsUpDown className="h-4 w-4 text-gray-500" />
            </div>
            <p className="text-gray-600 mt-2 text-sm">
              Yes, we offer special bulk pricing for accelerators, incubators, and investment firms. Please contact our sales team for more information.
            </p>
          </div>
        </div>
      </div>

      {/* Need help box */}
      <div className="mt-16 max-w-3xl mx-auto bg-blue-50 rounded-xl p-6 text-center">
        <HelpCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium mb-2">Need help choosing the right plan?</h3>
        <p className="text-gray-600 mb-4">
          Our team is here to help you select the best plan for your specific needs.
        </p>
        <Button variant="outline">
          Schedule a Consultation
        </Button>
      </div>
    </div>
  );
}