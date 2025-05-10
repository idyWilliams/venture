"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserData {
  total: number;
  active: number;
  newToday: number;
  founders: number;
  investors: number;
  accelerators: number;
}

interface ProjectData {
  total: number;
  active: number;
  newToday: number;
  published: number;
  draft: number;
}

interface EngagementData {
  views: number;
  likes: number;
  comments: number;
  contactRequests: number;
  dealRooms: number;
}

interface ReportedItem {
  id: string;
  type: 'project' | 'comment' | 'user';
  reportedBy: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  content: string;
  itemAuthor: {
    id: string;
    name: string;
  };
}

export default function AdminDashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [reportedItems, setReportedItems] = useState<ReportedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be server fetches
        // const userResponse = await fetch('/api/admin/users/stats');
        // const userData = await userResponse.json();
        
        // For this demo, we'll use mock data
        const mockUserData: UserData = {
          total: 1248,
          active: 876,
          newToday: 23,
          founders: 742,
          investors: 465,
          accelerators: 41
        };
        
        const mockProjectData: ProjectData = {
          total: 629,
          active: 512,
          newToday: 17,
          published: 487,
          draft: 142
        };
        
        const mockEngagementData: EngagementData = {
          views: 28745,
          likes: 4231,
          comments: 1876,
          contactRequests: 342,
          dealRooms: 128
        };
        
        const mockReportedItems: ReportedItem[] = [
          {
            id: 'report-1',
            type: 'comment',
            reportedBy: 'user-123',
            reason: 'Inappropriate content',
            status: 'pending',
            createdAt: '2025-05-08T08:30:00Z',
            content: 'This comment contains promotional material and spam links.',
            itemAuthor: {
              id: 'user-456',
              name: 'John Smith'
            }
          },
          {
            id: 'report-2',
            type: 'project',
            reportedBy: 'user-789',
            reason: 'Misleading information',
            status: 'pending',
            createdAt: '2025-05-07T14:20:00Z',
            content: 'Project contains false claims about partnerships and traction.',
            itemAuthor: {
              id: 'user-012',
              name: 'Alice Johnson'
            }
          },
          {
            id: 'report-3',
            type: 'user',
            reportedBy: 'user-345',
            reason: 'Fake account',
            status: 'resolved',
            createdAt: '2025-05-06T10:15:00Z',
            content: 'This appears to be a fake investor account with suspicious activity.',
            itemAuthor: {
              id: 'user-678',
              name: 'Robert Davis'
            }
          },
          {
            id: 'report-4',
            type: 'comment',
            reportedBy: 'user-901',
            reason: 'Harassment',
            status: 'dismissed',
            createdAt: '2025-05-05T16:45:00Z',
            content: 'This comment contains personal attacks and unprofessional language.',
            itemAuthor: {
              id: 'user-234',
              name: 'Emily Wilson'
            }
          }
        ];

        setTimeout(() => {
          setUserData(mockUserData);
          setProjectData(mockProjectData);
          setEngagementData(mockEngagementData);
          setReportedItems(mockReportedItems);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin dashboard data');
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleStatusChange = (reportId: string, newStatus: 'pending' | 'resolved' | 'dismissed') => {
    // In a real implementation, this would update the database
    // await fetch(`/api/admin/reports/${reportId}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus })
    // });
    
    // For this demo, we'll update the state directly
    setReportedItems(reports => 
      reports.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
            <div className="h-4 w-40 bg-blue-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-blue-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Monitor platform activity, manage users, and moderate content
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Users</CardTitle>
            <CardDescription>User registration and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {userData?.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Total Registered Users
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">{userData?.active.toLocaleString()}</div>
                <div className="text-gray-500">Active Users</div>
              </div>
              <div>
                <div className="font-medium text-green-600">+{userData?.newToday}</div>
                <div className="text-gray-500">New Today</div>
              </div>
              <div>
                <div className="font-medium">{userData?.founders.toLocaleString()}</div>
                <div className="text-gray-500">Founders</div>
              </div>
              <div>
                <div className="font-medium">{userData?.investors.toLocaleString()}</div>
                <div className="text-gray-500">Investors</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Projects</CardTitle>
            <CardDescription>Startup projects on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {projectData?.total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Total Projects
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">{projectData?.active.toLocaleString()}</div>
                <div className="text-gray-500">Active Projects</div>
              </div>
              <div>
                <div className="font-medium text-green-600">+{projectData?.newToday}</div>
                <div className="text-gray-500">New Today</div>
              </div>
              <div>
                <div className="font-medium">{projectData?.published.toLocaleString()}</div>
                <div className="text-gray-500">Published</div>
              </div>
              <div>
                <div className="font-medium">{projectData?.draft.toLocaleString()}</div>
                <div className="text-gray-500">Draft</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Engagement</CardTitle>
            <CardDescription>Platform interaction metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {engagementData?.views.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Total Project Views
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium">{engagementData?.likes.toLocaleString()}</div>
                <div className="text-gray-500">Likes</div>
              </div>
              <div>
                <div className="font-medium">{engagementData?.comments.toLocaleString()}</div>
                <div className="text-gray-500">Comments</div>
              </div>
              <div>
                <div className="font-medium">{engagementData?.contactRequests.toLocaleString()}</div>
                <div className="text-gray-500">Contact Requests</div>
              </div>
              <div>
                <div className="font-medium">{engagementData?.dealRooms.toLocaleString()}</div>
                <div className="text-gray-500">Deal Rooms</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="moderation" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="projects">Project Management</TabsTrigger>
          <TabsTrigger value="settings">Platform Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="moderation">
          <Card>
            <CardHeader>
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>
                Review and take action on reported content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportedItems.length > 0 ? (
                  reportedItems.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className={`h-2 ${
                        item.status === 'pending' ? 'bg-yellow-500' :
                        item.status === 'resolved' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}></div>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`uppercase text-xs font-bold px-2 py-1 rounded ${
                                item.type === 'comment' ? 'bg-blue-100 text-blue-800' :
                                item.type === 'project' ? 'bg-purple-100 text-purple-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.type}
                              </span>
                              <span className="text-sm text-gray-500">
                                Reported {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="font-medium">Reason: {item.reason}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant={item.status === 'resolved' ? 'default' : 'outline'}
                              onClick={() => handleStatusChange(item.id, 'resolved')}
                              disabled={item.status === 'resolved'}
                            >
                              Resolve
                            </Button>
                            <Button 
                              size="sm" 
                              variant={item.status === 'dismissed' ? 'default' : 'outline'}
                              onClick={() => handleStatusChange(item.id, 'dismissed')}
                              disabled={item.status === 'dismissed'}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                          <p className="text-gray-800 italic">"{item.content}"</p>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>
                            <span className="text-gray-500">Posted by: </span>
                            <span className="font-medium">{item.itemAuthor.name}</span>
                          </div>
                          <div className="space-x-2">
                            <Button variant="ghost" size="sm">View Content</Button>
                            <Button variant="ghost" size="sm">Review User</Button>
                            {item.type !== 'user' && (
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Delete Content
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="m4.93 4.93 14.14 14.14"/>
                    </svg>
                    <p className="text-gray-500">No reported content to review</p>
                  </div>
                )}
              </div>
              
              {reportedItems.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline">
                    View All Reports
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Search, view, and manage user accounts
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Input placeholder="Search users..." className="pl-10" />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Joined</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Emma Stone</td>
                      <td className="py-3 px-4">emma@example.com</td>
                      <td className="py-3 px-4">Founder</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
                      </td>
                      <td className="py-3 px-4">Apr 12, 2025</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                          </svg>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                        </Button>
                      </td>
                    </tr>
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  Showing 1-10 of 1,248 users
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>
                    Review and manage startup projects
                  </CardDescription>
                </div>
                <div className="relative w-full md:w-64">
                  <Input placeholder="Search projects..." className="pl-10" />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Project management panel content</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure global platform settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Content Moderation Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="auto-moderation">Auto-Moderation Level</Label>
                        <select
                          id="auto-moderation"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 mt-2"
                        >
                          <option value="strict">Strict</option>
                          <option value="moderate" selected>Moderate</option>
                          <option value="relaxed">Relaxed</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="moderation-threshold">AI Moderation Threshold</Label>
                        <Input id="moderation-threshold" type="number" min="0" max="1" step="0.1" defaultValue="0.7" className="mt-2" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="blocked-terms">Blocked Terms</Label>
                      <Textarea id="blocked-terms" className="mt-2" placeholder="Enter terms separated by commas" />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">User Registration Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="require-verification" defaultChecked />
                      <Label htmlFor="require-verification">Require email verification</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="allow-social-login" defaultChecked />
                      <Label htmlFor="allow-social-login">Allow social login</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="investor-approval" defaultChecked />
                      <Label htmlFor="investor-approval">Require approval for investor accounts</Label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">AI Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ai-model">AI Model</Label>
                        <select
                          id="ai-model"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 mt-2"
                        >
                          <option value="gpt-4o" selected>GPT-4o</option>
                          <option value="gpt-4">GPT-4</option>
                          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="ai-temperature">AI Temperature</Label>
                        <Input id="ai-temperature" type="number" min="0" max="1" step="0.1" defaultValue="0.7" className="mt-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}