"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiMutation } from '@/hooks/useApi';
import { useUserRole } from '@/contexts/UserRoleContext';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

// Define the props for the PaymentForm component
interface PaymentFormProps {
  amount: number;
  planName: string;
  description: string;
  isSubscription?: boolean;
  onSuccess?: (reference: string) => void;
  onError?: (error: any) => void;
}

export default function PaymentForm({
  amount,
  planName,
  description,
  isSubscription = false,
  onSuccess,
  onError
}: PaymentFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isAuthenticated, role } = useUserRole();

  // Mutation for initializing payment
  const initPaymentMutation = useApiMutation<{
    authorizationUrl: string;
    reference: string;
    accessCode: string;
  }, {
    email: string;
    amount: number;
    metadata?: Record<string, any>;
  }>('post', '/api/payment/initialize', {
    onSuccess: (data) => {
      // Redirect to Paystack's checkout page
      window.location.href = data.authorizationUrl;
      
      // Store reference in localStorage for verification later
      localStorage.setItem('paymentReference', data.reference);
      
      if (onSuccess) {
        onSuccess(data.reference);
      }
    },
    onError: (error) => {
      setError('Payment initialization failed. Please try again.');
      console.error('Payment error:', error);
      
      if (onError) {
        onError(error);
      }
    }
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Simple email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Initialize payment
    initPaymentMutation.mutate({
      email,
      amount,
      metadata: {
        planName,
        description,
        isSubscription,
        userRole: role
      }
    });
  };

  // Check if a payment reference exists in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    
    if (reference) {
      // Verify payment if reference exists
      verifyPayment(reference);
    }
  }, []);

  // Verify payment after redirect from Paystack
  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Payment successful! Thank you for your purchase.');
        localStorage.removeItem('paymentReference');
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Payment verification failed. Please contact support.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{planName}</h2>
      <p className="mb-4 text-gray-600">{description}</p>
      <div className="text-3xl font-bold mb-6">₦{amount.toLocaleString()}</div>
      
      {success ? (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          {success}
        </div>
      ) : error ? (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={initPaymentMutation.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex justify-center items-center"
        >
          {initPaymentMutation.isPending ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            `Pay ₦${amount.toLocaleString()}`
          )}
        </button>
      </form>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Secured by Paystack. Your payment information is secure.
      </div>
    </div>
  );
}