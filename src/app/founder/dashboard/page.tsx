"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import {
  Briefcase, TrendingUp, BriefcaseBusiness,
  Users, MessageSquare, LineChart, Award,
  PlusCircle, Settings, FileText, Clock
} from 'lucide-react';
import { useUserRole } from '@/src/contexts/UserRoleContext';

// Mock data - would be fetched from API in real app
const mockProjects = [
  {
    id: '1',
    title: 'Green Energy Storage Solution',
    description: 'Revolutionary battery technology for renewable energy storage systems.',
    fundingStage: 'Seed',
    industry: 'CleanTech',
    engagement: { views: 245, likes: 32, comments: 12 }
  },
  {
    id: '2',
    title: 'AI-Driven Healthcare Assistant',
    description: 'Personalized patient care recommendation system using advanced ML algorithms.',
    fundingStage: 'Series A',
    industry: 'HealthTech',
    engagement: { views: 178, likes: 27, comments: 8 }
  },
  {
    id: '3',
    title: 'Sustainable Packaging Platform',
    description: 'B2B marketplace connecting brands with eco-friendly packaging suppliers.',
    fundingStage: 'Pre-seed',
    industry: 'Sustainability',
    engagement: { views: 92, likes: 14, comments: 5 }
  }
];

const mockMetrics = {
  totalViews: 767,
  viewsChange: 23,
  totalLikes: 98,
  likesChange: 15,
  totalInvestorRequests: 7,
  investorRequestsChange: 3,
  matchScore: 82,
  pitchScore: 78
};

const mockInvestorMatches = [
  { id: '1', name: 'Horizon Ventures', interest: 'High', matchScore: 92, industry: 'CleanTech', status: 'New' },
  { id: '2', name: 'BlueSky Capital', interest: 'Medium', matchScore: 87, industry: 'HealthTech', status: 'Contacted' },
  { id: '3', name: 'GreenField Investments', interest: 'High', matchScore: 85, industry: 'Sustainability', status: 'Meeting' },
  { id: '4', name: 'Nova Partners', interest: 'Medium', matchScore: 79, industry: 'CleanTech', status: 'New' }
];

const mockRecentActivity = [
  { id: '1', type: 'view', content: 'GreenField Investments viewed your Green Energy Storage Solution project', time: '2 hours ago' },
  { id: '2', type: 'like', content: 'BlueSky Capital liked your AI-Driven Healthcare Assistant project', time: '1 day ago' },
  { id: '3', type: 'comment', content: 'Nova Partners commented on your Sustainable Packaging Platform project', time: '2 days ago' },
  { id: '4', type: 'contact', content: 'Horizon Ventures requested to connect about your Green Energy Storage Solution project', time: '3 days ago' }
];

export default function FounderDashboard() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();

  // Check if user is authenticated and has the right role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (role !== 'founder') {
      // If authenticated but not a founder, redirect to appropriate dashboard
      if (role === 'investor') {
        router.push('/investor/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, role, router]);

  // If not authenticated or not the right role, don't render the dashboard
  if (!isAuthenticated || role !== 'founder') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Founder Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your projects, track engagement, and connect with investors
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Views</p>
                  <p className="text-2xl font-bold">{mockMetrics.totalViews}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-xs font-medium ${mockMetrics.viewsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockMetrics.viewsChange >= 0 ? '+' : ''}{mockMetrics.viewsChange}%
                </span>
                <span className="text-xs text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Likes</p>
                  <p className="text-2xl font-bold">{mockMetrics.totalLikes}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-xs font-medium ${mockMetrics.likesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockMetrics.likesChange >= 0 ? '+' : ''}{mockMetrics.likesChange}%
                </span>
                <span className="text-xs text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Investor Requests</p>
                  <p className="text-2xl font-bold">{mockMetrics.totalInvestorRequests}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-full">
                  <BriefcaseBusiness className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-xs font-medium ${mockMetrics.investorRequestsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockMetrics.investorRequestsChange >= 0 ? '+' : ''}{mockMetrics.investorRequestsChange}
                </span>
                <span className="text-xs text-gray-500 ml-1">new requests</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">AI Match Score</p>
                  <p className="text-2xl font-bold">{mockMetrics.matchScore}/100</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-full">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">Pitch Deck Score: {mockMetrics.pitchScore}/100</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Projects & Analytics */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="projects" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="projects">My Projects</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="dealrooms">Deal Rooms</TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Your Projects</h2>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add New Project
                  </Button>
                </div>

                <div className="grid gap-4">
                  {mockProjects.map(project => (
                    <Card key={project.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{project.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                            <div className="flex items-center mt-3 space-x-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {project.fundingStage}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {project.industry}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex space-x-3 text-gray-500 text-sm mb-2">
                              <span className="flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {project.engagement.views}
                              </span>
                              <span className="flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {project.engagement.likes}
                              </span>
                              <span className="flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                {project.engagement.comments}
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Analytics</CardTitle>
                    <CardDescription>
                      View detailed metrics and insights for your projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
                      <div className="text-center">
                        <LineChart className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Analytics visualizations would appear here</p>
                        <Link href="/analytics/dashboard">
                          <Button variant="outline" className="mt-4">
                            Go to Full Analytics Dashboard
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dealrooms">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Deal Rooms</CardTitle>
                    <CardDescription>
                      Secure spaces for negotiating with interested investors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">You don't have any active deal rooms yet</p>
                    <Button variant="outline">Create Deal Room</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Investor matches & Activity */}
          <div className="space-y-8">
            {/* Investor Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">AI Investor Matches</CardTitle>
                <CardDescription>
                  Potential investors matched to your projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInvestorMatches.map(investor => (
                    <div key={investor.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{investor.name}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <span className="mr-2">{investor.industry}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            investor.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            investor.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {investor.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">{investor.matchScore}%</p>
                        <p className="text-xs text-gray-500">match score</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="link">View All Matches</Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`mt-0.5 p-1.5 rounded-full ${
                        activity.type === 'view' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'like' ? 'bg-pink-100 text-pink-600' :
                        activity.type === 'comment' ? 'bg-purple-100 text-purple-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {activity.type === 'view' ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : activity.type === 'like' ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        ) : activity.type === 'comment' ? (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm">{activity.content}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="link">View All Activity</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                    <PlusCircle className="h-5 w-5 mb-1" />
                    <span className="text-sm">New Project</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                    <FileText className="h-5 w-5 mb-1" />
                    <span className="text-sm">Upload Pitch</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-sm">Find Investors</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                    <Settings className="h-5 w-5 mb-1" />
                    <span className="text-sm">Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}