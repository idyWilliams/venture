'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';

interface EngagementStatsProps {
  data: {
    views: number;
    likes: number;
    comments: number;
    contactRequests: number;
    viewsOverTime: number[];
    topInvestors: { name: string; views: number }[];
  };
}

export default function EngagementStats({ data }: EngagementStatsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Chart component is a simplified version
  // In a real app, you'd use Chart.js or D3.js for better visualizations
  const SimpleBarChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    return (
      <div className="flex h-40 items-end space-x-2">
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-500 rounded-t-sm"
              style={{ height: `${(value / max) * 100}%` }}
            ></div>
            <div className="text-xs mt-1">{i + 1}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-blue-600">{formatNumber(data.views)}</div>
            <div className="text-sm text-gray-500">Total Views</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-blue-600">{formatNumber(data.likes)}</div>
            <div className="text-sm text-gray-500">Total Likes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-blue-600">{formatNumber(data.comments)}</div>
            <div className="text-sm text-gray-500">Total Comments</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <div className="text-3xl font-bold text-blue-600">{formatNumber(data.contactRequests)}</div>
            <div className="text-sm text-gray-500">Contact Requests</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Views Over Time */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Views Over Time</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeRange('week')}
                className={`px-2 py-1 text-xs rounded ${timeRange === 'week' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeRange('month')}
                className={`px-2 py-1 text-xs rounded ${timeRange === 'month' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeRange('year')}
                className={`px-2 py-1 text-xs rounded ${timeRange === 'year' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
              >
                Year
              </button>
            </div>
          </div>
          
          <SimpleBarChart data={data.viewsOverTime} />
        </CardContent>
      </Card>
      
      {/* Top Investors */}
      <div>
        <h3 className="text-lg font-medium mb-4">Top Investors by Views</h3>
        {data.topInvestors.map((investor, index) => (
          <div key={index} className="flex items-center justify-between mb-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <span className="ml-3 font-medium">{investor.name}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-500">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{investor.views} views</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Engagement Insights */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Engagement Insights</h3>
          <Tabs defaultValue="interest">
            <TabsList className="mb-4">
              <TabsTrigger value="interest">Interest Level</TabsTrigger>
              <TabsTrigger value="conversion">Conversion Rate</TabsTrigger>
            </TabsList>
            
            <TabsContent value="interest">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Overall Investor Interest</span>
                  <span className="font-medium">High</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Based on view duration, comment sentiment, and engagement patterns
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="conversion">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Views to Contact Requests</span>
                  <span className="font-medium">{((data.contactRequests / data.views) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Views to Comments</span>
                  <span className="font-medium">{((data.comments / data.views) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Views to Likes</span>
                  <span className="font-medium">{((data.likes / data.views) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
