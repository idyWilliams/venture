"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StatisticItem {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface EngagementStatCardsProps {
  statistics: StatisticItem[];
  columns?: 2 | 3 | 4;
}

export default function EngagementStatCards({
  statistics,
  columns = 4,
}: EngagementStatCardsProps) {
  return (
    <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`}>
      {statistics.map((stat, index) => {
        // Default colors if not provided
        const defaultColors = {
          blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500' },
          green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-500' },
          purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-500' },
          orange: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500' },
          red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500' },
          gray: { bg: 'bg-gray-50', text: 'text-gray-700', icon: 'text-gray-500' },
        };
        
        const colorKey = stat.color || Object.keys(defaultColors)[index % Object.keys(defaultColors).length] as keyof typeof defaultColors;
        const colorSet = defaultColors[colorKey as keyof typeof defaultColors];
        
        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h4 className="text-2xl font-bold mt-1">{stat.value}</h4>
                  
                  {stat.change !== undefined && (
                    <div className="flex items-center mt-1">
                      <span 
                        className={`text-sm font-medium ${
                          stat.change > 0 ? 'text-green-600' : 
                          stat.change < 0 ? 'text-red-600' : 
                          'text-gray-500'
                        }`}
                      >
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </span>
                      
                      {stat.changeLabel && (
                        <span className="text-xs text-gray-500 ml-1">
                          {stat.changeLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {stat.icon && (
                  <div className={`p-3 rounded-full ${colorSet.bg} ${colorSet.icon}`}>
                    {stat.icon}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}