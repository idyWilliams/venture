'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import NotificationList from '@/components/notifications/NotificationList';
import ProjectCard from '@/components/project/ProjectCard';

// Mock data - in a real app, this would come from API calls
const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Healthcare Assistant',
    description: 'A mobile app that uses artificial intelligence to provide personalized healthcare recommendations and monitoring.',
    industry: 'Healthcare',
    fundingStage: 'Seed',
    founderName: 'John Smith',
    founderCompany: 'HealthTech AI',
    createdAt: '2023-05-15T00:00:00.000Z',
    updatedAt: '2023-05-15T00:00:00.000Z',
    fundingAmount: 500000,
    equity: 10,
    logo: null
  },
  {
    id: '2',
    title: 'Sustainable Supply Chain Platform',
    description: 'A blockchain-based platform that tracks and verifies sustainability metrics across global supply chains.',
    industry: 'Supply Chain',
    fundingStage: 'Series A',
    founderName: 'Lisa Wong',
    founderCompany: 'GreenChain',
    createdAt: '2023-04-10T00:00:00.000Z',
    updatedAt: '2023-04-10T00:00:00.000Z',
    fundingAmount: 2000000,
    equity: 15,
    logo: null
  },
  {
    id: '3',
    title: 'Decentralized Finance Aggregator',
    description: 'A platform that aggregates decentralized finance protocols to provide users with the best yields and opportunities.',
    industry: 'FinTech',
    fundingStage: 'Pre-seed',
    founderName: 'Michael Johnson',
    founderCompany: 'DeFiAgg',
    createdAt: '2023-06-01T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z',
    fundingAmount: 250000,
    equity: 8,
    logo: null
  }
];

const mockSavedProjects = [
  {
    id: '1',
    title: 'AI-Powered Healthcare Assistant',
    description: 'A mobile app that uses artificial intelligence to provide personalized healthcare recommendations and monitoring.',
    industry: 'Healthcare',
    fundingStage: 'Seed',
    founderName: 'John Smith',
    founderCompany: 'HealthTech AI',
    createdAt: '2023-05-15T00:00:00.000Z',
    updatedAt: '2023-05-15T00:00:00.000Z',
    fundingAmount: 500000,
    equity: 10,
    logo: null
  }
];

const mockNotifications = [
  {
    id: '1',
    type: 'comment',
    content: 'John Smith replied to your comment on AI-Powered Healthcare Assistant',
    isRead: false,
    createdAt: '2023-06-01T14:30:00.000Z',
  },
  {
    id: '2',
    type: 'contact_request',
    content: 'Your contact request to Lisa Wong was accepted',
    isRead: true,
    createdAt: '2023-05-29T10:15:00.000Z',
  }
];

export default function InvestorDashboard() {
  const [projects, setProjects] = useState(mockProjects);
  const [savedProjects, setSavedProjects] = useState(mockSavedProjects);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');

  // In a real app, this would fetch data from your API
  useEffect(() => {
    // Simulate API calls
    // fetchProjects().then(setProjects);
    // fetchSavedProjects().then(setSavedProjects);
    // fetchNotifications().then(setNotifications);
  }, []);

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
    // In a real app: markNotificationsAsRead()
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = industryFilter === 'All' || project.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const industries = ['All', ...Array.from(new Set(projects.map(p => p.industry)))];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Investor Dashboard</h1>
          <p className="text-gray-600 mt-1">Discover promising startups and track your portfolio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="discover">
            <TabsList>
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="saved">Saved Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="discover" className="mt-6">
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-start">
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full md:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {filteredProjects.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <h3 className="text-xl font-medium mb-2">No matching projects</h3>
                      <p className="text-gray-500 text-center">Try adjusting your filters</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      isSaved={savedProjects.some(p => p.id === project.id)}
                      onSaveToggle={() => {
                        // In a real app, this would call an API to save/unsave the project
                        if (savedProjects.some(p => p.id === project.id)) {
                          setSavedProjects(savedProjects.filter(p => p.id !== project.id));
                        } else {
                          setSavedProjects([...savedProjects, project]);
                        }
                      }}
                    />
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              <div className="space-y-6">
                {savedProjects.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <h3 className="text-xl font-medium mb-2">No saved projects</h3>
                      <p className="text-gray-500 text-center mb-4">Save projects to track them here</p>
                      <Link href="/projects">
                        <Button>Discover Projects</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  savedProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      isSaved={true}
                      onSaveToggle={() => {
                        setSavedProjects(savedProjects.filter(p => p.id !== project.id));
                      }}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Notifications</CardTitle>
              {unreadCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                  {unreadCount} new
                </span>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              <NotificationList 
                notifications={notifications.slice(0, 5)} 
                onMarkAllRead={markAllNotificationsAsRead}
              />
              {notifications.length > 5 && (
                <Link href="/notifications" className="block text-sm text-blue-600 hover:text-blue-800 text-center mt-2">
                  View all notifications
                </Link>
              )}
            </CardContent>
          </Card>
          
          {/* Investment Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Investment Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{savedProjects.length}</div>
                  <div className="text-xs text-gray-500">Saved Projects</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {filteredProjects.length}
                  </div>
                  <div className="text-xs text-gray-500">Discover Feed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    3
                  </div>
                  <div className="text-xs text-gray-500">Active Conversations</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    12
                  </div>
                  <div className="text-xs text-gray-500">Project Views</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                <Link href="/projects" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>Browse All Projects</span>
                </Link>
                <Link href="/profile" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Edit Profile</span>
                </Link>
                <Link href="/notifications" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                    <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3Z"></path>
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
                  </svg>
                  <span>All Notifications</span>
                </Link>
                <Link href="/messages" className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>Messages</span>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Featured Image */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://pixabay.com/get/ge377a5115131653107d1280b9313f77170a1750f5589645fdaf23cc30f57ca8d8428bea683b115924c2377fa7664d9ff989ae6c9a0492acad135c489831ff7d6_1280.jpg" 
              alt="Venture Capital Office"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
