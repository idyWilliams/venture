"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface EngagementDonutChartProps {
  data: ChartData[];
  title: string;
  height?: number;
}

export default function EngagementDonutChart({
  data,
  title,
  height = 300
}: EngagementDonutChartProps) {
  
  // Default colors if none provided in data
  const defaultColors = ['#4f46e5', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];
  
  // Custom tooltip renderer
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm rounded-md">
          <p className="font-medium">{payload[0].name}: {payload[0].value}</p>
          <p className="text-xs text-gray-500">
            {((payload[0].value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || defaultColors[index % defaultColors.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={renderCustomTooltip} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Optional summary text */}
      <div className="mt-2 text-center text-sm text-gray-600">
        Total: {data.reduce((sum, item) => sum + item.value, 0)}
      </div>
    </div>
  );
}