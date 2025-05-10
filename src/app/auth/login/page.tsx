"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserRole } from '@/contexts/UserRoleContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'FOUNDER' | 'INVESTOR'>('FOUNDER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { setRole: setGlobalRole, setIsAuthenticated } = useUserRole();
  
  // Redirect if already logged in
  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          if (role === 'FOUNDER') {
            router.push('/founder/dashboard');
          } else {
            router.push('/investor/dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuth();
  }, [router, role]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // For demo purposes, just simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set authenticated state and role
      setGlobalRole(role);
      setIsAuthenticated(true);
      
      // Redirect to appropriate dashboard
      if (role === 'FOUNDER') {
        router.push('/founder/dashboard');
      } else {
        router.push('/investor/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
            <CardDescription>
              Enter your details below to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Account Type</Label>
                <RadioGroup 
                  defaultValue={role} 
                  onValueChange={(value) => setRole(value as 'FOUNDER' | 'INVESTOR')}
                  className="flex space-x-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FOUNDER" id="founder" />
                    <Label htmlFor="founder">Founder</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="INVESTOR" id="investor" />
                    <Label htmlFor="investor">Investor</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {error && (
                <div className="bg-red-50 p-3 rounded-md text-sm text-red-600">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              <div className="text-sm text-center text-gray-500">
                Don't have an account? <Link href="/auth/register" className="text-blue-600 hover:underline">Sign Up</Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
      
      {/* Right Column - Hero */}
      <div className="hidden lg:block lg:flex-1 bg-blue-600 text-white">
        <div className="flex flex-col justify-center h-full p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-4">VentureHive Pro</h1>
            <p className="text-xl text-blue-100 mb-8">
              Where Startups Meet Smart Capital With Full Engagement
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                AI-powered investor matching
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Advanced analytics dashboard
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Secure deal rooms
              </li>
              <li className="flex items-center">
                <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Pitch deck analysis and feedback
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}