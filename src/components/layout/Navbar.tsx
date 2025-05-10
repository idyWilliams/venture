"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/contexts/UserRoleContext';

export default function Navbar() {
  const { role, isAuthenticated, setRole, setIsAuthenticated } = useUserRole();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // For demo purposes, let's add a way to toggle between roles
  // In a real app, this would come from the authentication system
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/founder/')) {
      setRole('FOUNDER');
      setIsAuthenticated(true);
    } else if (path.includes('/investor/')) {
      setRole('INVESTOR');
      setIsAuthenticated(true);
    }
  }, [setRole, setIsAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">VentureHive Pro</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {!isAuthenticated && (
              <>
                <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link href="/features" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  Features
                </Link>
                <Link href="/pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  Pricing
                </Link>
                <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  About
                </Link>
                <Link href="/contact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                  Contact
                </Link>
              </>
            )}
            
            {/* These links are shown regardless of auth state */}
            <Link href="/projects" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              Discover
            </Link>
            <Link href="/matchmaking" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
              AI Matchmaking
            </Link>
            {isAuthenticated ? (
              <>
                {role === 'FOUNDER' ? (
                  <>
                    <Link href="/founder/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                      Founder Dashboard
                    </Link>
                    <Link href="/analytics/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                      Analytics
                    </Link>
                  </>
                ) : role === 'INVESTOR' ? (
                  <>
                    <Link href="/investor/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                      Investor Dashboard
                    </Link>
                    <Link href="/projects" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                      Browse Projects
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                )}
                <Button 
                  variant="ghost"
                  onClick={() => {
                    // Handle logout
                    setRole(null);
                    setIsAuthenticated(false);
                    router.push('/');
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAuthenticated && (
              <>
                <Link 
                  href="/" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/features" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/pricing" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link 
                  href="/about" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </>
            )}
            
            {/* These links are always shown */}
            <Link 
              href="/projects" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
            <Link 
              href="/matchmaking" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Matchmaking
            </Link>
            {isAuthenticated ? (
              <>
                {role === 'FOUNDER' ? (
                  <>
                    <Link 
                      href="/founder/dashboard" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Founder Dashboard
                    </Link>
                    <Link 
                      href="/analytics/dashboard" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Analytics
                    </Link>
                  </>
                ) : role === 'INVESTOR' ? (
                  <>
                    <Link 
                      href="/investor/dashboard" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Investor Dashboard
                    </Link>
                    <Link 
                      href="/projects" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Browse Projects
                    </Link>
                  </>
                ) : (
                  <Link 
                    href="/dashboard" 
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => {
                    // Handle logout
                    setIsMenuOpen(false);
                    setRole(null);
                    setIsAuthenticated(false);
                    router.push('/');
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
