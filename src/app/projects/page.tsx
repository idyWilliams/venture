"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Types for AI matching algorithm
interface MatchScore {
  score: number;
  reason: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  fundingStage: string;
  fundingModel: 'equity' | 'revenue-based' | 'impact' | 'corporate-vc';
  fundingAmount?: number;
  equity?: number;
  founderName: string;
  founderCompany: string;
  createdAt: string;
  updatedAt: string;
  logo?: string | null;
  engagement: {
    views: number;
    likes: number;
    comments: number;
  };
  tags: string[];
  location: string;
  aiMatchScore?: number;
  esgImpact?: 'high' | 'medium' | 'low' | null;
}

export default function DiscoverProjectsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [fundingModelFilter, setFundingModelFilter] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('match');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading projects data with a slight delay
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort projects
  const filteredProjects = projects.filter(project => {
    // Apply search filter
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply industry filter
    if (industryFilter && project.industry !== industryFilter) {
      return false;
    }
    
    // Apply funding model filter
    if (fundingModelFilter && project.fundingModel !== fundingModelFilter) {
      return false;
    }
    
    // Apply stage filter
    if (stageFilter && project.fundingStage !== stageFilter) {
      return false;
    }
    
    // Apply tab filter
    if (activeTab === 'aiRecommended' && (project.aiMatchScore || 0) < 75) {
      return false;
    }
    
    if (activeTab === 'impact' && project.esgImpact !== 'high') {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort projects
    if (sortBy === 'match') {
      return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
    } else if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'engagement') {
      const engagementA = a.engagement.views + a.engagement.likes * 3 + a.engagement.comments * 5;
      const engagementB = b.engagement.views + b.engagement.likes * 3 + b.engagement.comments * 5;
      return engagementB - engagementA;
    }
    return 0;
  });

  // Get unique industries for filter
  const industriesSet = new Set<string>();
  projects.forEach(p => industriesSet.add(p.industry));
  const industries = Array.from(industriesSet);
  
  // Get unique funding stages for filter
  const stagesSet = new Set<string>();
  projects.forEach(p => stagesSet.add(p.fundingStage));
  const fundingStages = Array.from(stagesSet);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-extrabold mb-4">Discover Projects</h1>
          <p className="text-xl text-blue-100 max-w-2xl mb-8">
            Find promising startups that match your investment criteria using our AI-powered matching algorithm
          </p>
          
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for projects by name, description, or keyword..."
              className="w-full rounded-lg py-3 px-4 text-gray-900 bg-white/95 backdrop-blur-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Filter & Sort</h2>
            
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-auto">
                <Label htmlFor="industry" className="mb-2 block text-sm font-medium">Industry</Label>
                <select
                  id="industry"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={industryFilter || ''}
                  onChange={(e) => setIndustryFilter(e.target.value || null)}
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <Label htmlFor="stage" className="mb-2 block text-sm font-medium">Funding Stage</Label>
                <select
                  id="stage"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={stageFilter || ''}
                  onChange={(e) => setStageFilter(e.target.value || null)}
                >
                  <option value="">All Stages</option>
                  {fundingStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <Label htmlFor="fundingModel" className="mb-2 block text-sm font-medium">Funding Model</Label>
                <select
                  id="fundingModel"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={fundingModelFilter || ''}
                  onChange={(e) => setFundingModelFilter(e.target.value || null)}
                >
                  <option value="">All Models</option>
                  <option value="equity">Equity</option>
                  <option value="revenue-based">Revenue-Based</option>
                  <option value="impact">Impact Investment</option>
                  <option value="corporate-vc">Corporate VC</option>
                </select>
              </div>
              
              <div className="w-full md:w-auto">
                <Label htmlFor="sortBy" className="mb-2 block text-sm font-medium">Sort By</Label>
                <select
                  id="sortBy"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="match">AI Match Score</option>
                  <option value="date">Newest First</option>
                  <option value="engagement">Most Engaging</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="aiRecommended">AI Recommended</TabsTrigger>
            <TabsTrigger value="impact">ESG & Impact</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="bg-white border-0 shadow-md overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <CardContent className="pt-6 pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
                <CardFooter className="border-t border-gray-100 flex justify-between py-4">
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group">
                <Card className="bg-white border-0 shadow-md hover:shadow-xl transition-all overflow-hidden h-full flex flex-col">
                  <div className="h-40 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
                    {project.logo ? (
                      <img 
                        src={project.logo} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl font-bold text-gray-200">{project.title.charAt(0)}</span>
                      </div>
                    )}
                    
                    {/* Badge for funding model */}
                    <div className={`absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full ${
                      project.fundingModel === 'impact' ? 'bg-green-100 text-green-800' :
                      project.fundingModel === 'revenue-based' ? 'bg-purple-100 text-purple-800' :
                      project.fundingModel === 'corporate-vc' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {project.fundingModel === 'equity' ? 'Equity' :
                       project.fundingModel === 'revenue-based' ? 'Revenue-Based' :
                       project.fundingModel === 'impact' ? 'Impact' :
                       'Corporate VC'}
                    </div>
                    
                    {/* AI Match Score */}
                    {project.aiMatchScore && (
                      <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow-md px-2 py-1 flex items-center space-x-1 text-sm font-medium">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>{project.aiMatchScore}% Match</span>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="flex-grow pt-6 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-1">
                        {project.industry}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="bg-gray-50 text-gray-600 text-xs rounded px-2 py-1">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="bg-gray-50 text-gray-600 text-xs rounded px-2 py-1">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center font-medium">
                        <span className="text-gray-700">{project.fundingStage}</span>
                      </div>
                      <div>
                        {project.fundingAmount && (
                          <span className="text-blue-600 font-semibold">
                            {formatCurrency(project.fundingAmount)}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="border-t border-gray-100 flex justify-between py-4">
                    <div className="text-sm text-gray-500">
                      {project.founderName}
                    </div>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{project.engagement.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{project.engagement.likes}</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-2 text-gray-500">
              Try changing your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

// Mock data for the projects
const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'EcoTech Energy Solutions',
    description: 'Developing a next-generation battery storage system for renewable energy using recycled materials. Our technology increases efficiency by 40% while reducing costs.',
    industry: 'CleanTech',
    fundingStage: 'Seed',
    fundingModel: 'impact',
    fundingAmount: 750000,
    equity: 10,
    founderName: 'Sarah Johnson',
    founderCompany: 'EcoTech Inc.',
    createdAt: '2025-04-02T10:30:00Z',
    updatedAt: '2025-04-05T14:15:00Z',
    logo: 'https://images.unsplash.com/photo-1473308822086-710304d7d30c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    engagement: {
      views: 342,
      likes: 28,
      comments: 15
    },
    tags: ['Renewable Energy', 'Battery Storage', 'Sustainable', 'Hardware'],
    location: 'Boston, MA',
    aiMatchScore: 92,
    esgImpact: 'high'
  },
  {
    id: 'proj-2',
    title: 'MediConnect Health Platform',
    description: 'AI-powered telehealth solution connecting patients in rural areas with specialists. Using machine learning to improve diagnosis accuracy and patient outcomes.',
    industry: 'HealthTech',
    fundingStage: 'Series A',
    fundingModel: 'equity',
    fundingAmount: 3000000,
    equity: 18,
    founderName: 'David Chen',
    founderCompany: 'MediConnect',
    createdAt: '2025-03-28T08:45:00Z',
    updatedAt: '2025-04-03T11:20:00Z',
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    engagement: {
      views: 189,
      likes: 42,
      comments: 23
    },
    tags: ['Healthcare', 'AI', 'Telehealth', 'Rural'],
    location: 'San Francisco, CA',
    aiMatchScore: 88,
    esgImpact: 'high'
  },
  {
    id: 'proj-3',
    title: 'SupplyChain.io',
    description: 'Blockchain-based platform for transparent supply chain management. Allows real-time tracking, verification, and documentation of goods from factory to consumer.',
    industry: 'Logistics',
    fundingStage: 'Seed',
    fundingModel: 'corporate-vc',
    fundingAmount: 1200000,
    equity: 12,
    founderName: 'Michael Wong',
    founderCompany: 'SupplyChain Technologies',
    createdAt: '2025-04-05T16:20:00Z',
    updatedAt: '2025-04-06T09:10:00Z',
    logo: null,
    engagement: {
      views: 156,
      likes: 18,
      comments: 7
    },
    tags: ['Blockchain', 'Supply Chain', 'Logistics', 'B2B'],
    location: 'Chicago, IL',
    aiMatchScore: 79,
    esgImpact: 'medium'
  },
  {
    id: 'proj-4',
    title: 'FinTrack Analytics',
    description: 'Financial analytics platform for small businesses. Automated cash flow forecasting, expense tracking, and business intelligence dashboards.',
    industry: 'FinTech',
    fundingStage: 'Pre-seed',
    fundingModel: 'revenue-based',
    fundingAmount: 350000,
    equity: 5,
    founderName: 'Jessica Martinez',
    founderCompany: 'FinTrack',
    createdAt: '2025-04-01T13:15:00Z',
    updatedAt: '2025-04-04T17:40:00Z',
    logo: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    engagement: {
      views: 108,
      likes: 15,
      comments: 9
    },
    tags: ['Finance', 'Analytics', 'SMB', 'SaaS'],
    location: 'New York, NY',
    aiMatchScore: 65,
    esgImpact: 'low'
  },
  {
    id: 'proj-5',
    title: 'AgroSmart Farming',
    description: 'IoT and AI solution for precision agriculture. Smart sensors and drones collect data to optimize irrigation, fertilization, and pest control for increased crop yields.',
    industry: 'AgTech',
    fundingStage: 'Series A',
    fundingModel: 'impact',
    fundingAmount: 2500000,
    equity: 15,
    founderName: 'Robert Garcia',
    founderCompany: 'AgroSmart',
    createdAt: '2025-03-25T09:30:00Z',
    updatedAt: '2025-04-02T11:45:00Z',
    logo: 'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    engagement: {
      views: 231,
      likes: 36,
      comments: 19
    },
    tags: ['Agriculture', 'IoT', 'AI', 'Sustainability'],
    location: 'Austin, TX',
    aiMatchScore: 85,
    esgImpact: 'high'
  },
  {
    id: 'proj-6',
    title: 'CyberShield Security',
    description: 'Next-generation cybersecurity platform using behavioral analytics and AI to identify and neutralize threats before they cause damage.',
    industry: 'Cybersecurity',
    fundingStage: 'Seed',
    fundingModel: 'equity',
    fundingAmount: 900000,
    equity: 8,
    founderName: 'Alex Thompson',
    founderCompany: 'CyberShield',
    createdAt: '2025-04-03T11:00:00Z',
    updatedAt: '2025-04-06T15:30:00Z',
    logo: null,
    engagement: {
      views: 174,
      likes: 21,
      comments: 12
    },
    tags: ['Security', 'AI', 'Enterprise', 'SaaS'],
    location: 'Seattle, WA',
    aiMatchScore: 72,
    esgImpact: 'medium'
  },
  {
    id: 'proj-7',
    title: 'EdTech Innovators',
    description: 'Adaptive learning platform that personalizes education based on student performance and learning style. Uses AI to identify knowledge gaps and adjust curriculum.',
    industry: 'EdTech',
    fundingStage: 'Series A',
    fundingModel: 'impact',
    fundingAmount: 2800000,
    equity: 14,
    founderName: 'Maya Patel',
    founderCompany: 'EdTech Innovators',
    createdAt: '2025-03-27T14:50:00Z',
    updatedAt: '2025-04-05T10:20:00Z',
    logo: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    engagement: {
      views: 196,
      likes: 29,
      comments: 17
    },
    tags: ['Education', 'AI', 'Adaptive Learning', 'K-12'],
    location: 'Boston, MA',
    aiMatchScore: 90,
    esgImpact: 'high'
  },
  {
    id: 'proj-8',
    title: 'RevenuePilot',
    description: 'Revenue-based financing platform for SaaS companies. Provides growth capital in exchange for a percentage of future revenue, with flexible repayment options.',
    industry: 'FinTech',
    fundingStage: 'Seed',
    fundingModel: 'revenue-based',
    fundingAmount: 1500000,
    equity: 0,
    founderName: 'Tom Wilson',
    founderCompany: 'RevenuePilot',
    createdAt: '2025-04-04T08:15:00Z',
    updatedAt: '2025-04-06T12:40:00Z',
    logo: null,
    engagement: {
      views: 143,
      likes: 19,
      comments: 11
    },
    tags: ['Revenue Financing', 'SaaS', 'Alternative Funding', 'FinTech'],
    location: 'Miami, FL',
    aiMatchScore: 83,
    esgImpact: 'low'
  },
  {
    id: 'proj-9',
    title: 'GreenCommerce',
    description: 'Sustainable e-commerce platform connecting conscious consumers with eco-friendly products. Carbon-neutral shipping and plastic-free packaging.',
    industry: 'E-Commerce',
    fundingStage: 'Pre-seed',
    fundingModel: 'impact',
    fundingAmount: 400000,
    equity: 6,
    founderName: 'Emma Rodriguez',
    founderCompany: 'GreenCommerce',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-05T09:15:00Z',
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
    engagement: {
      views: 127,
      likes: 25,
      comments: 13
    },
    tags: ['E-Commerce', 'Sustainability', 'Retail', 'B2C'],
    location: 'Portland, OR',
    aiMatchScore: 87,
    esgImpact: 'high'
  }
];