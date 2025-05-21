"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/src/contexts/UserRoleContext';
import { Button } from '@/components/ui/button';
import {
  BarChart2,
  Brain,
  CalendarDays,
  ChevronDown,
  Download,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Laptop,
  LineChart,
  Maximize2,
  PieChart,
  Search,
  Share2,
  Star,
  TrendingUp,
  User,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for insights
const marketTrends = [
  { category: 'Fintech', growth: 32, deals: 156, avgDealSize: 5.8, change: 8.2 },
  { category: 'Healthtech', growth: 27, deals: 145, avgDealSize: 6.4, change: 12.5 },
  { category: 'AI/ML', growth: 45, deals: 203, avgDealSize: 7.2, change: 18.7 },
  { category: 'Climate Tech', growth: 38, deals: 112, avgDealSize: 8.5, change: 15.3 },
  { category: 'EdTech', growth: 18, deals: 87, avgDealSize: 4.2, change: -2.1 },
];

const startupsToWatch = [
  {
    id: 'startup-1',
    name: 'NeuralFinance',
    category: 'Fintech',
    description: 'AI-driven financial planning platform with predictive analytics',
    traction: 'MRR: $45K, Growth: 18% MoM',
    stage: 'Seed',
    aiScore: 92,
    matchScore: 88,
    logo: 'NF'
  },
  {
    id: 'startup-2',
    name: 'EcoSolutions',
    category: 'CleanTech',
    description: 'Carbon capture technology for commercial buildings',
    traction: 'Revenue: $320K, 15 enterprise clients',
    stage: 'Series A',
    aiScore: 87,
    matchScore: 92,
    logo: 'ES'
  },
  {
    id: 'startup-3',
    name: 'MediSync',
    category: 'HealthTech',
    description: 'Remote patient monitoring using wearable tech',
    traction: 'MRR: $78K, Growth: 22% MoM',
    stage: 'Seed',
    aiScore: 89,
    matchScore: 85,
    logo: 'MS'
  },
  {
    id: 'startup-4',
    name: 'EduVerse',
    category: 'EdTech',
    description: 'VR-based educational platform for STEM subjects',
    traction: 'ARR: $550K, 45 school districts',
    stage: 'Series A',
    aiScore: 84,
    matchScore: 76,
    logo: 'EV'
  },
  {
    id: 'startup-5',
    name: 'DataSense',
    category: 'AI/ML',
    description: 'Enterprise data analytics with automated insights',
    traction: 'MRR: $120K, Growth: 15% MoM',
    stage: 'Seed',
    aiScore: 94,
    matchScore: 90,
    logo: 'DS'
  },
];

const pastPredictions = [
  {
    id: 'pred-1',
    company: 'SmartLogistics',
    prediction: 'High growth potential in 12 months',
    aiScore: 90,
    date: '2023-09-15',
    actualPerformance: 'Revenue grew 112% YoY',
    accuracy: 95
  },
  {
    id: 'pred-2',
    company: 'CloudSecure',
    prediction: 'Strong enterprise adoption within 6 months',
    aiScore: 87,
    date: '2023-11-02',
    actualPerformance: 'Secured 18 enterprise clients',
    accuracy: 92
  },
  {
    id: 'pred-3',
    company: 'GreenEnergy',
    prediction: 'Regulatory challenges will slow growth',
    aiScore: 75,
    date: '2023-08-22',
    actualPerformance: 'Expansion delayed due to regulatory issues',
    accuracy: 88
  },
  {
    id: 'pred-4',
    company: 'RetailAI',
    prediction: 'Customer acquisition costs will increase',
    aiScore: 82,
    date: '2023-10-11',
    actualPerformance: 'CAC increased by 28%',
    accuracy: 85
  },
];

export default function InvestorInsightsPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [region, setRegion] = useState<'global' | 'africa' | 'nigeria'>('nigeria');

  // Redirect if not authenticated or not an investor
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    } else if (role !== 'investor') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, role, router]);

  if (!isAuthenticated || role !== 'investor') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Investor Insights</h1>
          <p className="text-gray-600">AI-powered market intelligence and startup opportunities</p>
        </div>

        <div className="flex space-x-3">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={region === 'nigeria' ? "default" : "ghost"}
              size="sm"
              onClick={() => setRegion('nigeria')}
              className="rounded-none"
            >
              Nigeria
            </Button>
            <Button
              variant={region === 'africa' ? "default" : "ghost"}
              size="sm"
              onClick={() => setRegion('africa')}
              className="rounded-none"
            >
              Africa
            </Button>
            <Button
              variant={region === 'global' ? "default" : "ghost"}
              size="sm"
              onClick={() => setRegion('global')}
              className="rounded-none"
            >
              Global
            </Button>
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border rounded-md py-2 pl-3 pr-10 text-sm leading-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
            >
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
          </div>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Trends */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Market Trends
              </h2>
              <Button variant="outline" size="sm">
                <Maximize2 className="h-4 w-4 mr-1" />
                Full Report
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Growth Rate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      # of Deals
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg. Deal Size (₦M)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      YoY Change
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marketTrends.map((trend, index) => (
                    <tr key={trend.category} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{trend.category}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{trend.growth}%</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{trend.deals}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{trend.avgDealSize}M</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`text-sm font-medium ${trend.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trend.change >= 0 ? '+' : ''}{trend.change}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4">
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="h-4 w-4 mr-1.5 text-blue-600" />
                <span>
                  {region === 'nigeria' ? 'Nigerian' : region === 'africa' ? 'African' : 'Global'} startup investment data for {' '}
                  {timeframe === 'month' ? 'the past month' : timeframe === 'quarter' ? 'Q1 2024' : '2023-2024'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Prediction Performance */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-600" />
                AI Prediction Performance
              </h2>
              <div className="flex items-center text-sm text-gray-600">
                <HelpCircle className="h-4 w-4 mr-1.5" />
                <span>Based on our proprietary AI success prediction model</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Prediction
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actual Outcome
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pastPredictions.map((pred, index) => (
                    <tr key={pred.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{pred.company}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{pred.prediction}</div>
                        <div className="text-xs text-gray-500">AI Score: {pred.aiScore}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(pred.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{pred.actualPerformance}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pred.accuracy >= 90 ? 'bg-green-100 text-green-800' :
                            pred.accuracy >= 80 ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {pred.accuracy}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Overall AI Prediction Accuracy: <span className="font-medium text-green-600">90.2%</span>
                </div>
                <Button variant="outline" size="sm">
                  <LineChart className="h-4 w-4 mr-1.5" />
                  View Historical Performance
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Investment Recommendations */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Top Startups to Watch
              </h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1.5" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {startupsToWatch.map((startup) => (
                <div key={startup.id} className="border rounded-lg hover:shadow-md transition-shadow p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium`}>
                      {startup.logo}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{startup.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                          {startup.stage}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 mb-2">
                        {startup.category}
                      </div>

                      <p className="text-sm text-gray-700 mb-2">
                        {startup.description}
                      </p>

                      <div className="text-xs text-gray-600 mb-3">
                        <span className="font-medium">Traction:</span> {startup.traction}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Brain className="h-3.5 w-3.5 text-purple-600 mr-1" />
                            <span className="text-xs">
                              AI Score: <span className="font-medium">{startup.aiScore}</span>
                            </span>
                          </div>

                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 text-blue-600 mr-1" />
                            <span className="text-xs">
                              Match: <span className="font-medium">{startup.matchScore}%</span>
                            </span>
                          </div>
                        </div>

                        <div>
                          <Link href={`/projects/${startup.id}`}>
                            <Button variant="outline" size="sm" className="h-7 text-xs">View</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Hub */}
          <div className="bg-white rounded-lg shadow-sm border p-5">
            <h2 className="text-lg font-medium flex items-center mb-4">
              <Laptop className="h-5 w-5 mr-2 text-indigo-600" />
              Resource Hub
            </h2>

            <div className="space-y-3">
              <div className="flex items-start p-3 border rounded-md hover:bg-gray-50">
                <FileText className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Q1 2024 Startup Funding Report</h3>
                  <p className="text-xs text-gray-600 mt-1">Comprehensive analysis of funding trends across Nigeria</p>
                  <div className="flex items-center mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start p-3 border rounded-md hover:bg-gray-50">
                <CalendarDays className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Upcoming Pitch Events</h3>
                  <p className="text-xs text-gray-600 mt-1">Schedule of startup pitch events in Lagos for the next month</p>
                  <div className="flex items-center mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      View Calendar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start p-3 border rounded-md hover:bg-gray-50">
                <BarChart2 className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Industry Benchmarks</h3>
                  <p className="text-xs text-gray-600 mt-1">Performance metrics by sector for early-stage startups</p>
                  <div className="flex items-center mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      <Search className="h-3.5 w-3.5 mr-1" />
                      Explore Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}