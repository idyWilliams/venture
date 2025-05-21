"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/src/contexts/UserRoleContext';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BarChart4,
  Brain,
  Calendar,
  ChevronDown,
  Lightbulb,
  LineChart,
  Maximize2,
  PieChart,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import ProjectSuccessAnalytics from '@/src/components/ai-analytics/ProjectSuccessAnalytics';
import EngagementLineChart from '@/src/components/analytics/EngagementLineChart';
import EngagementBarChart from '@/src/components/analytics/EngagementBarChart';
import EngagementDonutChart from '@/src/components/analytics/EngagementDonutChart';

// Mock data for analytics
const timeSeriesData = [
  { date: '2024-04-01', views: 25, likes: 5, comments: 2, contactRequests: 0 },
  { date: '2024-04-02', views: 32, likes: 7, comments: 1, contactRequests: 1 },
  { date: '2024-04-03', views: 28, likes: 6, comments: 3, contactRequests: 0 },
  { date: '2024-04-04', views: 35, likes: 8, comments: 4, contactRequests: 1 },
  { date: '2024-04-05', views: 42, likes: 10, comments: 5, contactRequests: 2 },
  { date: '2024-04-06', views: 38, likes: 9, comments: 4, contactRequests: 1 },
  { date: '2024-04-07', views: 45, likes: 12, comments: 6, contactRequests: 2 },
  { date: '2024-04-08', views: 50, likes: 15, comments: 8, contactRequests: 3 },
  { date: '2024-04-09', views: 48, likes: 14, comments: 7, contactRequests: 2 },
  { date: '2024-04-10', views: 55, likes: 18, comments: 9, contactRequests: 4 },
  { date: '2024-04-11', views: 60, likes: 20, comments: 10, contactRequests: 3 },
  { date: '2024-04-12', views: 58, likes: 19, comments: 8, contactRequests: 3 },
  { date: '2024-04-13', views: 65, likes: 22, comments: 12, contactRequests: 5 },
  { date: '2024-04-14', views: 72, likes: 25, comments: 14, contactRequests: 6 },
];

const investorInterestData = [
  { name: 'Venture Capital', value: 45, color: '#4f46e5' },
  { name: 'Angel Investors', value: 30, color: '#06b6d4' },
  { name: 'Corporate VC', value: 15, color: '#8b5cf6' },
  { name: 'PE Firms', value: 10, color: '#ec4899' },
];

const industryComparisonData = [
  { name: 'Your Project', value: 65, color: '#4f46e5' },
  { name: 'Industry Average', value: 40, color: '#6b7280' },
  { name: 'Top Performers', value: 85, color: '#10b981' },
];

const founderEngagementData = [
  { name: 'TechStartup X', value: 42, color: '#4f46e5' },
  { name: 'EcoSolutions', value: 28, color: '#10b981' },
  { name: 'FinanceAI', value: 35, color: '#f59e0b' },
  { name: 'HealthTech Inc', value: 22, color: '#ef4444' },
  { name: 'EduLearn', value: 18, color: '#8b5cf6' },
];

// AI insights data
const aiInsights = [
  {
    id: 1,
    title: 'Engagement Spike Detected',
    description: 'Your project received 72% more views after your recent pitch deck update. Consider highlighting these elements in future presentations.',
    type: 'positive',
    date: '2024-05-02'
  },
  {
    id: 2,
    title: 'Investor Match Opportunity',
    description: 'Based on recent engagement patterns, 3 investors with FinTech focus are showing interest in your project. Consider reaching out directly.',
    type: 'opportunity',
    date: '2024-04-28'
  },
  {
    id: 3,
    title: 'Revenue Model Feedback',
    description: 'Investors spending most time on your revenue model slides. Our analysis suggests clarifying the SaaS pricing structure.',
    type: 'warning',
    date: '2024-04-25'
  },
  {
    id: 4,
    title: 'Competitive Advantage',
    description: 'Your AI technology claims are resonating well with technical VCs. Consider emphasizing your proprietary algorithms in pitches.',
    type: 'positive',
    date: '2024-04-20'
  },
];

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedProject, setSelectedProject] = useState('project-1');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Different content for founder vs investor
  const isFounder = role === 'founder';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">
            AI-powered insights for {isFounder ? 'your projects' : 'your investment opportunities'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={timeframe === '7d' ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe('7d')}
              className="rounded-none"
            >
              7 Days
            </Button>
            <Button
              variant={timeframe === '30d' ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe('30d')}
              className="rounded-none"
            >
              30 Days
            </Button>
            <Button
              variant={timeframe === '90d' ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe('90d')}
              className="rounded-none"
            >
              90 Days
            </Button>
            <Button
              variant={timeframe === 'all' ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe('all')}
              className="rounded-none"
            >
              All Time
            </Button>
          </div>

          {isFounder && (
            <div className="relative">
              <select
                className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10 text-sm leading-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="project-1">TechStartup X</option>
                <option value="project-2">EcoSolutions</option>
                <option value="project-3">MediSync Health</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Engagement Overview */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Engagement Overview
              </h2>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-1" />
                Expand
              </Button>
            </div>

            <EngagementLineChart
              data={timeSeriesData}
              title=""
              timeframes={['7d', '30d', '90d', 'all']}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isFounder ? (
              <>
                <div className="bg-white rounded-lg shadow-sm border p-5">
                  <h3 className="text-md font-medium mb-3 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-indigo-600" />
                    Investor Interest by Type
                  </h3>
                  <EngagementDonutChart
                    data={investorInterestData}
                    title=""
                    height={220}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-5">
                  <h3 className="text-md font-medium mb-3 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                    Industry Comparison
                  </h3>
                  <EngagementBarChart
                    data={industryComparisonData}
                    title=""
                    layout="horizontal"
                    height={220}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-sm border p-5">
                  <h3 className="text-md font-medium mb-3 flex items-center">
                    <BarChart4 className="h-5 w-5 mr-2 text-blue-600" />
                    Top Founder Engagement
                  </h3>
                  <EngagementBarChart
                    data={founderEngagementData}
                    title=""
                    layout="horizontal"
                    height={220}
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-5">
                  <h3 className="text-md font-medium mb-3 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    Portfolio Performance
                  </h3>
                  <div className="h-[220px] flex items-center justify-center">
                    <Link
                      href="/investor/portfolio"
                      className="border border-dashed border-gray-300 rounded-lg p-4 text-center w-full"
                    >
                      <LineChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">View your full investment portfolio</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Performance
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - AI Insights & Predictions */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI Insights
              </h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>

            <div className="space-y-3">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-3 rounded-md border ${
                    insight.type === 'positive' ? 'bg-green-50 border-green-100' :
                    insight.type === 'warning' ? 'bg-yellow-50 border-yellow-100' :
                    'bg-blue-50 border-blue-100'
                  }`}
                >
                  <div className="flex items-start mb-1">
                    {insight.type === 'positive' ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 mr-1.5" />
                    ) : insight.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-1.5" />
                    ) : (
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 mr-1.5" />
                    )}
                    <p className="text-sm font-medium">
                      {insight.title}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 ml-5.5">
                    {insight.description}
                  </p>
                  <div className="flex justify-between mt-1 ml-5.5">
                    <p className="text-xs text-gray-500">
                      {new Date(insight.date).toLocaleDateString()}
                    </p>
                    <Button variant="ghost" size="sm" className="h-6 px-2 py-0 text-xs">
                      Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Success Prediction */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                AI Success Prediction
              </h2>
              <Button variant="outline" size="sm">Refresh</Button>
            </div>

            <ProjectSuccessAnalytics projectId={selectedProject} />
          </div>
        </div>
      </div>
    </div>
  );
}