"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  
  const tiers = [
    {
      name: 'Founder',
      id: 'tier-founder',
      description: 'Perfect for startup founders looking to connect with investors',
      features: [
        'Create up to 3 projects',
        'AI-powered pitch analysis',
        'Basic engagement analytics',
        'Community forum access',
        'Email support',
      ],
      price: annual ? 19 : 29,
      cta: 'Start Free Trial',
      mostPopular: false,
    },
    {
      name: 'Founder Pro',
      id: 'tier-founder-pro',
      description: 'For founders serious about fundraising and growth',
      features: [
        'Create unlimited projects',
        'Advanced AI analytics & insights',
        'Investor matching recommendations',
        'Deal room access',
        'Expert feedback (1/month)',
        'Priority investor introductions',
        'Phone & email support',
      ],
      price: annual ? 49 : 69,
      cta: 'Start Free Trial',
      mostPopular: true,
    },
    {
      name: 'Investor',
      id: 'tier-investor',
      description: 'For angel investors and venture capitalists',
      features: [
        'Access to all startup projects',
        'AI-powered deal flow analysis',
        'Advanced filtering & search',
        'Unlimited deal rooms',
        'Portfolio management tools',
        'Regular startup recommendations',
        'Priority support',
      ],
      price: annual ? 99 : 149,
      cta: 'Start Free Trial',
      mostPopular: false,
    },
    {
      name: 'Accelerator',
      id: 'tier-accelerator',
      description: 'For accelerators, incubators, and VC firms',
      features: [
        'Custom branded portal',
        'Unlimited team members',
        'Applicant management system',
        'Advanced analytics dashboard',
        'Batch management tools',
        'Portfolio company tracking',
        'API access',
        'Dedicated account manager',
      ],
      price: 'Custom',
      cta: 'Contact Sales',
      mostPopular: false,
      custom: true,
    },
  ];

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">Simple,</span>{' '}
            <span className="block text-blue-600 xl:inline">transparent pricing</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Choose the plan that's right for you and start connecting with the right people
          </p>
        </div>

        <div className="mt-10 sm:mt-12">
          <div className="flex justify-center">
            <div className="relative rounded-full p-1 bg-gray-200 flex">
              <button
                type="button"
                className={`relative py-2 px-6 text-sm font-medium ${
                  !annual ? 'bg-white rounded-full shadow-sm text-gray-900' : 'text-gray-700'
                }`}
                onClick={() => setAnnual(false)}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`relative py-2 px-6 text-sm font-medium ${
                  annual ? 'bg-white rounded-full shadow-sm text-gray-900' : 'text-gray-700'
                }`}
                onClick={() => setAnnual(true)}
              >
                Annual <span className="text-blue-600 font-bold">(Save 20%)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-4 lg:gap-5">
          {tiers.map((tier) => (
            <div key={tier.id} className="relative flex flex-col">
              <Card
                className={`flex flex-col h-full ${
                  tier.mostPopular
                    ? 'ring-2 ring-blue-600 shadow-lg scale-105 z-10'
                    : 'border border-gray-200'
                }`}
              >
                {tier.mostPopular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-0.5 text-sm font-medium text-white">
                      Most popular
                    </span>
                  </div>
                )}
                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900">{tier.name}</CardTitle>
                  <CardDescription className="mt-2">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-8">
                    {tier.custom ? (
                      <div className="flex items-baseline justify-center text-5xl font-extrabold text-gray-900">
                        {tier.price}
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-center text-5xl font-extrabold text-gray-900">
                        ${tier.price}
                        <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
                      </div>
                    )}
                    {annual && !tier.custom && (
                      <p className="mt-1 text-sm text-center text-green-600">
                        Billed annually (${(tier.price * 12).toFixed(0)}/year)
                      </p>
                    )}
                  </div>
                  <ul className="space-y-4 text-left">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/auth/register" className="w-full">
                    <Button
                      className={`w-full ${
                        tier.mostPopular ? 'bg-blue-600 hover:bg-blue-700' : ''
                      }`}
                      variant={tier.mostPopular ? 'default' : 'outline'}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-blue-600 px-6 py-10 sm:py-12 sm:px-12 lg:flex lg:items-center lg:py-16 lg:px-20">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Enterprise solutions
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-blue-100">
              Looking for a custom solution for your organization? We offer tailored enterprise plans with additional features, dedicated support, and custom integrations.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <div className="sm:flex">
              <Link href="/contact" className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 sm:flex-shrink-0">
                Contact our sales team
              </Link>
            </div>
            <p className="mt-3 text-sm text-blue-100">
              Get a custom quote tailored to your needs within 24 hours.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                question: "What's included in the free trial?",
                answer: "Our 14-day free trial includes all features of the selected plan, giving you full access to test the platform before committing. No credit card required to start.",
              },
              {
                question: "Can I switch plans later?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, changes take effect at the end of your current billing period.",
              },
              {
                question: "Do you offer discounts for startups?",
                answer: "Yes! We offer special pricing for early-stage startups that are pre-seed or participating in recognized accelerator programs. Contact us for more details.",
              },
              {
                question: "How do investor verifications work?",
                answer: "To maintain a high-quality network, we verify all investor accounts. The process typically takes 1-2 business days and may require proof of previous investments or professional credentials.",
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your current billing period.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and wire transfers for annual enterprise plans.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-t border-gray-200 pt-6">
                <dt className="text-lg font-medium text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}