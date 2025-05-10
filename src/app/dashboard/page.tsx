"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/contexts/UserRoleContext';
import { QuickActions } from '@/components/ui/quick-actions';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Bell,
  Building,
  Calendar,
  CircleDollarSign,
  FileText,
  MessageSquare,
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import CreateDealRoomModal from '@/components/deal-room/CreateDealRoomModal';

export default function Dashboard() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();
  
  const isFounder = role === 'founder';
  const isInvestor = role === 'investor';

  // Mock stats data - in a real app, this would come from the API
  const founderStats = {
    projectViews: 346,
    viewsChange: 12.5,
    contactRequests: 8,
    contactRequestsChange: 50,
    messages: 14,
    recentInvestors: [
      { id: '1', name: 'Jane Investor', company: 'VC Capital', viewedAt: '2025-04-12T10:23:00Z' },
      { id: '2', name: 'Robert Angel', company: 'Angel Investments', viewedAt: '2025-04-10T16:45:00Z' },
      { id: '3', name: 'Sarah Smith', company: 'Tech Ventures', viewedAt: '2025-04-09T09:15:00Z' },
    ],
    dealRooms: 2,
  };
  
  const investorStats = {
    discoveredProjects: 125,
    savedProjects: 17,
    contactedFounders: 5,
    openDealRooms: 3,
    upcomingMeetings: 2,
    recommendedProjects: [
      { id: '1', title: 'EcoSolutions', industry: 'CleanTech', matchScore: 92 },
      { id: '2', title: 'FinanceAI', industry: 'FinTech', matchScore: 88 },
      { id: '3', title: 'HealthMonitor', industry: 'HealthTech', matchScore: 85 },
    ],
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, {isFounder ? 'Founder' : 'Investor'}
        </h1>
        {isFounder ? (
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/projects/create">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Link>
          </Button>
        ) : (
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/projects">
              <Plus className="w-4 h-4 mr-2" />
              Discover Projects
            </Link>
          </Button>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Overview Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <h2 className="text-lg font-medium mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isFounder ? (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 text-sm">Project Views</span>
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{founderStats.projectViews}</p>
                    <p className="text-xs text-green-600 mt-1">↑ {founderStats.viewsChange}% this week</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 text-sm">Contact Requests</span>
                      <Users className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{founderStats.contactRequests}</p>
                    <p className="text-xs text-green-600 mt-1">↑ {founderStats.contactRequestsChange}% this week</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-800 text-sm">Deal Rooms</span>
                      <Building className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{founderStats.dealRooms}</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-800 text-sm">Messages</span>
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{founderStats.messages}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 text-sm">Discovered</span>
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{investorStats.discoveredProjects}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 text-sm">Saved</span>
                      <FileText className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{investorStats.savedProjects}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-800 text-sm">Deal Rooms</span>
                      <Building className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{investorStats.openDealRooms}</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-800 text-sm">Meetings</span>
                      <Calendar className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-semibold mt-2">{investorStats.upcomingMeetings}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Recent Activity</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {isFounder ? (
                founderStats.recentInvestors.map((investor) => (
                  <div key={investor.id} className="flex items-center p-3 rounded-md border hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="text-sm font-medium">{investor.name} from {investor.company} viewed your project</p>
                      <p className="text-xs text-gray-500">{new Date(investor.viewedAt).toLocaleString()}</p>
                    </div>
                    <Button variant="outline" size="sm">Contact</Button>
                  </div>
                ))
              ) : (
                investorStats.recommendedProjects.map((project) => (
                  <div key={project.id} className="flex items-center p-3 rounded-md border hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="text-sm font-medium">{project.title} - {project.industry}</p>
                      <p className="text-xs text-gray-500">Match score: {project.matchScore}%</p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Notifications</h2>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
                <p className="text-sm">Your project received a new contact request</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 rounded-md bg-gray-50 border">
                <p className="text-sm">New message in Deal Room: EcoSolutions</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday</p>
              </div>
              <div className="p-3 rounded-md bg-gray-50 border">
                <p className="text-sm">Your analytics report is ready</p>
                <p className="text-xs text-gray-500 mt-1">2 days ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-3">
              View All Notifications
            </Button>
          </div>

          {/* Deal Rooms */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Active Deal Rooms</h2>
              <CreateDealRoomModal trigger={
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              } />
            </div>
            <div className="space-y-3">
              <Link 
                href="/deal-rooms/dr-1" 
                className="block p-3 rounded-md border hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">EcoSolutions Project</h3>
                    <p className="text-sm text-gray-600">
                      With {isFounder ? 'Jane (Investor)' : 'John (Founder)'}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    In Negotiation
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Last activity: 3 hours ago</p>
              </Link>
              
              <Link 
                href="/deal-rooms/dr-2" 
                className="block p-3 rounded-md border hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">FinanceAI Platform</h3>
                    <p className="text-sm text-gray-600">
                      With {isFounder ? 'Robert (Investor)' : 'Emma (Founder)'}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Last activity: 1 day ago</p>
              </Link>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-3" asChild>
              <Link href="/deal-rooms">View All Deal Rooms</Link>
            </Button>
          </div>

          {/* Subscription Info */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Subscription</h2>
              <CircleDollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
              <div className="flex justify-between items-center">
                <p className="font-medium">{isFounder ? 'Founder' : 'Investor'} Pro</p>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {isFounder ? 'Unlimited projects, AI analytics, Deal rooms' : 'Advanced search, AI insights, Analytics'}
              </p>
              <div className="mt-3">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/pricing">Manage Subscription</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
