"use client";

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

interface TimeSeriesData {
  date: string;
  views: number;
  likes?: number;
  comments?: number;
  contactRequests?: number;
  [key: string]: any;
}

interface EngagementLineChartProps {
  data: TimeSeriesData[];
  title: string;
  timeframes?: string[];
}

export default function EngagementLineChart({ 
  data, 
  title,
  timeframes = ['all'] 
}: EngagementLineChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['views', 'likes', 'comments']);
  const [timeframe, setTimeframe] = useState(timeframes[0]);
  
  // Define colors for each metric
  const metricColors: Record<string, string> = {
    views: '#4f46e5',
    likes: '#06b6d4',
    comments: '#8b5cf6',
    contactRequests: '#ec4899',
  };
  
  // Function to format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Function to toggle a metric
  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };
  
  return (
    <div>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      {/* Metric toggle buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Button
          variant={selectedMetrics.includes('views') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleMetric('views')}
          className="h-7 text-xs"
        >
          Views
        </Button>
        <Button
          variant={selectedMetrics.includes('likes') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleMetric('likes')}
          className="h-7 text-xs"
        >
          Likes
        </Button>
        <Button
          variant={selectedMetrics.includes('comments') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleMetric('comments')}
          className="h-7 text-xs"
        >
          Comments
        </Button>
        <Button
          variant={selectedMetrics.includes('contactRequests') ? "default" : "outline"}
          size="sm"
          onClick={() => toggleMetric('contactRequests')}
          className="h-7 text-xs"
        >
          Contact Requests
        </Button>
      </div>
      
      {/* Chart container */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={35}
            />
            <Tooltip
              formatter={(value, name) => {
                return [value, typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name];
              }}
              labelFormatter={(label) => formatDate(label as string)}
            />
            <Legend 
              formatter={(value) => typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value}
            />
            {selectedMetrics.map(metric => data[0]?.[metric] !== undefined && (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                stroke={metricColors[metric]}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}