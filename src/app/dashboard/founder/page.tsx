'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EngagementStats from '@/components/engagement/EngagementStats';
import NotificationList from '@/components/notifications/NotificationList';

// Mock data - in a real app, this would come from API calls
const mockProjects = [
  {
    id: '1',
    title: 'AI-Powered Healthcare Assistant',
    description: 'A mobile app that uses artificial intelligence to provide personalized healthcare recommendations and monitoring.',
    industry: 'Healthcare',
    fundingStage: 'Seed',
    createdAt: '2023-05-15T00:00:00.000Z',
    stats: {
      views: 127,
      likes: 42,
      comments: 18,
      recentViewers: [
        { id: 'inv1', name: 'Sequoia Capital', viewedAt: '2023-06-01T14:30:00.000Z' },
        { id: 'inv2', name: 'Andreessen Horowitz', viewedAt: '2023-05-29T10:15:00.000Z' },
        { id: 'inv3', name: 'Y Combinator', viewedAt: '2023-05-28T09:45:00.000Z' },
      ]
    }
  },
  {
    id: '2',
    title: 'Sustainable Supply Chain Platform',
    description: 'A blockchain-based platform that tracks and verifies sustainability metrics across global supply chains.',
    industry: 'Supply Chain',
    fundingStage: 'Series A',
    createdAt: '2023-04-10T00:00:00.000Z',
    stats: {
      views: 89,
      likes: 31,
      comments: 12,
      recentViewers: [
        { id: 'inv4', name: 'Accel Partners', viewedAt: '2023-05-31T16:20:00.000Z' },
        { id: 'inv5', name: 'Benchmark', viewedAt: '2023-05-30T11:05:00.000Z' },
      ]
    }
  }
];

const mockNotifications = [
  {
    id: '1',
    type: 'view',
    content: 'Sequoia Capital viewed your AI-Powered Healthcare Assistant project',
    isRead: false,
    createdAt: '2023-06-01T14:30:00.000Z',
  },
  {
    id: '2',
    type: 'like',
    content: 'Andreessen Horowitz liked your AI-Powered Healthcare Assistant project',
    isRead: true,
    createdAt: '2023-05-29T10:15:00.000Z',
  },
  {
    id: '3',
    type: 'comment',
    content: 'Y Combinator commented on your AI-Powered Healthcare Assistant project',
    isRead: false,
    createdAt: '2023-05-28T09:45:00.000Z',
  },
  {
    id: '4',
    type: 'contact_request',
    content: 'Accel Partners requested to contact you about your Sustainable Supply Chain Platform',
    isRead: false,
    createdAt: '2023-05-31T16:20:00.000Z',
  },
];

export default function FounderDashboard() {
  const [projects, setProjects] = useState(mockProjects);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isContactable, setIsContactable] = useState(false);

  // In a real app, this would fetch data from your API
  useEffect(() => {
    // Simulate API calls
    // fetchProjects().then(setProjects);
    // fetchNotifications().then(setNotifications);
    // fetchUserSettings().then(settings => setIsContactable(settings.openForContact));
  }, []);

  const toggleContactSetting = () => {
    setIsContactable(!isContactable);
    // In a real app: updateUserSettings({ openForContact: !isContactable })
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
    // In a real app: markNotificationsAsRead()
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Founder Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your projects and investor engagements</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/projects/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="projects">
            <TabsList>
              <TabsTrigger value="projects">My Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="projects" className="space-y-6 mt-6">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                    <p className="text-gray-500 text-center mb-4">Create your first project to start connecting with investors</p>
                    <Link href="/projects/new">
                      <Button>Create Project</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                projects.map(project => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle>
                        <Link href={`/projects/${project.id}`} className="hover:text-blue-600 transition-colors">
                          {project.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>
                        {project.industry} • {project.fundingStage}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{project.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{project.stats.views}</div>
                          <div className="text-xs text-gray-500">Views</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{project.stats.likes}</div>
                          <div className="text-xs text-gray-500">Likes</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{project.stats.comments}</div>
                          <div className="text-xs text-gray-500">Comments</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Recent viewers:</h4>
                        <ul className="space-y-1">
                          {project.stats.recentViewers.map(viewer => (
                            <li key={viewer.id} className="text-sm text-gray-600 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                              {viewer.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 flex justify-between">
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                      <Link href={`/projects/${project.id}/edit`}>
                        <Button variant="ghost">Edit</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Analytics</CardTitle>
                  <CardDescription>Track investor interest and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <EngagementStats 
                    data={{
                      views: 216,
                      likes: 73,
                      comments: 30,
                      contactRequests: 5,
                      viewsOverTime: [12, 18, 25, 32, 41, 38, 50],
                      topInvestors: [
                        { name: 'Sequoia Capital', views: 8 },
                        { name: 'Andreessen Horowitz', views: 6 },
                        { name: 'Y Combinator', views: 5 },
                      ]
                    }}
                  />
                </CardContent>
              </Card>
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
          
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Communication Settings</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-medium">Open for investor contact</h4>
                  <p className="text-xs text-gray-500">
                    {isContactable 
                      ? 'Investors can request to contact you' 
                      : 'Investors cannot contact you directly'}
                  </p>
                </div>
                <div>
                  <Button 
                    variant={isContactable ? "default" : "outline"}
                    onClick={toggleContactSetting}
                    className={isContactable ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {isContactable ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">At a Glance</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {unreadCount}
                  </div>
                  <div className="text-xs text-gray-500">Unread Notifications</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.floor(Math.random() * 100)}%
                  </div>
                  <div className="text-xs text-gray-500">Profile Completion</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {mockProjects.reduce((sum, p) => sum + p.stats.views, 0)}
                  </div>
                  <div className="text-xs text-gray-500">Total Views</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
