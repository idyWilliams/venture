"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import {
  Briefcase, TrendingUp, Building, BarChart3,
  Users, Search, LineChart, Award, Filter,
  BookOpen, Settings, FileText, Clock, Heart, MessageSquare
} from 'lucide-react';
import { useUserRole } from '@/src/contexts/UserRoleContext';

// Mock data - would be fetched from API in real app
const mockPortfolio = [
  {
    id: '1',
    title: 'Green Energy Storage Solution',
    description: 'Revolutionary battery technology for renewable energy storage systems.',
    fundingStage: 'Seed',
    industry: 'CleanTech',
    investment: { amount: 250000, equity: 5, date: '2023-09-15' }
  },
  {
    id: '2',
    title: 'AI-Driven Healthcare Assistant',
    description: 'Personalized patient care recommendation system using advanced ML algorithms.',
    fundingStage: 'Series A',
    industry: 'HealthTech',
    investment: { amount: 500000, equity: 3, date: '2023-11-20' }
  }
];

const mockStats = {
  totalInvested: 750000,
  investedChange: 32,
  activeDeals: 3,
  activeDealsChange: 1,
  potentialROI: 420,
  portfolioCompanies: 2
};

const mockRecommendedProjects = [
  {
    id: '3',
    title: 'Sustainable Packaging Platform',
    description: 'B2B marketplace connecting brands with eco-friendly packaging suppliers.',
    fundingStage: 'Pre-seed',
    industry: 'Sustainability',
    aiMatchScore: 92,
    founder: 'Sarah Johnson',
    company: 'EcoPack'
  },
  {
    id: '4',
    title: 'Smart Home Energy Management',
    description: 'IoT solution for optimizing home energy consumption and integrating renewable sources.',
    fundingStage: 'Seed',
    industry: 'CleanTech',
    aiMatchScore: 89,
    founder: 'Michael Chen',
    company: 'EnergyFlow'
  },
  {
    id: '5',
    title: 'Precision Agriculture Drone System',
    description: 'Drone and AI platform for precision farming, reducing water and pesticide usage.',
    fundingStage: 'Seed',
    industry: 'AgTech',
    aiMatchScore: 85,
    founder: 'Diego Mendez',
    company: 'AgroSky'
  }
];

const mockRecentActivity = [
  { id: '1', type: 'view', content: 'You viewed Sustainable Packaging Platform project', time: '2 hours ago' },
  { id: '2', type: 'like', content: 'You saved Smart Home Energy Management to your watchlist', time: '1 day ago' },
  { id: '3', type: 'comment', content: 'You commented on Precision Agriculture Drone System', time: '2 days ago' },
  { id: '4', type: 'contact', content: 'You requested contact with EcoPack founder', time: '3 days ago' }
];

const mockIndustryTrends = [
  { industry: 'CleanTech', deals: 145, avgDealSize: '2.3M', trend: '+12%' },
  { industry: 'HealthTech', deals: 132, avgDealSize: '3.1M', trend: '+8%' },
  { industry: 'FinTech', deals: 98, avgDealSize: '4.2M', trend: '+5%' },
  { industry: 'EdTech', deals: 67, avgDealSize: '1.9M', trend: '+15%' }
];

export default function InvestorDashboard() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();

  // Check if user is authenticated and has the right role
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (role !== 'investor') {
      // If authenticated but not an investor, redirect to appropriate dashboard
      if (role === 'founder') {
        router.push('/founder/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, role, router]);

  // If not authenticated or not the right role, don't render the dashboard
  if (!isAuthenticated || role !== 'investor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Investor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your investments, discover new opportunities, and connect with founders
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
                  <p className="text-sm font-medium text-gray-500">Total Invested</p>
                  <p className="text-2xl font-bold">${(mockStats.totalInvested/1000).toFixed(0)}K</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-xs font-medium ${mockStats.investedChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockStats.investedChange >= 0 ? '+' : ''}{mockStats.investedChange}%
                </span>
                <span className="text-xs text-gray-500 ml-1">from last year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Deals</p>
                  <p className="text-2xl font-bold">{mockStats.activeDeals}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <Building className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-xs font-medium ${mockStats.activeDealsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mockStats.activeDealsChange >= 0 ? '+' : ''}{mockStats.activeDealsChange}
                </span>
                <span className="text-xs text-gray-500 ml-1">new this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Potential ROI</p>
                  <p className="text-2xl font-bold">{mockStats.potentialROI}%</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">Projected 5-year return</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">AI Match Quality</p>
                  <p className="text-2xl font-bold">93/100</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-full">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">Based on your investment criteria</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Portfolio & Deal flow */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="portfolio" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="dealflow">Deal Flow</TabsTrigger>
                <TabsTrigger value="market">Market Intelligence</TabsTrigger>
              </TabsList>

              <TabsContent value="portfolio">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Your Portfolio ({mockPortfolio.length})</h2>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <div className="grid gap-4">
                  {mockPortfolio.map(project => (
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
                            <div className="text-right mb-2">
                              <p className="font-medium text-gray-900">${(project.investment.amount/1000).toFixed(0)}K invested</p>
                              <p className="text-sm text-gray-500">{project.investment.equity}% equity</p>
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

              <TabsContent value="recommended">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">AI-Recommended Projects</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <Button size="sm">
                      <Search className="h-4 w-4 mr-2" />
                      Browse All
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {mockRecommendedProjects.map(project => (
                    <Card key={project.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{project.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                            <div className="flex items-center mt-2">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">{project.founder}</span> • {project.company}
                              </p>
                            </div>
                            <div className="flex items-center mt-2 space-x-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {project.fundingStage}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {project.industry}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="mb-2 flex items-center space-x-2">
                              <span className="text-sm font-medium">Match Score:</span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {project.aiMatchScore}%
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button size="sm">
                                Contact
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="dealflow">
                <Card>
                  <CardHeader>
                    <CardTitle>Deal Pipeline</CardTitle>
                    <CardDescription>
                      Track and manage your investment opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-md">
                      <div className="text-center">
                        <Briefcase className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">Your deal pipeline visualization would appear here</p>
                        <Button variant="outline" className="mt-4">
                          Set Up Deal Flow Tracking
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market">
                <Card>
                  <CardHeader>
                    <CardTitle>Industry Trends</CardTitle>
                    <CardDescription>
                      Latest investment data across sectors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-3 py-3 text-left font-medium text-gray-500">Industry</th>
                            <th className="px-3 py-3 text-left font-medium text-gray-500">Deals (YTD)</th>
                            <th className="px-3 py-3 text-left font-medium text-gray-500">Avg Deal Size</th>
                            <th className="px-3 py-3 text-left font-medium text-gray-500">YoY Trend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockIndustryTrends.map((trend, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="px-3 py-3 font-medium">{trend.industry}</td>
                              <td className="px-3 py-3">{trend.deals}</td>
                              <td className="px-3 py-3">${trend.avgDealSize}</td>
                              <td className="px-3 py-3 text-green-600">{trend.trend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <Button variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Activity, Insights & Actions */}
          <div className="space-y-8">
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

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">AI Investment Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Portfolio Insight:</span> Your CleanTech investments are outperforming market benchmarks by 14%.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-md">
                    <p className="text-sm text-amber-700">
                      <span className="font-medium">Trend Alert:</span> Significant growth in AgTech startups focusing on water conservation technologies.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Opportunity:</span> Based on your criteria, consider exploring investments in carbon capture technologies.
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    Get Personalized Insights
                  </Button>
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
                    <Search className="h-5 w-5 mb-1" />
                    <span className="text-sm">Browse Projects</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                    <MessageSquare className="h-5 w-5 mb-1" />
                    <span className="text-sm">Messages</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center p-4 h-auto">
                    <BookOpen className="h-5 w-5 mb-1" />
                    <span className="text-sm">Due Diligence</span>
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