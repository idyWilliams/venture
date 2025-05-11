"use client";

import { ReactNode } from 'react';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import NavigationBar from '@/src/components/ui/navigation-bar';
import { useUserRole } from '@/src/contexts/UserRoleContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <main>
        {children}
      </main>
    </div>
  );
}