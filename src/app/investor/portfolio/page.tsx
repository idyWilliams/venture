"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useUserRole } from '@/contexts/UserRoleContext';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Building,
  ChevronRight,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Search,
  Sliders,
  Star,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useUserRole } from '@/src/contexts/UserRoleContext';

// Mock portfolio data
const portfolioData = [
  {
    id: 'inv-1',
    companyName: 'EcoSolutions',
    industry: 'CleanTech',
    investmentDate: '2024-03-15',
    investmentAmount: 500000,
    equity: 8,
    valuation: 6250000,
    currentValuation: 7500000,
    roi: 20,
    stage: 'Seed',
    status: 'Active',
    lastActivity: '2024-05-01',
    founderName: 'James Wilson',
    aiScore: 85,
  },
  {
    id: 'inv-2',
    companyName: 'FinanceAI',
    industry: 'FinTech',
    investmentDate: '2023-11-10',
    investmentAmount: 750000,
    equity: 12,
    valuation: 6250000,
    currentValuation: 8750000,
    roi: 40,
    stage: 'Series A',
    status: 'Active',
    lastActivity: '2024-04-28',
    founderName: 'Sarah Chen',
    aiScore: 92,
  },
  {
    id: 'inv-3',
    companyName: 'MediSync',
    industry: 'HealthTech',
    investmentDate: '2024-01-22',
    investmentAmount: 350000,
    equity: 7,
    valuation: 5000000,
    currentValuation: 5250000,
    roi: 5,
    stage: 'Pre-seed',
    status: 'Active',
    lastActivity: '2024-05-02',
    founderName: 'Dayo Adeyemi',
    aiScore: 78,
  },
];

export default function InvestorPortfolioPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('roi');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  // Sort the portfolio data
  const sortedPortfolio = [...portfolioData].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'desc'
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    }

    return 0;
  });

  // Portfolio statistics
  const totalInvested = portfolioData.reduce((total, item) => total + item.investmentAmount, 0);
  const totalCurrentValue = portfolioData.reduce((total, item) => total + item.currentValuation * (item.equity / 100), 0);
  const totalROI = ((totalCurrentValue - totalInvested) / totalInvested) * 100;
  const averageAIScore = portfolioData.reduce((total, item) => total + item.aiScore, 0) / portfolioData.length;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Investment Portfolio</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance Report
          </Button>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500 mb-1">Total Invested</p>
          <p className="text-2xl font-semibold">{formatCurrency(totalInvested)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500 mb-1">Current Portfolio Value</p>
          <p className="text-2xl font-semibold">{formatCurrency(totalCurrentValue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500 mb-1">Total ROI</p>
          <p className={`text-2xl font-semibold ${totalROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalROI.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500 mb-1">Average AI Success Score</p>
          <div className="flex items-center">
            <p className="text-2xl font-semibold">{averageAIScore.toFixed(1)}</p>
            <Star className="h-5 w-5 text-yellow-500 ml-2" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-4 mb-2 md:mb-0">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'exited' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('exited')}
            >
              Exited
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Sliders className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm font-medium">Sort by:</span>
          </div>
          <select
            className="text-sm border rounded-md p-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="roi">ROI</option>
            <option value="investmentDate">Date</option>
            <option value="investmentAmount">Amount</option>
            <option value="aiScore">AI Score</option>
            <option value="companyName">Company</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
          </Button>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investment Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPortfolio.map((investment) => (
                <tr key={investment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{investment.companyName}</div>
                        <div className="text-sm text-gray-500">{investment.industry} • {investment.stage}</div>
                        <div className="text-xs text-gray-500">Founded by {investment.founderName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(investment.investmentAmount)}</div>
                    <div className="text-sm text-gray-500">{investment.equity}% equity</div>
                    <div className="text-xs text-gray-500">Invested: {new Date(investment.investmentDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Current: {formatCurrency(investment.currentValuation * (investment.equity / 100))}</div>
                    <div className={`text-sm font-medium ${investment.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ROI: {investment.roi}%
                    </div>
                    <div className="text-xs text-gray-500">Last update: {new Date(investment.lastActivity).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 inline-flex text-md leading-5 font-semibold rounded-full ${
                        investment.aiScore >= 85 ? 'bg-green-100 text-green-800' :
                        investment.aiScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {investment.aiScore}
                      </span>
                      <Link
                        href={`/analytics/project/${investment.id}`}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/deal-rooms?project=${investment.id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        <span>Deal Room</span>
                      </Link>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}