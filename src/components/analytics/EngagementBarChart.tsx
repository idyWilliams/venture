"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface EngagementBarChartProps {
  data: ChartData[];
  title: string;
  layout?: "vertical" | "horizontal";
  height?: number;
}

export default function EngagementBarChart({
  data,
  title,
  layout = "vertical",
  height = 300,
}: EngagementBarChartProps) {
  // Handle custom colors for each bar
  const getBarColor = (index: number) => {
    if (data[index]?.color) {
      return data[index].color;
    }

    // Default colors if none provided
    const defaultColors = [
      "#4f46e5",
      "#06b6d4",
      "#8b5cf6",
      "#ec4899",
      "#10b981",
    ];
    return defaultColors[index % defaultColors.length];
  };

  return (
    <div>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}

      <div style={{ width: "100%", height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {layout === "vertical" ? (
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f5f5f5"
                horizontal={false}
              />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip
                formatter={(value) => [`${value}`, "Value"]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index)} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barSize={35}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f5f5f5"
                vertical={false}
              />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
              <YAxis tick={{ fontSize: 12 }} width={35} />
              <Tooltip
                formatter={(value) => [`${value}`, "Value"]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Bar
                    key={`cell-${index}`}
                    fill={getBarColor(index)}
                    dataKey={index}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
